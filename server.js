import express from "express";
import http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";

const wsAddress = process.env.WS_ADDRESS || "ws://127.0.0.1:8080"
const httpAddress = process.env.K8S_API_ADDRESS || "http://127.0.0.1:8001"
const port = process.env.SERVER_PORT || 3000
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1"

const app = express();
const server = http.createServer(app);

// Proxy Kubernetes API
app.use("/k8s", createProxyMiddleware({ target: httpAddress, pathRewrite: { "^/k8s": "" } }));

// Proxy WebSockets
app.use("/ws", createProxyMiddleware(wsAddress, { ws: true }));

// Serve built static content
app.use("/", express.static("dist"));

process.on("SIGINT", server.close);
process.on("SIGTERM", server.close);

server.listen(port, host);
console.log(`Server listening on ${host}:${port}.`);