import { createServer } from "node:http";

const port = Number(process.env.TEST_PROXY_PORT ?? 9091);
const nestBaseUrl = (
  process.env.NEST_API_BASE_URL ?? "http://183.82.145.33:9090"
).replace(/\/+$/, "");
const testUsername = process.env.TEST_CHAT_USERNAME ?? "demo10@example.com";
const testGroups = (process.env.TEST_CHAT_GROUPS ?? "finance")
  .split(",")
  .map((group) => group.trim())
  .filter(Boolean);

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
  "access-control-allow-headers": "Authorization,Content-Type,Accept"
};

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

function forwardHeaders(request) {
  const headers = {};
  for (const name of ["authorization", "content-type", "accept"]) {
    const value = request.headers[name];
    if (typeof value === "string") headers[name] = value;
  }
  return headers;
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders);
    response.end();
    return;
  }

  try {
    const bodyBuffer = await readBody(request);
    let body = bodyBuffer.length ? bodyBuffer : undefined;
    const isStreamRequest =
      request.method === "POST" &&
      /^\/my-chats\/[^/]+\/messages\/stream\/?(?:\?.*)?$/.test(request.url ?? "");

    if (isStreamRequest) {
      const widgetPayload = JSON.parse(bodyBuffer.toString("utf8"));
      body = JSON.stringify({
        ...widgetPayload,
        username: testUsername,
        groups: testGroups
      });

      console.log("[customer-proxy] Injected stream context", {
        username: testUsername,
        groups: testGroups
      });
    }

    const upstream = await fetch(`${nestBaseUrl}${request.url}`, {
      method: request.method,
      headers: forwardHeaders(request),
      body: ["GET", "HEAD"].includes(request.method ?? "GET") ? undefined : body,
      duplex: "half"
    });

    const responseHeaders = { ...corsHeaders };
    for (const [name, value] of upstream.headers) {
      if (!["connection", "content-encoding", "content-length", "transfer-encoding"].includes(name)) {
        responseHeaders[name] = value;
      }
    }

    response.writeHead(upstream.status, responseHeaders);
    if (!upstream.body) {
      response.end();
      return;
    }

    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      response.write(value);
    }
    response.end();
  } catch (error) {
    console.error("[customer-proxy] Request failed", error);
    response.writeHead(502, {
      ...corsHeaders,
      "content-type": "application/json"
    });
    response.end(JSON.stringify({ error: "Local customer proxy failed" }));
  }
});

server.listen(port, () => {
  console.log(`Local customer proxy: http://localhost:${port}`);
  console.log(`Forwarding to NestJS: ${nestBaseUrl}`);
  console.log(`Streaming identity: ${testUsername} [${testGroups.join(", ")}]`);
});
