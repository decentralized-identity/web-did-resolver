import { ParsedDID, DIDDocument } from 'did-resolver'

declare global {
  interface Window {
    XMLHttpRequest: any
  }
}
declare var require: any

const DOC_PATH = '/.well-known/did.json'

function get(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // declare XMLHttpRequest in here so it can be mocked for tests
    const XMLHttpRequest =
      typeof window !== 'undefined'
        ? window.XMLHttpRequest
        : require('xmlhttprequest').XMLHttpRequest

    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.onreadystatechange = () => {
      if (!request || request.readyState !== 4) return
      if (request.status === 200) {
        resolve(request.responseText)
      } else {
        reject(
          new Error(
            `Invalid http response status ${request.status} ${
              request.responseText
              }`.trim(),
          ),
        )
      }
    }
    request.setRequestHeader('accept', 'application/json')
    request.send()
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

    let data: any = null
    try {
      data = JSON.parse(response)
    } catch (error) {
      throw new Error('DID must resolve to a JSON document')
    }

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

  return { 'web': resolve }
}
