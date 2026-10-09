const fs = require("fs");
const path = require("path");

const pkg = require("./package.json");
const publicDir = path.resolve(__dirname, "public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const buildTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

let commit = "";
try {
  commit = require("child_process")
    .execSync("git rev-parse --short HEAD", { stdio: ["pipe", "pipe", "ignore"] })
    .toString()
    .trim();
} catch (e) {}

const health = {
  name: pkg.appName || pkg.name || "自助机前端",
  version: pkg.version || "1.0.0",
  buildTime,
  env: process.env.VUE_APP_ENV || "prod",
  commit,
};

fs.writeFileSync(
  path.resolve(publicDir, "health.json"),
  JSON.stringify(health, null, 2),
  "utf8"
);

console.log(`✅ health.json 已生成: name=${health.name}, version=${health.version}, buildTime=${health.buildTime}`);