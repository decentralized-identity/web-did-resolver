import axios from 'axios'
import { registerMethod } from 'did-resolver'

const DOC_PATH = '/.well-known/did.json'

export default function register() {
  async function resolve(
    did: string,
    parsed: ParsedDID
  ): Promise<DIDDoc | null> {
    const url: string = `https://${parsed.id}${DOC_PATH}`
    try {
      const res = await axios.get(url)
      // even if the requested url is https, an http response
      // will be 200 so check the request agent protocol
      // (would parsing res.request.res.responseUrl be better?)
      const isHttp = res.request.agent.protocol.trim() === 'http'
      if (isHttp) throw new Error(`Not a valid https DID: ${did}`)
      // other types of 200 responses that should
      // not be treated as a valid https response?

      const isJson =
        res.headers['content-type'] === 'application/json' &&
        res.data !== null &&
        typeof res.data === 'object'
      // allow other content-types such as text/plain?
      if (!isJson) throw new Error(`Invalid DID document type`)

      const hasContext = res.data['@context'] === 'https://w3id.org/did/v1'
      if (!hasContext) throw new Error('DID document missing context')

      const docIdMatchesDid = res.data.id === did
      if (!docIdMatchesDid)
        throw new Error('DID document id does not match requested did')

      const docHasPublicKey =
        Array.isArray(res.data.publicKey) && res.data.publicKey.length > 0
      if (!docHasPublicKey) throw new Error('DID document has no public keys')
      // validate each public key object?
      // need to validate any other did doc attributes?

      return res.data
    } catch (error) {
      throw error
    }
  }
  registerMethod('https', resolve)
}
