/**
 * Types should be included in did-resolver package
 */
interface DIDDoc {
  '@context': 'https://w3id.org/did/v1'
  id: string
  publicKey: PublicKey[]
  authentication: Authentication[]
}

interface PublicKey {
  id: string
  type: string
  owner: string
  ethereumAddress?: string
}

interface Authentication {
  type: string
  publicKey: string
}

interface ParsedDID {
  did: string
  method: string
  id: string
}

declare module 'did-resolver' {
  export function registerMethod(
    method: string,
    resolver: (did: string, parsed: ParsedDID) => Promise<DIDDoc | null>,
  ): void
  export function parse(did: string): any
  export default function resolve(did: string): Promise<DIDDoc | null>
}
