import { DIDDocument, DIDResolutionResult, DIDResolver, ParsedDID } from 'did-resolver'

const DOC_PATH = '/.well-known/did.json'

type ResolutionErrorCode = 'notFound' | 'resolutionError'

class WebResolutionError extends Error {
  constructor(
    readonly code: ResolutionErrorCode,
    message: string
  ) {
    super(message)
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function get(url: string): Promise<any> {
  let res: Response
  try {
    res = await fetch(url, { mode: 'cors' })
  } catch (error) {
    throw new WebResolutionError('resolutionError', `Unable to retrieve DID document: ${errorMessage(error)}`)
  }

  if (typeof res.status === 'number' && res.status >= 400) {
    throw new WebResolutionError(
      res.status === 404 ? 'notFound' : 'resolutionError',
      `DID document request failed with HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''}`
    )
  }

  try {
    return await res.json()
  } catch (error) {
    throw new WebResolutionError('resolutionError', `DID document is not valid JSON: ${errorMessage(error)}`)
  }
}

function isValidWebAuthority(authority: string): boolean {
  let host = authority
  let port: string | undefined

  if (authority.startsWith('[')) {
    const match = authority.match(/^(\[[^\]]+\])(?::(\d+))?$/)
    if (!match) {
      return false
    }
    host = match[1]
    port = match[2]
  } else {
    const portSeparator = authority.lastIndexOf(':')
    if (portSeparator !== -1) {
      host = authority.slice(0, portSeparator)
      port = authority.slice(portSeparator + 1)
    }
  }

  if (!host || (port !== undefined && (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535))) {
    return false
  }

  try {
    const url = new URL(`https://${authority}`)
    return url.pathname === '/' && !url.username && !url.password && !url.search && !url.hash && !!url.hostname
  } catch {
    return false
  }
}

export function webParser(parsed: ParsedDID): ParsedDID | null {
  const [host, ...path] = parsed.id.split(':')

  if (!host || path.some((segment) => !segment)) {
    return null
  }

  try {
    return isValidWebAuthority(decodeURIComponent(host)) ? parsed : null
  } catch {
    return null
  }
}

export function getResolver(): Record<string, DIDResolver> {
  async function resolve(_did: string, parsed: ParsedDID): Promise<DIDResolutionResult> {
    let err: WebResolutionError | undefined
    let path = decodeURIComponent(parsed.id) + DOC_PATH
    const id = parsed.id.split(':')
    if (id.length > 1) {
      path = id.map(decodeURIComponent).join('/') + '/did.json'
    }

    const url = `https://${path}`

    const didDocumentMetadata = {}
    let didDocument: DIDDocument | null = null

    do {
      try {
        didDocument = await get(url)
      } catch (error) {
        err =
          error instanceof WebResolutionError
            ? error
            : new WebResolutionError('resolutionError', `Unable to resolve DID document: ${errorMessage(error)}`)
        break
      }

      const docIdMatchesDid = didDocument?.id === parsed.did
      if (!docIdMatchesDid) {
        err = new WebResolutionError('notFound', 'DID document id does not match requested DID')
        didDocument = null
        break
      }
    } while (false)

    const contentType =
      typeof didDocument?.['@context'] !== 'undefined' ? 'application/did+ld+json' : 'application/did+json'

    if (err) {
      return {
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata: {
          error: err.code,
          message: err.message,
        },
      }
    } else {
      return {
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata: { contentType },
      }
    }
  }

  return { web: Object.assign(resolve, { parser: webParser }) }
}
