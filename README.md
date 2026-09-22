[![npm](https://img.shields.io/npm/dt/web-did-resolver.svg)](https://www.npmjs.com/package/web-did-resolver)
[![npm](https://img.shields.io/npm/v/web-did-resolver.svg)](https://www.npmjs.com/package/web-did-resolver)
[![codecov](https://codecov.io/gh/decentralized-identity/web-did-resolver/branch/develop/graph/badge.svg)](https://codecov.io/gh/decentralized-identity/web-did-resolver)

# Web DID Resolver

This library is intended to represent domains accessed through https as
[Decentralized Identifiers](https://w3c.github.io/did-core/#identifier)
and retrieve an associated [DID Document](https://w3c.github.io/did-core/#did-document-properties)

It supports the proposed [`did:web` method spec](https://w3c-ccg.github.io/did-method-web/) from the [W3C Credentials Community Group](https://w3c-ccg.github.io).

It requires the `did-resolver` library, which is the primary interface for resolving DIDs.

## Runtime requirements

This library resolves DID documents using the runtime's global `fetch` and no longer
bundles a `fetch` polyfill. It requires one of:

- A modern browser (all evergreen browsers ship `fetch`)
- Node.js `>=22`
- React Native `>=0.76` (Hermes with `fetch` support)

If you target an older runtime without a global `fetch` (for example Node.js `<18` or an older React Native/Hermes engine), polyfill `fetch` yourself (e.g. via `cross-fetch` or `whatwg-fetch`) before importing this package.

## Migration from 2.x

Version 3 requires `did-resolver` version 6. Consumers using `did-resolver` 4 or 5 must upgrade to avoid incompatible duplicate TypeScript types.

Malformed `did:web` identifiers now resolve with `didResolutionMetadata.error` set to
`invalidDid` rather than `notFound`. The exported `webParser` can also be reused when
assembling a custom `ResolverRegistry`.

## DID method

To encode a DID for an HTTPS domain, simply prepend `did:web:` to domain name.

eg: `https://example.com -> did:web:example.com`

## DID Document

The DID resolver takes the domain and forms a [well-known URI](https://tools.ietf.org/html/rfc5785) to access the DID Document.

For a did `did:web:example.com`, the resolver will attempt to access the document at
`https://example.com/.well-known/did.json`

A minimal DID Document might contain the following information:

```json
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:web:example.com",
  "publicKey": [
    {
      "id": "did:web:example.com#owner",
      "type": "Secp256k1VerificationKey2018",
      "controller": "did:web:example.com",
      "publicKeyHex": "04ab0102bcae6c7c3a90b01a3879d9518081bc06123038488db9cb109b082a77d97ea3373e3dfde0eccd9adbdce11d0302ea5c098dbb0b310234c8689501749274"
    }
  ],
  "assertionMethod": [ "did:web:example.com#owner" ],
  "authentication": [ "did:web:example.com#owner" ]
}
```

Note: this example uses the `Secp256k1VerificationKey2018` type and an `publicKeyHex` as a publicKey entry, signaling that this DID is claiming to control the private key associated with that publicKey.

## Resolving a DID document

`getResolver()` returns a resolver registry for the `did:web` method. Pass it to
`Resolver`, optionally merging it with registries for other DID methods.

```js
import { Resolver } from 'did-resolver'
import { getResolver, webParser } from 'web-did-resolver'

const webResolver = getResolver()

const didResolver = new Resolver({
    ...webResolver,
    // Merge resolver registries for additional DID methods here.
})

didResolver.resolve('did:web:uport.me').then(doc => console.log(doc))

// You can also use async/await syntax
;(async () => {
    const doc = await didResolver.resolve('did:web:uport.me')
    console.log(doc)
})();
```

`getResolver()` attaches `webParser` to its `did:web` resolver automatically. When
constructing a registry manually, attach `webParser` to the method resolver so malformed
identifiers are rejected before any network request.

When resolution cannot retrieve or parse a DID document, the resolver reports the
library-defined `resolutionError` code in `didResolutionMetadata.error`.

## Resolution behavior

The resolver implements the `did:web` document-location derivation and document-ID
verification steps. HTTPS/TLS connection security and DNS-resolution security are
provided by the calling runtime.
