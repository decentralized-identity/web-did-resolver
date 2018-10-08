---
title: "HTTPS DID Resolver"
index: 0
category: "https-did-resolver"
type: "reference"
source: "https://github.com/uport-project/https-did-resolver/blob/develop/README.md"
---

# HTTPS DID Resolver

This library is intended to use domains accessed through https as [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/#decentralized-identifiers-dids) and retrieve an associated [DID Document](https://w3c-ccg.github.io/did-spec/#did-documents)

It supports the proposed [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/) spec from the [W3C Credentials Community Group](https://w3c-ccg.github.io).

It requires the `did-resolver` library, which is the primary interface for resolving DIDs.

## DID method

To encode a DID for an HTTPS domain, simply prepend `did:https:` to domain name.

eg: `https://example.com -> did:https:example.com`

## DID Document

The DID resolver takes the domain and forms a [well-known URI](https://tools.ietf.org/html/rfc5785) to access the DID Document.

For a did `did:https:example.com`, the resolver will attempt to access the document at `https://example.com/.well-known/did.json`

A minimal DID Document might contain the following information:

```js
{
  '@context': 'https://w3id.org/did/v1',
  id: 'did:https:example.com',
  publicKey: [{
       id: 'did:https:example.com#owner',
       type: 'Secp256k1VerificationKey2018',
       owner: 'did:https:example.com',
       ethereumAddress: '0xb9c5714089478a327f09197987f16f9e5d936e8a'}],
  authentication: [{
       type: 'Secp256k1SignatureAuthentication2018',
       publicKey: 'did:https:example.com#owner'}]
}
```

Note this uses the `Secp256k1VerificationKey2018` type and an `ethereumAddress` instead of a `publicKeyHex`, meaning that this DID is owned by an entity that controls the private key associated with that address.

## Resolving a DID document

The resolver presents a simple `resolver()` function that returns a ES6 Promise returning the DID document.

```js
import resolve from 'did-resolver'
import registerResolver from 'https-did-resolver'

registerResolver()

resolve('did:https:example.com').then(doc => console.log)

// You can also use ES7 async/await syntax
const doc = await resolve('did:https:example.com')
```
