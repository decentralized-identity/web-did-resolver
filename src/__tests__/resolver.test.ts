import { Resolver, DIDResolver, DIDDocument } from 'did-resolver'
import getResolver from '../resolver'
import mock from 'xhr-mock'
import axios from 'axios'
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('web did resolver', () => {
  const did: string = 'did:web:example.com'
  const identity: string = '0x2Cc31912B2b0f3075A87b3640923D45A26cef3Ee'
  const validResponse: DIDDocument = {
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
  const noContextResponse: object = {
    id: validResponse.id,
    publicKey: validResponse.publicKey,
    authentication: validResponse.authentication,
  }
  const wrongIdResponse: object = {
    '@context': validResponse['@context'],
    id: 'did:web:wrong.com',
    publicKey: validResponse.publicKey,
    authentication: validResponse.authentication,
  }
  const noPublicKeyResponse: object = {
    '@context': validResponse['@context'],
    id: validResponse.id,
    authentication: validResponse.authentication,
  }

  let didResolver: Resolver
  let webDidResolver: { [index: string]: DIDResolver }

  beforeAll(async () => {
    webDidResolver = getResolver()
    didResolver = new Resolver(webDidResolver)
  })
  beforeEach(() => mock.setup())
  afterEach(() => mock.teardown())

  it('resolves document', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: validResponse })
    return expect(didResolver.resolve(did)).resolves.toEqual(validResponse)
  })

  it('fails if the did is not a valid https url', () => {
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 404 } })
    return expect(didResolver.resolve(did)).rejects.toThrow()
  })

  it('fails if the did document is missing a context', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: noContextResponse })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID document missing context',
    )
  })

  it('fails if the did document id does not match', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: wrongIdResponse })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID document id does not match requested did',
    )
  })

  it('fails if the did document has no public keys', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: noPublicKeyResponse })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID document has no public keys',
    )
  })
})
