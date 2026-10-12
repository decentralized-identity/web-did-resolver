---
'web-did-resolver': minor
---

Add `getResolver({ fetch })` to resolve `did:web` documents with an application-supplied fetch without replacing `globalThis.fetch`. The default remains the runtime's global `fetch`, looked up per request. Exports `WebDidResolverOptions`, `WebDidFetch` and `WebDidFetchResponse`.
