#!/usr/bin/env sh
set -eu

VERSION=v1.55.0-noble@sha256:b27e719ecbfef153e13fd24e8341736733bf2658b229677eb21ff57ff5d7fb29
STORE_PATH="$(pnpm store path --silent)"

mkdir -p .run-playwright

cat <<EOF >.run-playwright/run.sh
#!/usr/bin/env bash
set -euo pipefail
corepack enable
corepack prepare --activate
pnpm config set store-dir ${STORE_PATH}
pnpm install --frozen-lockfile
pnpm test:e2e
EOF

chmod +x .run-playwright/run.sh

docker run -it --rm \
  --workdir /workdir \
  -v .:/workdir \
  -v ${STORE_PATH}:${STORE_PATH} \
  -e CI=true -e HOME=/root -e STORE_PATH -e BASE_URL \
  mcr.microsoft.com/playwright:${VERSION} \
  .run-playwright/run.sh
