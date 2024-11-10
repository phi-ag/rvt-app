export { version } from "../package.json";
export const revision = process.env.GITHUB_SHA?.slice(0, 7) ?? "deadbeef";
