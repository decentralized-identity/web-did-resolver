import resolve from 'did-resolver'
import register from '../register'
import mockAxios from 'axios'
// TODO @mi-xu: figure out better typescript support for the mocked module

describe('https did resolver', () => {
  const did: string = 'did:https:example.com'
  const identity: string = '0x2Cc31912B2b0f3075A87b3640923D45A26cef3Ee'
  const validDidDoc: DIDDoc = {
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
  const httpsRequest = { agent: { protocol: 'https ' } }
  const httpRequest = { agent: { protocol: 'http ' } }
  const jsonHeaders = { 'content-type': 'application/json' }
  const htmlHeaders = { 'content-type': 'text/html' }

  beforeAll(() => {
    register()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('resolves document', () => {
    // we need to assert the type as a jest mock here because typescript
    // does not understand that it's being mocked
    (mockAxios.get as jest.Mock<any>).mockImplementationOnce(() =>
      Promise.resolve({
        data: validDidDoc,
        request: httpsRequest,
        headers: jsonHeaders,
      })
    )
    return expect(resolve(did)).resolves.toEqual(validDidDoc)
  })

  it('fails if the did document is not valid json', () => {
    (mockAxios.get as jest.Mock<any>).mockImplementationOnce(() =>
      Promise.resolve({
        data: null,
        request: httpsRequest,
        headers: htmlHeaders,
      })
    )
    return expect(resolve(did)).rejects.toThrowError(
      'Invalid DID document type'
    )
  })

  it('fails if the did document is missing a context', () => {
    const { id, publicKey, authentication } = validDidDoc;
    (mockAxios.get as jest.Mock<any>).mockImplementationOnce(() =>
      Promise.resolve({
        data: { id, publicKey, authentication },
        request: httpsRequest,
        headers: jsonHeaders,
      })
    )
    return expect(resolve(did)).rejects.toThrowError(
      'DID document missing context'
    )
  })

  it('fails if the did document id does not match', () => {
    (mockAxios.get as jest.Mock<any>).mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          ...validDidDoc,
          id: 'did:ethr:0x123456',
        },
        request: httpsRequest,
        headers: jsonHeaders,
      })
    )
    return expect(resolve(did)).rejects.toThrowError(
      'DID document id does not match requested did'
    )
  })

  it('fails if the did document has no public keys', () => {
    const { publicKey, ...invalidDidDoc } = validDidDoc;
    (mockAxios.get as jest.Mock<any>).mockImplementationOnce(() =>
      Promise.resolve({
        data: invalidDidDoc,
        request: httpsRequest,
        headers: jsonHeaders,
      })
    )
    return expect(resolve(did)).rejects.toThrowError(
      'DID document has no public keys'
    )
  })

  it('fails if the did is an invalid https url', () => {
    (mockAxios.get as jest.Mock<any>).mockImplementationOnce(() =>
      Promise.reject(new Error('invalid https cert'))
    )
    return expect(resolve(did)).rejects.toThrowError('invalid https cert')
  })

  it('fails if the did is an http url', () => {
    (mockAxios.get as jest.Mock<any>).mockImplementationOnce(() =>
      Promise.resolve({
        request: httpRequest,
      })
    )
    return expect(resolve(did)).rejects.toThrowError('Not a valid https DID')
  })
})
