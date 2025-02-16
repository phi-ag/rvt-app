import { Component, Show } from "solid-js";
import { getRequestEvent } from "solid-js/web";

const Analytics: Component = () => {
  const event = getRequestEvent();

  // @ts-ignore
  const nonce = event?.nonce;
  const token = event?.locals.env.ANALYTICS_TOKEN;
  const data = token ? `{"token": "${token}"}` : undefined;

  return (
    <Show when={!event?.locals.env.LOCAL && nonce && data}>
      <script
        defer
        async
        nonce={nonce}
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={data}
      />
    </Show>
  );
};

export default Analytics;
