---
title: "Web DID Resolver"
index: 0
category: "web-did-resolver"
type: "reference"
source: "https://github.com/uport-project/web-did-resolver/blob/develop/README.md"
---

# Web DID Resolver

[![codecov](https://codecov.io/gh/decentralized-identity/web-did-resolver/branch/develop/graph/badge.svg)](https://codecov.io/gh/decentralized-identity/web-did-resolver)
[![CircleCI](https://circleci.com/gh/decentralized-identity/web-did-resolver.svg?style=svg)](https://circleci.com/gh/decentralized-identity/web-did-resolver)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7936d0f6a035489386eb519016be4657)](https://www.codacy.com/manual/decentralized-identity/web-did-resolver?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=decentralized-identity/web-did-resolver&amp;utm_campaign=Badge_Grade)

This library is intended to use domains accessed through https as 
[Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/#decentralized-identifiers-dids) 
and retrieve an associated [DID Document](https://w3c-ccg.github.io/did-spec/#did-documents)

It supports the proposed [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/) spec from
the [W3C Credentials Community Group](https://w3c-ccg.github.io).

It requires the `did-resolver` library, which is the primary interface for resolving DIDs.

## DID method

To encode a DID for an HTTPS domain, simply prepend `did:web:` to domain name.

eg: `https://example.com -> did:web:example.com`

## DID Document

The DID resolver takes the domain and forms a [well-known URI](https://tools.ietf.org/html/rfc5785)
to access the DID Document.

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
  "authentication": [
    {
      "type": "Secp256k1SignatureAuthentication2018",
      "publicKey": "did:web:example.com#owner"
    }
  ]
}
```

Note: this example uses the `Secp256k1VerificationKey2018` type and an `publicKeyHex` as a
publicKey entry, signaling that this DID is claiming to control the private key associated with that
publicKey.

## Resolving a DID document

The resolver presents a simple `resolver()` function that returns a ES6 Promise returning the DID
document.

```js
import { Resolver } from 'did-resolver'
import { getResolver } from 'web-did-resolver'

const webResolver = getResolver()

const didResolver = new Resolver({
    ...webResolver
    //...you can flatten multiple resolver methods into the Resolver
})

didResolver.resolve('did:web:uport.me').then(doc => console.log(doc))

// You can also use ES7 async/await syntax
;(async () => {
    const doc = await didResolver.resolve('did:web:uport.me')
    console.log(doc)
})();
```
