import { Resolver, DIDDocument, DIDResolver } from 'did-resolver'
import getResolver from '../resolver'

describe('web did resolver', () => {
  const did: string = 'did:web:uport.me'

  let didResolver: Resolver
  let webDidResolver: { [index: string]: DIDResolver }

  beforeAll(async () => {
    webDidResolver = getResolver()
    didResolver = new Resolver(webDidResolver)
  })

  it('resolves document', () => {
    return expect(didResolver.resolve(did)).resolves.toEqual({ "@context": "https://w3id.org/did/v1", "authentication": [{ "publicKey": "did:web:uport.me#owner", "type": "Secp256k1SignatureAuthentication2018" }], "id": "did:web:uport.me", "publicKey": [{ "id": "did:web:uport.me#owner", "owner": "did:web:uport.me", "publicKeyHex": "042b0af9b3ae6c7c3a90b01a3879d9518081bc0dcdf038488db9cb109b082a77d97ea3373e3dfde0eccd9adbdce11d0302ea5c098dbb0b310234c86895c8641622", "type": "Secp256k1VerificationKey2018" }], "service": [] })
  })

})
