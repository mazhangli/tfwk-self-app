import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore } from '@/utils/cache/storage';

/**
 * 心跳上报
 * method 与 C# Service 的 case 名称一致：updateHeartbeat
 */
export async function heartbeat(info: {
  clientVersion?: string;
  frontVersion?: string;
  osVersion?: string;
  status?: string;
  currentPage?: string;
  currentUser?: string;
  lastError?: string;
  uptimeSeconds?: number;
  memoryUsageMB?: number;
  diskFreeMB?: number;
  screenResolution?: string;
  network?: any;
}) {
  const systime = formatToDateTime(new Date().getTime());
  const machine = getStore('machine');
  const empid = machine?.machineid || '';

  const json = {
    method: 'updateHeartbeat',
    finaltime: systime,
    operator: empid,
    info: {
      machineId: empid,
      clientVersion: info.clientVersion || '',
      frontVersion: info.frontVersion || '',
      osVersion: info.osVersion || '',
      status: info.status || 'RUNNING',
      currentPage: info.currentPage || '',
      currentUser: info.currentUser || '',
      lastError: info.lastError || '',
      uptimeSeconds: info.uptimeSeconds || 0,
      memoryUsageMB: info.memoryUsageMB || 0,
      diskFreeMB: info.diskFreeMB || 0,
      screenResolution: info.screenResolution || '',
      network: info.network || {},
    },
  };

  const result = await callServer(json);
  return result || null;
}

/**
 * 指令回执
 * method 与 C# Service 的 case 名称一致：reportCommandResult
 */
export async function reportCommandResult(cmdId: number, success: boolean, message: string) {
  const systime = formatToDateTime(new Date().getTime());
  const machine = getStore('machine');
  const empid = machine?.machineid || '';

  const json = {
    method: 'reportCommandResult',
    finaltime: systime,
    operator: empid,
    info: {
      id: cmdId,
      success: success ? '1' : '0',
      message: message || '',
    },
  };

  const result = await callServer(json);
  return result || null;
}
