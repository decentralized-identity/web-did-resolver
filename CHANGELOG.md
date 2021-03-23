## [2.0.3](https://github.com/decentralized-identity/web-did-resolver/compare/2.0.2...2.0.3) (2021-03-23)


### Bug Fixes

* **deps:** update all non-major dependencies to v17.0.2 ([0e9e2f0](https://github.com/decentralized-identity/web-did-resolver/commit/0e9e2f0313e13196f91673c42907328bf30c26ae))

## [2.0.2](https://github.com/decentralized-identity/web-did-resolver/compare/2.0.1...2.0.2) (2021-03-15)


### Bug Fixes

* **deps:** update all non-major dependencies ([#93](https://github.com/decentralized-identity/web-did-resolver/issues/93)) ([13d8f18](https://github.com/decentralized-identity/web-did-resolver/commit/13d8f18f7dd7a6dcd79b19b7f4c6e56bed29c66a))

## [2.0.1](https://github.com/decentralized-identity/web-did-resolver/compare/2.0.0...2.0.1) (2021-03-15)


### Bug Fixes

* **deps:** update dependency did-resolver to v3 ([#94](https://github.com/decentralized-identity/web-did-resolver/issues/94)) ([18d1a1d](https://github.com/decentralized-identity/web-did-resolver/commit/18d1a1d36ac84de8f128062aa652f7714122e1d3))

# [2.0.0](https://github.com/decentralized-identity/web-did-resolver/compare/1.3.5...2.0.0) (2021-03-15)


### Features

* update to latest did spec ([#92](https://github.com/decentralized-identity/web-did-resolver/issues/92)) ([4779436](https://github.com/decentralized-identity/web-did-resolver/commit/47794360ad7a00cc87958b8c94dc4c1d13354917)), closes [#91](https://github.com/decentralized-identity/web-did-resolver/issues/91)


### BREAKING CHANGES

* Resolver now returns a `DIDResolutionResult` that wraps a DIDDocument. No errors are thrown, instead returned as `didResolutionMetadata.error/message`

## [1.3.5](https://github.com/decentralized-identity/web-did-resolver/compare/1.3.4...1.3.5) (2020-11-09)


### Bug Fixes

* **deps:** pin dependencies ([#89](https://github.com/decentralized-identity/web-did-resolver/issues/89)) ([926eb1f](https://github.com/decentralized-identity/web-did-resolver/commit/926eb1f037887cb1f409723e8ef3177d5cd41360))

## [1.3.4](https://github.com/decentralized-identity/web-did-resolver/compare/1.3.3...1.3.4) (2020-11-09)


### Bug Fixes

* CORS bug ([#88](https://github.com/decentralized-identity/web-did-resolver/issues/88)) ([2a5b5d1](https://github.com/decentralized-identity/web-did-resolver/commit/2a5b5d15da51eec74f3fb2a0b6c8ebbbf3a72392))

## [1.3.3](https://github.com/decentralized-identity/web-did-resolver/compare/1.3.2...1.3.3) (2020-08-19)


### Bug Fixes

* **deps:** update dependency did-resolver to v2.1.1 ([#70](https://github.com/decentralized-identity/web-did-resolver/issues/70)) ([0a0f902](https://github.com/decentralized-identity/web-did-resolver/commit/0a0f902367ee02ce1301432d4c0badeaff2c5837))

## [1.3.2](https://github.com/decentralized-identity/web-did-resolver/compare/1.3.1...1.3.2) (2020-07-21)


### Bug Fixes

* **deps:** update dependency did-resolver to v2 ([#56](https://github.com/decentralized-identity/web-did-resolver/issues/56)) ([b420866](https://github.com/decentralized-identity/web-did-resolver/commit/b4208663dcb31c3374bc9d61f639b1c7e27c63fa))

## [1.3.1](https://github.com/decentralized-identity/web-did-resolver/compare/1.3.0...1.3.1) (2020-07-20)


### Bug Fixes

* **deps:** update dependency did-resolver to v1.1.0 ([#39](https://github.com/decentralized-identity/web-did-resolver/issues/39)) ([4ade39d](https://github.com/decentralized-identity/web-did-resolver/commit/4ade39d1ecb38f7170acbd0f9708440d40f3eecb))

# [1.3.0](https://github.com/decentralized-identity/web-did-resolver/compare/1.2.1...1.3.0) (2020-05-13)


### Features

* support for path in the did ([904d88c](https://github.com/decentralized-identity/web-did-resolver/commit/904d88c0babd9bc787390d8bace12435fc391c74)), closes [#32](https://github.com/decentralized-identity/web-did-resolver/issues/32) [#33](https://github.com/decentralized-identity/web-did-resolver/issues/33)

## [1.2.1](https://github.com/decentralized-identity/web-did-resolver/compare/1.2.0...1.2.1) (2020-03-12)


### Bug Fixes

* remove checks for a [@context](https://github.com/context) field ([b814b6c](https://github.com/decentralized-identity/web-did-resolver/commit/b814b6c69721cf3bf2f720d928ca4865ae478b3a)), closes [#26](https://github.com/decentralized-identity/web-did-resolver/issues/26)

# [1.2.0](https://github.com/decentralized-identity/web-did-resolver/compare/1.1.0...1.2.0) (2019-10-24)


### Features

* remove default export ([9ef0b37](https://github.com/decentralized-identity/web-did-resolver/commit/9ef0b3793edcf95674b833d8ef4a293f2324c778))
* use cross-fetch instead of XMLHttpRequest ([#15](https://github.com/decentralized-identity/web-did-resolver/issues/15)) ([4378c71](https://github.com/decentralized-identity/web-did-resolver/commit/4378c71bae383b33d8c567c016c461c181ae1d17))

# [1.1.0](https://github.com/decentralized-identity/web-did-resolver/compare/1.0.1...1.1.0) (2019-10-24)


### Features

* remove default export ([3952bef](https://github.com/decentralized-identity/web-did-resolver/commit/3952bef1dc31142371a3082ec0c2cb0d82ef7ecb))
* use cross-fetch instead of XMLHttpRequest ([#15](https://github.com/decentralized-identity/web-did-resolver/issues/15)) ([dadf682](https://github.com/decentralized-identity/web-did-resolver/commit/dadf6828a704309022764fe13566bf678ba59bd4))
