# Changelog

## [0.5.2](https://github.com/phi-ag/rvt-app/compare/v0.5.1...v0.5.2) (2024-11-12)


### Miscellaneous Chores

* add coverage badge ([eaefe9b](https://github.com/phi-ag/rvt-app/commit/eaefe9b942d65a6682b23940cd2032bc2122308a))
* **deps:** update dependency eslint-plugin-solid to v0.14.4 ([3444cd3](https://github.com/phi-ag/rvt-app/commit/3444cd3988c5ebf466ee39237416ac923c3045ed))
* **deps:** update dependency node to v23.2.0 ([cba7383](https://github.com/phi-ag/rvt-app/commit/cba7383eae2b415729c31b9948792fdabf83fa38))


### Tests

* add script to run e2e tests in docker ([4e1a08c](https://github.com/phi-ag/rvt-app/commit/4e1a08c28590dfb6689eefd4222b65a57ba77e9b))
* **e2e:** add initial e2e test ([6ed43e7](https://github.com/phi-ag/rvt-app/commit/6ed43e7ae2d7da423d9edf594c67e673aa084b03))
* **e2e:** add test for Revit 2025 family ([444c472](https://github.com/phi-ag/rvt-app/commit/444c472934650ec3a32e0d43c4481a1c237c5196))
* enable test coverage ([273a7f7](https://github.com/phi-ag/rvt-app/commit/273a7f765d1d560ff0f7dc402ae2dd38e325ad41))
* skip file parse test in webkit ([8ca2ff0](https://github.com/phi-ag/rvt-app/commit/8ca2ff0c7a8f6d47c6500c5b14c21f1b21500c54))


### Continuous Integration

* checkout with lfs ([175047c](https://github.com/phi-ag/rvt-app/commit/175047c07d064a4cc639ba7e9f8b2b45ad6d9fce))
* log e2e target url ([51a523f](https://github.com/phi-ag/rvt-app/commit/51a523fd46e07c124c100486e1170cfd59a90ff1))
* mount pnpm store in playwright container ([333f8a0](https://github.com/phi-ag/rvt-app/commit/333f8a0142d6995ab09c096d3f190230d47a3806))
* use env variable for mapping pnpm store path in playwright ([3d54656](https://github.com/phi-ag/rvt-app/commit/3d54656959b510784e303579057f71f153a582a7))

## [0.5.1](https://github.com/phi-ag/rvt-app/compare/v0.5.0...v0.5.1) (2024-11-11)


### Bug Fixes

* directory start ([8740479](https://github.com/phi-ag/rvt-app/commit/8740479b7e4eb213eab428dd29fefb15d813eca0))
* parse multiple directory sectors ([b091225](https://github.com/phi-ag/rvt-app/commit/b09122500fdf159817dcea1b92b6a98f00f469e1))


### Miscellaneous Chores

* **deps:** update dependency postcss to v8.4.49 ([d6687b3](https://github.com/phi-ag/rvt-app/commit/d6687b30810d915106be0dfb085b165c43a15418))
* don't throw when parsing thumbnail fails ([95af8ed](https://github.com/phi-ag/rvt-app/commit/95af8ed857835ab73d356b5302604342b73a6fd7))
* render identity and document guids ([01dbbab](https://github.com/phi-ag/rvt-app/commit/01dbbabb5df32d5f80256e1a81818eebf9c73d62))

## [0.5.0](https://github.com/phi-ag/rvt-app/compare/v0.4.0...v0.5.0) (2024-11-11)


### Features

* extract and render thumbnails ([73a9619](https://github.com/phi-ag/rvt-app/commit/73a9619ec1955656c6e22d62c50b14150bbbc8f3))


### Miscellaneous Chores

* **deps:** update dependency typescript-eslint to v8.14.0 ([d1a30b7](https://github.com/phi-ag/rvt-app/commit/d1a30b778964ac1c67ddc239dea501274a253c3c))
* **deps:** update dependency wrangler to v3.86.1 ([4e77529](https://github.com/phi-ag/rvt-app/commit/4e7752966e841ae8722870303126b2e859bf0bee))
* disable some debug logging ([272194f](https://github.com/phi-ag/rvt-app/commit/272194f25899eb793ec057e1859910360a33fd88))

## [0.4.0](https://github.com/phi-ag/rvt-app/compare/v0.3.0...v0.4.0) (2024-11-11)


### Features

* process all input files ([e292a7d](https://github.com/phi-ag/rvt-app/commit/e292a7dc6b5dfcb60f5fd1a7c7ee223aef545b8e))


### Bug Fixes

* dropzone should accept files without extensions unless restricted ([5f0f6a0](https://github.com/phi-ag/rvt-app/commit/5f0f6a0176a945de128d6912869e8bced816dd90))

## [0.3.0](https://github.com/phi-ag/rvt-app/compare/v0.2.0...v0.3.0) (2024-11-11)


### Features

* add support for basic file info version 10 (Revit 2017, 2018) ([2d5fb43](https://github.com/phi-ag/rvt-app/commit/2d5fb439885d95c74b1d520da188c8f375fd2886))


### Miscellaneous Chores

* disable hover on mobile devices ([ed3139c](https://github.com/phi-ag/rvt-app/commit/ed3139c8c545c009525ea28e6447a3d26811641d))


### Code Refactoring

* add assert zero ([8a16f20](https://github.com/phi-ag/rvt-app/commit/8a16f209764666fcfdbf8248d8586c86ce275987))
* parse app name and content ([23a1449](https://github.com/phi-ag/rvt-app/commit/23a1449253040775f21ba3c9a0b0cd752b6541be))
* parse guids ([611f789](https://github.com/phi-ag/rvt-app/commit/611f7891bd589869121bb65684dfab969ec08374))
* parse path ([a468513](https://github.com/phi-ag/rvt-app/commit/a468513a88e68eb835caaaca4abf993686ede506))

## [0.2.0](https://github.com/phi-ag/rvt-app/compare/v0.1.0...v0.2.0) (2024-11-11)


### Features

* parse basic file info ([7e5941b](https://github.com/phi-ag/rvt-app/commit/7e5941bccd82913d1aa4923f8b6c7fa4f54c3fab))


### Miscellaneous Chores

* **deps:** update dependency vite to v5.4.11 ([d5cb420](https://github.com/phi-ag/rvt-app/commit/d5cb420c5a3cfb7494547dce6bc76a98c1ae6262))

## [0.1.0](https://github.com/phi-ag/rvt-app/compare/v0.0.1...v0.1.0) (2024-11-10)


### Features

* parse revit file ([2b52bd2](https://github.com/phi-ag/rvt-app/commit/2b52bd2c84fce74ef4943ee8b644b08b67e7f30a))


### Bug Fixes

* **deps:** update dependency uuid to v11.0.3 ([97fcb73](https://github.com/phi-ag/rvt-app/commit/97fcb734236cd393a83f58da7fbad3f7c3f52312))


### Styles

* use ring for dropzone styles ([89451da](https://github.com/phi-ag/rvt-app/commit/89451daa0191ca4e35d7b6bc438b5f6e5465679d))


### Miscellaneous Chores

* **deps:** update dependency postcss to v8.4.48 ([a15d478](https://github.com/phi-ag/rvt-app/commit/a15d478906104b2189bf85908b18c258d3840a65))


### Code Refactoring

* create dropzone component ([5114561](https://github.com/phi-ag/rvt-app/commit/511456130b8fcf2b91849bfa162894fb35659079))

## 0.0.1 (2024-11-10)


### Miscellaneous Chores

* **deps:** update terraform cloudflare to v4.45.0 ([98b3640](https://github.com/phi-ag/rvt-app/commit/98b364097ab2c1764e0c558b836b99adcfb59c1a))
* init ([72e5ed7](https://github.com/phi-ag/rvt-app/commit/72e5ed7a213ce2dd27354197015066d1e030e60e))
