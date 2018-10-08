declare interface DIDDoc {
  '@context': 'https://w3id.org/did/v1'
  id: string
  publicKey: PublicKey[]
  authentication: Authentication[]
}

declare interface PublicKey {
  id: string
  type: string
  owner: string
  ethereumAddress?: string
}

declare interface Authentication {
  type: string
  publicKey: string
}

declare interface ParsedDID {
  did: string
  method: string
  id: string
}
