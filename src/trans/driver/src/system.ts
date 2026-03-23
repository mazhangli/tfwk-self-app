import { setStore, getStore } from '@/utils/cache/storage';
import { callDriver, DeviceEnum, MethodEnum } from '../index';

export async function system() {
  const data = await callDriver(DeviceEnum.SYSTEM, MethodEnum.INFO, {});
  if (data) {
    setStore('system', data.info);
    return true;
  } else {
    return false;
  }
}

export async function quit() {
  const data = await callDriver(DeviceEnum.SYSTEM, MethodEnum.QUIT, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function shutdown() {
  const data = await callDriver(DeviceEnum.SYSTEM, MethodEnum.SHUTDOWN, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function reboot() {
  const data = await callDriver(DeviceEnum.SYSTEM, MethodEnum.REBOOT, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}