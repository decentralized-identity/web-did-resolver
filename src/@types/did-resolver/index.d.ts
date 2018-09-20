/// <reference path="../did.d.ts" />

declare module 'did-resolver' {
  export function registerMethod(
    method: string,
    resolver: (did: string, parsed: ParsedDID) => Promise<DIDDoc | null>
  ): void
  export function parse(did: string): any
  export default function resolve(did: string): Promise<DIDDoc | null>
}
