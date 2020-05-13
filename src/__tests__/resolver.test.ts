import { Resolver, DIDResolver, DIDDocument } from 'did-resolver'
import { getResolver } from '../resolver'
import fetch from 'cross-fetch'
jest.mock('cross-fetch')
const mockedFetch = fetch as jest.Mock<typeof fetch>

describe('web did resolver', () => {
  const did: string = 'did:web:example.com'
  const didLong: string = 'did:web:example.com:user:alice'
  const identity: string = '0x2Cc31912B2b0f3075A87b3640923D45A26cef3Ee'
  const validResponse: DIDDocument = {
    '@context': 'https://w3id.org/did/v1',
    id: did,
    publicKey: [
      {
        id: `${did}#owner`,
        type: 'Secp256k1VerificationKey2018',
        owner: did,
        ethereumAddress: identity
      }
    ],
    authentication: [
      {
        type: 'Secp256k1SignatureAuthentication2018',
        publicKey: `${did}#owner`
      }
    ]
  }

  const validResponseLong: DIDDocument = JSON.parse(JSON.stringify(validResponse).replace(did, didLong))
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
  const noPublicKeyResponse: object = {
    '@context': validResponse['@context'],
    id: validResponse.id,
    authentication: validResponse.authentication
  }

  let didResolver: Resolver
  let webDidResolver: { [index: string]: DIDResolver }

  beforeAll(async () => {
    webDidResolver = getResolver()
    didResolver = new Resolver(webDidResolver)
  })

  it('resolves document', () => {
    mockedFetch.mockResolvedValueOnce({
      json: () => validResponse
    })
    return expect(didResolver.resolve(did)).resolves.toEqual(validResponse)
  })

  it('resolves document with long did', () => {
    mockedFetch.mockResolvedValueOnce({
      json: () => validResponseLong
    })
    return expect(didResolver.resolve(didLong)).resolves.toEqual(validResponseLong)
  })


  it('fails if the did is not a valid https url', () => {
    mockedFetch.mockRejectedValueOnce({ status: 404 })
    return expect(didResolver.resolve(did)).rejects.toThrow()
  })

  it('fails if the did document is not valid json', () => {
    mockedFetch.mockResolvedValueOnce({
      json: () => {
        throw new Error('unable to parse json')
      }
    })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      /unable to parse json/
    )
  })

  it('fails if the did document id does not match', () => {
    mockedFetch.mockResolvedValueOnce({
      json: () => wrongIdResponse
    })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID document id does not match requested did'
    )
  })

  it('fails if the did document has no public keys', () => {
    mockedFetch.mockResolvedValueOnce({
      json: () => noPublicKeyResponse
    })
    return expect(didResolver.resolve(did)).rejects.toThrowError(
      'DID document has no public keys'
    )
  })
})
