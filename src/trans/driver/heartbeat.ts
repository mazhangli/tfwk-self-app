import { heartbeat, reportCommandResult } from '@/trans/server/self/heartbeat';
import { getStore } from '@/utils/cache/storage';

let hbTimer: number | null = null;
const INTERVAL_SEC = 30;
const _startTime = Date.now();

// ============================================================
// CEF 壳子桥（走 callDriver）
// ============================================================
function callDriver(json: any): any {
  const bridge = (window as any).jsCallDriver;
  if (!bridge?.callDriver) return null;
  try {
    const res = bridge.callDriver(JSON.stringify(json));
    return typeof res === "string" ? JSON.parse(res) : res;
  } catch (e) {
    console.warn("[Heartbeat] callDriver 失败:", e);
    return null;
  }
}

// ============================================================
// 启动 / 停止
// ============================================================
export function startHeartbeat() {
  if (hbTimer) return;
  sendHeartbeat();
  hbTimer = window.setInterval(sendHeartbeat, INTERVAL_SEC * 1000);
  console.log("[Heartbeat] 已启动，间隔", INTERVAL_SEC, "秒");
}

export function stopHeartbeat() {
  if (hbTimer) {
    clearInterval(hbTimer);
    hbTimer = null;
    console.log("[Heartbeat] 已停止");
  }
}

// ============================================================
// 单次心跳
// ============================================================
async function sendHeartbeat() {
  // ① 通知 C# "Vue 还活着"
  callDriver({ method: "heartbeat.alive" });

  try {
    // ② 走 callServer 上报服务端
    const data: any = await heartbeat({
      clientVersion: getClientVersion(),
      frontVersion: getFrontVersion(),
      osVersion: navigator.userAgent,
      status: "RUNNING",
      currentPage: getCurrentPage(),
      currentUser: getCurrentUser(),
      lastError: getLastError(),
      uptimeSeconds: getUptimeSeconds(),
      memoryUsageMB: getMemoryUsage(),
      screenResolution: `${screen.width}x${screen.height}`,
      network: { hisConnected: true }
    });

    // ③ 处理待下发指令
    const commands = data?.commands || data?.result?.commands || [];
    if (commands.length > 0) {
      for (const cmd of commands) {
        await handleCommand(cmd);
      }
    }
  } catch (e) {
    console.warn("[Heartbeat] 上报失败:", e);
  }
}

// ============================================================
// 指令分派
// ============================================================
const UI_COMMANDS = ["RELOAD_PAGE", "LOAD_URL", "MAINTENANCE_ON", "MAINTENANCE_OFF"];

async function handleCommand(cmd: any) {
  try {
    if (UI_COMMANDS.includes(cmd.commandType)) {
      // UI 类：Vue 自己执行
      executeUiCommand(cmd);
      await reportCommandResult(cmd.id, true, "UI 指令已执行");
    } else {
      // 壳子类：转发给 C#
      const res = callDriver({
        method: "heartbeat.execute",
        command: cmd
      });
      await reportCommandResult(
        cmd.id,
        res?.success ?? false,
        res?.message ?? "壳子无响应"
      );
    }
  } catch (e: any) {
    await reportCommandResult(cmd.id, false, e?.message || "执行失败");
  }
}

function executeUiCommand(cmd: any) {
  switch (cmd.commandType) {
    case "RELOAD_PAGE":
      location.reload();
      break;
    case "LOAD_URL":
      location.href = cmd.param?.url || "/";
      break;
    case "MAINTENANCE_ON":
      location.hash = "#/maintenance";
      break;
    case "MAINTENANCE_OFF":
      location.hash = "#/";
      break;
  }
}

// ============================================================
// 环境信息
// ============================================================
function getClientVersion(): string {
  return getStore('machine')?.version || "1.0.0";
}
function getFrontVersion(): string {
  return  "1.0.0";
}
function getCurrentPage(): string {
  return localStorage.getItem("currentPage") || "home";
}
function getCurrentUser(): string {
  return localStorage.getItem("currentUser") || "";
}
function getLastError(): string {
  return sessionStorage.getItem("lastError") || "";
}
function getUptimeSeconds(): number {
  return Math.floor((Date.now() - _startTime) / 1000);
}
function getMemoryUsage(): number {
  const m = (performance as any).memory;
  return m ? Math.round(m.usedJSHeapSize / 1024 / 1024) : 0;
}