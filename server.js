import express from "express";
import http from "http";
import httpProxy from "http-proxy";

const address = process.env.WS_ADDRESS || "http://localhost:8080"
const port = process.env.SERVER_PORT || 3000
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1"

const app = express();
const proxy = httpProxy.createProxyServer({ target: address, ws: true });
const server = http.createServer(app);

// Proxy WebSockets
server.on("upgrade", (req, socket, head) => {
    proxy.ws(req, socket, head);
});

// Log errors instead of crashing the server
proxy.on("error", (err) => {
    console.error(err.name, err.message, err.stack);
});

// Serve built static content
app.use("/", express.static("dist"));

process.on("SIGINT", server.close);
process.on("SIGTERM", server.close);

server.listen(port, host);
console.log(`Server listening on ${host}:${port}.`);
console.log(`Proxying WebSocket connections to ${address}.`);