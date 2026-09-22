import { Resolver, type DIDDocument, type ParsedDID, type Resolvable } from 'did-resolver'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getResolver, webParser } from '../index.js'

const mockedFetch = vi.fn()

describe('web did resolver', () => {
  const did: string = 'did:web:example.com'
  const didLong: string = 'did:web:example.com:user:alice'
  const didWithPort: string = 'did:web:localhost%3A8443'
  const didWithEncodedPath: string = 'did:web:example.com:path:some%2Bsubpath'
  const identity: string = '0x2Cc31912B2b0f3075A87b3640923D45A26cef3Ee'
  const validResponse: DIDDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: did,
    publicKey: [
      {
        id: `${did}#owner`,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: did,
        ethereumAddress: identity,
      },
    ],
    authentication: [`${did}#owner`],
  }

  let didResolver: Resolvable

  beforeAll(() => {
    vi.stubGlobal('fetch', mockedFetch)
    didResolver = new Resolver(getResolver())
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    mockedFetch.mockClear()
  })

  it('resolves document', async () => {
    expect.assertions(2)
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(validResponse),
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didDocument).toEqual(validResponse)
    expect(result.didResolutionMetadata.contentType).toEqual('application/did+ld+json')
  })

  it('resolves document with long did', async () => {
    expect.assertions(1)
    const validResponseLong: DIDDocument = JSON.parse(JSON.stringify(validResponse).replace(did, didLong))
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(validResponseLong),
    } as Response)
    const result = await didResolver.resolve(didLong)
    expect(result.didDocument).toEqual(validResponseLong)
  })

  it('returns resolutionError if the DID document cannot be retrieved', async () => {
    expect.assertions(2)
    mockedFetch.mockRejectedValueOnce(new Error('network failure'))
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('resolutionError')
    expect(result.didResolutionMetadata.message).toMatch(/Unable to retrieve DID document: network failure/)
  })

  it('returns resolutionError if the DID document request rejects with a non-Error value', async () => {
    expect.assertions(2)
    mockedFetch.mockRejectedValueOnce('network failure')
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('resolutionError')
    expect(result.didResolutionMetadata.message).toMatch(/Unable to retrieve DID document: network failure/)
  })

  it('returns notFound if the DID document does not exist', async () => {
    expect.assertions(2)
    mockedFetch.mockResolvedValueOnce({
      status: 404,
      statusText: 'Not Found',
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
    expect(result.didResolutionMetadata.message).toEqual('DID document request failed with HTTP 404 Not Found')
  })

  it('returns resolutionError if the DID document is not valid JSON', async () => {
    expect.assertions(3)
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.reject(new Error('unable to parse json')),
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didDocument).toBeNull()
    expect(result.didResolutionMetadata.error).toEqual('resolutionError')
    expect(result.didResolutionMetadata.message).toMatch(/DID document is not valid JSON: unable to parse json/)
  })

  it('returns resolutionError if the web server produces an error', async () => {
    expect.assertions(2)
    mockedFetch.mockResolvedValueOnce({
      status: 400,
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('resolutionError')
    expect(result.didResolutionMetadata.message).toEqual('DID document request failed with HTTP 400')
  })

  it('fails if the did document id does not match', async () => {
    expect.assertions(3)
    const wrongIdResponse: DIDDocument = {
      ...validResponse,
      id: 'did:web:wrong.com',
    }
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(wrongIdResponse),
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didDocument).toBeNull()
    expect(result.didResolutionMetadata.error).toEqual('notFound')
    expect(result.didResolutionMetadata.message).toEqual('DID document id does not match requested DID')
  })

  it('returns correct contentType without @context', async () => {
    expect.assertions(1)
    const noContextResponse: DIDDocument = {
      ...validResponse,
    }
    delete noContextResponse['@context']
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(noContextResponse),
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.contentType).toEqual('application/did+json')
  })

  it('resolves doc with port did', async () => {
    expect.assertions(2)
    const validResponsePort: DIDDocument = JSON.parse(JSON.stringify(validResponse).replace(did, didWithPort))
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(validResponsePort),
    } as Response)
    const result = await didResolver.resolve(didWithPort)
    expect(result.didDocument).toEqual(validResponsePort)
    expect(mockedFetch).toHaveBeenCalledWith('https://localhost:8443/.well-known/did.json', {
      mode: 'cors',
    })
  })

  it('resolves doc with URI encoded path components', async () => {
    expect.assertions(2)
    const validResponseEncodedPath: DIDDocument = JSON.parse(
      JSON.stringify(validResponse).replace(did, didWithEncodedPath)
    )
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(validResponseEncodedPath),
    } as Response)
    const result = await didResolver.resolve(didWithEncodedPath)
    expect(result.didDocument).toEqual(validResponseEncodedPath)
    expect(mockedFetch).toHaveBeenCalledWith('https://example.com/path/some+subpath/did.json', {
      mode: 'cors',
    })
  })

  it.each([
    'did:web:',
    'did:web::user',
    'did:web:example.com::user',
    'did:web:%3A8443',
    'did:web:%',
    'did:web:%25',
    'did:web:example.com%2Fpath',
    'did:web:example.com%3A',
    'did:web:example.com%3A0',
    'did:web:example.com%3A65536',
    'did:web:user%40example.com',
    'did:web:example.com%3Fservice=agent',
    'did:web:%5B%3A%3A1',
  ])('returns invalidDid without fetching malformed DID %s', async (malformedDid) => {
    const result = await didResolver.resolve(malformedDid)
    expect(result).toEqual({
      didDocument: null,
      didDocumentMetadata: {},
      didResolutionMetadata: { error: 'invalidDid' },
    })
    expect(mockedFetch).not.toHaveBeenCalled()
  })

  it('rejects a parser input with malformed percent encoding in its authority', () => {
    const parsed: ParsedDID = {
      did: 'did:web:%',
      didUrl: 'did:web:%',
      method: 'web',
      id: '%',
    }
    expect(webParser(parsed)).toBeNull()
  })

  it('returns resolutionError if an unexpected error occurs while resolving a DID document', async () => {
    expect.assertions(2)
    mockedFetch.mockResolvedValueOnce({
      get status(): number {
        throw new Error('unexpected response error')
      },
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('resolutionError')
    expect(result.didResolutionMetadata.message).toEqual('Unable to resolve DID document: unexpected response error')
  })

  it('resolves a DID with an IPv6 host and port', async () => {
    const didWithIPv6 = 'did:web:%5B%3A%3A1%5D%3A8443'
    const validResponseIPv6: DIDDocument = JSON.parse(JSON.stringify(validResponse).replace(did, didWithIPv6))
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(validResponseIPv6),
    } as Response)
    const result = await didResolver.resolve(didWithIPv6)
    expect(result.didDocument).toEqual(validResponseIPv6)
    expect(mockedFetch).toHaveBeenCalledWith('https://[::1]:8443/.well-known/did.json', {
      mode: 'cors',
    })
  })

  it.each(['#key-1', '?service=agent'])('resolves a DID URL with %s', async (suffix) => {
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(validResponse),
    } as Response)
    const result = await didResolver.resolve(`${did}${suffix}`)
    expect(result.didDocument).toEqual(validResponse)
    expect(result.didResolutionMetadata.error).toBeUndefined()
  })
})
