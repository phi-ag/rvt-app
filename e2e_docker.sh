#!/usr/bin/env sh
set -eu

VERSION=v1.54.0-noble@sha256:18d6adb6aaccf1b0f30eba890069972e089138e4a59ddb5303d7e7290e4e38b6
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
