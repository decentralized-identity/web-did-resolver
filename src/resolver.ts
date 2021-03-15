import fetch from 'cross-fetch'
import {
  DIDDocument,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID
} from 'did-resolver'

const DOC_PATH = '/.well-known/did.json'

async function get(url: string): Promise<any> {
  const res = await fetch(url, { mode: 'cors' })
  if (res.status >= 400) {
    throw new Error(`Bad response ${res.statusText}`)
  }
  return res.json()
}

export function getResolver(): Record<string, DIDResolver> {
  async function resolve(
    did: string,
    parsed: ParsedDID
  ): Promise<DIDResolutionResult> {
    let err = null
    let path = decodeURIComponent(parsed.id) + DOC_PATH
    const id = parsed.id.split(':')
    if (id.length > 1) {
      path = id.map(decodeURIComponent).join('/') + '/did.json'
    }

    const url: string = `https://${path}`

    const didDocumentMetadata = {}
    let didDocument: DIDDocument | null = null

    do {
      try {
        didDocument = await get(url)
      } catch (error) {
        err = `DID must resolve to a valid https URL containing a JSON document: ${error}`
        break
      }

      // TODO: this excludes the use of query params
      const docIdMatchesDid = didDocument?.id === did
      if (!docIdMatchesDid) {
        err = 'DID document id does not match requested did'
        // break // uncomment this when adding more checks
      }
    } while (false)

    const contentType =
      typeof didDocument?.['@context'] !== 'undefined'
        ? 'application/did+ld+json'
        : 'application/did+json'

    if (err) {
      return {
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata: {
          error: 'notFound',
          message: err
        }
      }
    } else {
      return {
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata: { contentType }
      }
    }
  }

  return { web: resolve }
}
