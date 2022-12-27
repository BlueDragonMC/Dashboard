import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import { createProxyMiddleware } from "http-proxy-middleware";

const wsAddress = process.env.WS_ADDRESS || "ws://127.0.0.1:8080"
const httpAddress = process.env.K8S_API_ADDRESS || "https://kubernetes.default.svc"
const port = process.env.SERVER_PORT || 3000
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1"

console.log(`Server starting. wsAddress=${wsAddress}, httpAddress=${httpAddress}, port=${port}, host=${host}, env=${process.env.NODE_ENV}`);

const app = express();
const server = http.createServer(app);

let k8sToken;
let certs;
if (fs.existsSync("/var/run/secrets/kubernetes.io/serviceaccount/token")) {
    console.log("Authenticated with Kubernetes API.");
    k8sToken = fs.readFileSync("/var/run/secrets/kubernetes.io/serviceaccount/token", "utf-8");
    certs = [
        fs.readFileSync("/var/run/secrets/kubernetes.io/serviceaccount/ca.crt", "utf-8"),
    ]
} else {
    console.log("Using Kubernetes API without authentication.");
    k8sToken = undefined;
    certs = [];
}

// Proxy Kubernetes API
app.use("/k8s", createProxyMiddleware({
    target: httpAddress,
    pathRewrite: { "^/k8s": "" },
    logLevel: "debug",
    secure: k8sToken !== undefined,
    agent: new https.Agent({
        rejectUnauthorized: k8sToken !== undefined,
        ca: certs
    }),
    onProxyReq: (proxyReq, req, res) => {
        if (k8sToken !== undefined)
            proxyReq.setHeader("Authorization", `Bearer ${k8sToken}`);
    }
}));

// Proxy WebSockets
app.use("/ws", createProxyMiddleware(wsAddress, { ws: true }));

// Serve built static content
app.use("/", express.static("dist"));

process.on("SIGINT", server.close);
process.on("SIGTERM", server.close);

server.listen(port, host);
console.log(`Server listening on ${host}:${port}.`);