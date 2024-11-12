# rvt.app

[![Production](https://shields.io/badge/production-blue?style=for-the-badge)](https://rvt.app)
[![Preview](https://shields.io/badge/preview-yellow?style=for-the-badge)](https://preview.rvt.app)

Display [Revit](https://www.autodesk.com/products/revit) file information in the browser

## Development

Install [fnm](https://github.com/Schniz/fnm?tab=readme-ov-file#installation) or [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) ([nvm-windows](https://github.com/coreybutler/nvm-windows?tab=readme-ov-file#installation--upgrades))

Install `Node.js`

    fnm use

Install `pnpm`

    corepack enable
    corepack prepare --activate

Install packages

    pnpm i

Watch

    pnpm dev

Deploy

    pnpm build
    pnpm run deploy
    pnpm run deploy:production

Stream logs

    pnpm tail
    pnpm tail:production

List deployments

    pnpm wrangler pages deployment list

## Setup

### Cloudflare API token

Create a personal API token for Terraform with the following permissions

- Account / Cloudflare Pages / Edit
- Zone / DNS / Edit

Copy the token into your Terraform Cloud Workspace variables as `cloudflare_api_token` (sensitive).

Create a API token for GitHub with the following permissions

- Account / Cloudflare Pages / Edit

Copy the token into your GitHub Action Secrets as `CLOUDFLARE_API_TOKEN`.
