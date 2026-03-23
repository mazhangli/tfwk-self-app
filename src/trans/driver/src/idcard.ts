import { setStore, getStore } from '@/utils/cache/storage';
import { callDriver, DeviceEnum, MethodEnum } from '../index';

export async function open() {
  const data = await callDriver(DeviceEnum.IDCARD, MethodEnum.OPEN, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function close() {
  const data = await callDriver(DeviceEnum.IDCARD, MethodEnum.CLOSE, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function find() {
  const data = await callDriver(DeviceEnum.IDCARD, MethodEnum.FIND, {});
  if (data) {
    return data.info.isInject;
  } else {
    return false;
  }
}

export async function read() {
  const data = await callDriver(DeviceEnum.IDCARD, MethodEnum.READ, {});
  if (data) {
    setStore('identity', data.info);
    return true;
  } else {
    return false;
  }
}
