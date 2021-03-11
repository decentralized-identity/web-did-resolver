import { Resolver, DIDResolver, DIDDocument } from 'did-resolver'
import { getResolver } from '../resolver'
import fetch from 'cross-fetch'
jest.mock('cross-fetch')
import { mocked } from 'ts-jest/utils'
const mockedFetch = mocked(fetch, true)

describe('web did resolver', () => {
  const did: string = 'did:web:example.com'
  const didLong: string = 'did:web:example.com:user:alice'
  const identity: string = '0x2Cc31912B2b0f3075A87b3640923D45A26cef3Ee'
  const validResponse: DIDDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: did,
    publicKey: [
      {
        id: `${did}#owner`,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: did,
        ethereumAddress: identity
      }
    ],
    authentication: [`${did}#owner`]
  }

  const validResponseLong: DIDDocument = JSON.parse(
    JSON.stringify(validResponse).replace(did, didLong)
  )
  const noContextResponse: object = {
    id: validResponse.id,
    publicKey: validResponse.publicKey,
    authentication: validResponse.authentication
  }
  const wrongIdResponse: object = {
    '@context': validResponse['@context'],
    id: 'did:web:wrong.com',
    publicKey: validResponse.publicKey,
    authentication: validResponse.authentication
  }

  let didResolver: Resolver
  let webDidResolver: { [index: string]: DIDResolver }

  beforeAll(async () => {
    webDidResolver = getResolver()
    didResolver = new Resolver(webDidResolver)
  })

  it('resolves document', async () => {
    expect.assertions(2)
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(validResponse)
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didDocument).toEqual(validResponse)
    expect(result.didResolutionMetadata.contentType).toEqual(
      'application/did+ld+json'
    )
  })

  it('resolves document with long did', async () => {
    expect.assertions(1)
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(validResponseLong)
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didDocument).toEqual(validResponseLong)
  })

  it('fails if the did is not a valid https url', async () => {
    expect.assertions(1)
    mockedFetch.mockRejectedValueOnce({ status: 404 })
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
  })

  it('fails if the did document is not valid json', async () => {
    expect.assertions(2)
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.reject(new Error('unable to parse json'))
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
    expect(result.didResolutionMetadata.message).toMatch(/unable to parse json/)
  })

  it('fails if the did document id does not match', async () => {
    expect.assertions(2)
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(wrongIdResponse)
    } as Response)
    const result = await didResolver.resolve(did)
    expect(result.didResolutionMetadata.error).toEqual('notFound')
    expect(result.didResolutionMetadata.message).toMatch(
      /DID document id does not match requested did/
    )
  })

  it('returns correct contentType without @context', async () => {
    expect.assertions(1)
    mockedFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(noContextResponse)
    } as Response)
    const result = await didResolver.resolve(did)

    expect(result.didResolutionMetadata.contentType).toEqual(
      'application/did+json'
    )
  })
})
