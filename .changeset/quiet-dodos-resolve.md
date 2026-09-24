---
'web-did-resolver': minor
---

Add strict `did:web` parsing with an exported `webParser`, improve resolution error metadata, and support DID URLs with query and fragment components. The resolver now uses the runtime's global `fetch` and requires `did-resolver` v6.
