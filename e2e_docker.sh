#!/usr/bin/env sh
set -eu

VERSION=v1.56.0-noble@sha256:35246d87a7c88ea9b771c65d33171b2611b02a8253b4b12ce6f94376c55f99f2
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
