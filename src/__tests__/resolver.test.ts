import { Resolver, DIDDocument, DIDResolver } from 'did-resolver'
import getResolver from '../resolver'
import mock from 'xhr-mock'

describe('https did resolver', () => {
  const did: string = 'did:https:example.com'
  const url: string = 'https://example.com/.well-known/did.json'
  const identity: string = '0x2Cc31912B2b0f3075A87b3640923D45A26cef3Ee'
  const validDidDoc: DIDDocument = {
    '@context': 'https://w3id.org/did/v1',
    id: did,
    publicKey: [
      {
        id: `${did}#owner`,
        type: 'Secp256k1VerificationKey2018',
        owner: did,
        ethereumAddress: identity,
      },
    ],
    authentication: [
      {
        type: 'Secp256k1SignatureAuthentication2018',
        publicKey: `${did}#owner`,
      },
    ],
  }
  const validResponse: string = JSON.stringify(validDidDoc)
  const noContextResponse: string = JSON.stringify({
    id: validDidDoc.id,
    publicKey: validDidDoc.publicKey,
    authentication: validDidDoc.authentication,
  })
  const wrongIdResponse: string = JSON.stringify({
    '@context': validDidDoc['@context'],
    id: 'did:https:wrong.com',
    publicKey: validDidDoc.publicKey,
    authentication: validDidDoc.authentication,
  })
  const noPublicKeyResponse: string = JSON.stringify({
    '@context': validDidDoc['@context'],
    id: validDidDoc.id,
    authentication: validDidDoc.authentication,
  })

  let didResolver: Resolver
  let httpsDidResolver: { [index: string]: DIDResolver }

  beforeAll(async () => {
    httpsDidResolver = getResolver()
    didResolver = new Resolver(httpsDidResolver)
  })
  beforeEach(() => mock.setup())
  afterEach(() => mock.teardown())

  it('resolves document', () => {
    mock.get(url, { status: 200, body: validResponse })
    return expect(didResolver.resolve(did)).resolves.toEqual(validDidDoc)
  })

  it('fails if the did is not a valid https url', () => {
    mock.get(url, { status: 404 })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID must resolve to a valid https URL: Invalid http response status 404',
    )
  })

  it('fails if the did document is not valid json', () => {
    mock.get(url, { status: 200, body: 'invalid json' })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID must resolve to a JSON document',
    )
  })

  it('fails if the did document is missing a context', () => {
    mock.get(url, { status: 200, body: noContextResponse })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID document missing context',
    )
  })

  it('fails if the did document id does not match', () => {
    mock.get(url, { status: 200, body: wrongIdResponse })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID document id does not match requested did',
    )
  })

  it('fails if the did document has no public keys', () => {
    mock.get(url, { status: 200, body: noPublicKeyResponse })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID document has no public keys',
    )
  })
})
