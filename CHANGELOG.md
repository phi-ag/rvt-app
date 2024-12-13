# Changelog

## [0.6.3](https://github.com/phi-ag/rvt-app/compare/v0.6.2...v0.6.3) (2024-11-20)


### Bug Fixes

* disable analytics for localhost ([95a0ff0](https://github.com/phi-ag/rvt-app/commit/95a0ff02fd30a13bea13c977e17721bc66a128b9))


### Styles

* material colors and typography ([2a00d08](https://github.com/phi-ag/rvt-app/commit/2a00d084504ece61e8e3739006f01811a4b1c49e))
* move shield icon slightly up ([da5a2c1](https://github.com/phi-ag/rvt-app/commit/da5a2c1c189846f7d655c4f667b72ca23bbebca1))


### Miscellaneous Chores

* add message that files are processed locally ([fc5f4b2](https://github.com/phi-ag/rvt-app/commit/fc5f4b2bb7d6f7bb13a73b57ea6f4ef489a58241))
* **deps:** update codecov/codecov-action digest to 05f5a9c ([a8fd7ec](https://github.com/phi-ag/rvt-app/commit/a8fd7ec0ec3cf3cc2553f7a456ed8f6a0787d9b2))
* **deps:** update codecov/codecov-action digest to 288befb ([9b26f71](https://github.com/phi-ag/rvt-app/commit/9b26f71aa7191ab5345b05893896c8da51356596))
* **deps:** update codecov/codecov-action digest to 985343d ([6c6f591](https://github.com/phi-ag/rvt-app/commit/6c6f59198959adbeab3a8e8e7f293833d4cce192))
* **deps:** update dependency @types/node to v22.9.1 ([4bfd89a](https://github.com/phi-ag/rvt-app/commit/4bfd89a4567e01cde84878a565f380bdf468d856))
* **deps:** update dependency eslint to v9.15.0 ([00c4c99](https://github.com/phi-ag/rvt-app/commit/00c4c99ed88e0a8672f81068f2eb83df9b8698ef))
* **deps:** update dependency prettier-plugin-tailwindcss to v0.6.9 ([7e5bfb5](https://github.com/phi-ag/rvt-app/commit/7e5bfb50f6a36a074b8675fb1544f042a790478c))
* **deps:** update dependency typescript-eslint to v8.15.0 ([9b1e616](https://github.com/phi-ag/rvt-app/commit/9b1e61693c6b93da0b14d71675ddc7a3e576013e))
* **deps:** update dependency wrangler to v3.88.0 ([0e6478d](https://github.com/phi-ag/rvt-app/commit/0e6478dde6f0d21e71080794127bbd41bbc117cd))
* **deps:** update phi-ag/run-playwright digest to a2a216e ([4a47004](https://github.com/phi-ag/rvt-app/commit/4a47004a8db52cab8969f704bf8deed5d94ba225))
* **deps:** update playwright to v1.49.0 ([fa6aaa5](https://github.com/phi-ag/rvt-app/commit/fa6aaa599231141ff62956d3509c8432f6d6f03f))
* **deps:** update pnpm to v9.14.2 ([3bde8b0](https://github.com/phi-ag/rvt-app/commit/3bde8b0eb95a5416254d8301d12b47fd40872c39))
* **renovate:** add phi-ag/run-playwright to playwright group ([a204a3d](https://github.com/phi-ag/rvt-app/commit/a204a3d2fd67be25c35065268f9f51137fcfbd2a))
* **renovate:** disable minimum release age for playwright ([e5735fc](https://github.com/phi-ag/rvt-app/commit/e5735fc2e2c4a663bc4005911a8dccfa2d9f80eb))


### Code Refactoring

* move cfb to folder ([4583775](https://github.com/phi-ag/rvt-app/commit/4583775d854ddf48fa201fd5b5117dffed5b81f3))
* split cfb into multiple files ([0ebfb2b](https://github.com/phi-ag/rvt-app/commit/0ebfb2be3f76908719b73d54f8615533fb6b3819))


### Continuous Integration

* don't continue on format error ([d79fadd](https://github.com/phi-ag/rvt-app/commit/d79fadd2fd7427ac0fa17e08d290c02a929e0db4))
* use specific playwright version ([a72537c](https://github.com/phi-ag/rvt-app/commit/a72537c0b8d8c69401c78e50de882d20ad8a6349))

## [0.6.2](https://github.com/phi-ag/rvt-app/compare/v0.6.1...v0.6.2) (2024-11-18)


### Miscellaneous Chores

* add cloudflare analytics ([bb25cba](https://github.com/phi-ag/rvt-app/commit/bb25cbaea5ca587f3cec99646664a6b0f7a1d02f))
* **terraform:** ignore changes for page build config ([91b9de2](https://github.com/phi-ag/rvt-app/commit/91b9de2f40fa0466976405fb5dc3932a49d1ee35))
* **terraform:** output analytics tag and token ([51902a0](https://github.com/phi-ag/rvt-app/commit/51902a0ad4135c990f292959ad92e6d54c7d3819))


### Code Refactoring

* **revit:** add generic string parse for basic file info ([f30bbb6](https://github.com/phi-ag/rvt-app/commit/f30bbb6ba3a1c56338c38cb37116dbd3937b30bf))


### Tests

* **e2e:** use wrangler for ci e2e tests ([c03e076](https://github.com/phi-ag/rvt-app/commit/c03e076e8c1b07ffa2168837abb892f7d5454658))

## [0.6.1](https://github.com/phi-ag/rvt-app/compare/v0.6.0...v0.6.1) (2024-11-18)


### Bug Fixes

* compare file extensions case-insensitive ([f3a3d23](https://github.com/phi-ag/rvt-app/commit/f3a3d2387d8fa02e3d3ce467c6a03c454505834b))


### Miscellaneous Chores

* show title and supported file extensions ([bdef050](https://github.com/phi-ag/rvt-app/commit/bdef0509ee3b7979160aab8c9d652ee3edfaff60))


### Code Refactoring

* add minimal cfb class ([5366304](https://github.com/phi-ag/rvt-app/commit/5366304ba0fe7c44906e02ae4ce993b498ea12a9))
* move cfb functions ([c9ce5a5](https://github.com/phi-ag/rvt-app/commit/c9ce5a55d1fe8655e18ff229f27a38ce45fcb27a))
* move fat bounds and mini stream offset functions into cfb class ([358055b](https://github.com/phi-ag/rvt-app/commit/358055be8c974414b6c01b821a183bd146f4b8b1))

## [0.6.0](https://github.com/phi-ag/rvt-app/compare/v0.5.3...v0.6.0) (2024-11-17)


### Features

* implement fat chains, use blob instead of stream ([b4bc7d6](https://github.com/phi-ag/rvt-app/commit/b4bc7d6579f3689cd46f1ebc1e1bcedbac27f8dd))


### Code Refactoring

* parse sector size, minifat sector size and cutoff from cfb header ([882d7ac](https://github.com/phi-ag/rvt-app/commit/882d7acfecb8d160b910ec5a48b924c55681f634))

## [0.5.3](https://github.com/phi-ag/rvt-app/compare/v0.5.2...v0.5.3) (2024-11-16)


### Reverts

* update eslint monorepo to v9.15.0 ([2dfa969](https://github.com/phi-ag/rvt-app/commit/2dfa9695de99f8c9f4fc29f8254964fed45e9dfe))


### Miscellaneous Chores

* add more family example files and license ([6e26189](https://github.com/phi-ag/rvt-app/commit/6e26189c7a723e1ddec5cb922963e891dbcfdc0f))
* **deps:** update codecov/codecov-action action to v5 ([8a0232c](https://github.com/phi-ag/rvt-app/commit/8a0232c0c2936dc426316bc09c28df8756d23fbe))
* **deps:** update codecov/codecov-action digest to 5c47607 ([06ca643](https://github.com/phi-ag/rvt-app/commit/06ca643d770e7eab418d8486642bb28ec5650cb8))
* **deps:** update dependency @cloudflare/workers-types to v4.20241112.0 ([b07c2d1](https://github.com/phi-ag/rvt-app/commit/b07c2d13370bf31b4d93b7d3437a7ece9513afb5))
* **deps:** update dependency tailwindcss to v3.4.15 ([a7242de](https://github.com/phi-ag/rvt-app/commit/a7242de7a2e79851394a0f507ecfc2b21ea0e4bc))
* **deps:** update dependency wrangler to v3.87.0 ([4c75047](https://github.com/phi-ag/rvt-app/commit/4c750471a10a6e72b961572f16b9f3c302a67026))
* **deps:** update eslint monorepo to v9.15.0 ([af27409](https://github.com/phi-ag/rvt-app/commit/af27409d0abc81ee4361e1bd5993160d79897bec))
* **deps:** update pnpm to v9.13.0 ([65b61ae](https://github.com/phi-ag/rvt-app/commit/65b61ae01d4e18ad86623f8d2eb3a932578568d4))
* **deps:** update pnpm to v9.13.1 ([3b1e013](https://github.com/phi-ag/rvt-app/commit/3b1e013da4e5cb40b0912075af4e228fa2163cd2))
* **deps:** update pnpm to v9.13.2 ([1284b6d](https://github.com/phi-ag/rvt-app/commit/1284b6d825d7fafcb01096a69cc7290864ec2557))
* **deps:** update terraform cloudflare to v4.46.0 ([bd1e794](https://github.com/phi-ag/rvt-app/commit/bd1e794b9c9e0e8342a682219dd2d52351f412df))
* **deps:** update vitest monorepo to v2.1.5 ([a085115](https://github.com/phi-ag/rvt-app/commit/a0851156c5b504bf4de8ef8120e9b6044b937288))
* move example file ([db3d8e0](https://github.com/phi-ag/rvt-app/commit/db3d8e0ccae6a679c794247187477f4a41a2f731))


### Tests

* add unit test for family 2025 ([522a3ff](https://github.com/phi-ag/rvt-app/commit/522a3ffb2dfd6abff394218ebcdbbb59e9e9c9d6))
* add unit tests for all families ([60e6d6d](https://github.com/phi-ag/rvt-app/commit/60e6d6d11141718a3cd078834da96f0f3b1f4112))

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
