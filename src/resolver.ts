import { ParsedDID, DIDDocument } from 'did-resolver'
import axios from 'axios'

const DOC_PATH = '/.well-known/did.json'

function get(url: string): Promise<any> {
  return axios.get(url, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export default function getResolver() {
  async function resolve(
    did: string,
    parsed: ParsedDID,
  ): Promise<DIDDocument | null> {
    const url: string = `https://${parsed.id}${DOC_PATH}`

    let response: any = null
    try {
      response = await get(url)
    } catch (error) {
      throw new Error(`DID must resolve to a valid https URL: ${error.message}`)
    }

    const { data } = response

    const hasContext = data['@context'] === 'https://w3id.org/did/v1'
    if (!hasContext) throw new Error('DID document missing context')

    const docIdMatchesDid = data.id === did
    if (!docIdMatchesDid)
      throw new Error('DID document id does not match requested did')

    const docHasPublicKey =
      Array.isArray(data.publicKey) && data.publicKey.length > 0
    if (!docHasPublicKey) throw new Error('DID document has no public keys')

    return data
  }

  return { web: resolve }
}
