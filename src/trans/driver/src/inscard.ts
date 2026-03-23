import { setStore, getStore } from '@/utils/cache/storage';
import { callDriver, DeviceEnum, MethodEnum } from '../index';
import { callinsapi } from './insapi/index';

export async function open() {
  const data = await callDriver(DeviceEnum.INSCARD, MethodEnum.OPEN, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function close() {
  const data = await callDriver(DeviceEnum.INSCARD, MethodEnum.CLOSE, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function inject() {
  if (getStore('machine').hospitalcode === 'bjsftqzyyy') {
    if ((await open()) === false) return false;
  }
  const data = await callDriver(DeviceEnum.INSCARD, MethodEnum.INJECT, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function find() {
  const data = await callDriver(DeviceEnum.INSCARD, MethodEnum.FIND, {});
  if (data) {
    if (data.info && (data.info.isInject === true || data.info.isInject === false)) {
      return data.info.isInject;
    } else {
      var isInject = await callinsapi(MethodEnum.FIND);
      return isInject.isInject;
    }
  } else {
    return false;
  }
}

export async function read() {
  const data = await callDriver(DeviceEnum.INSCARD, MethodEnum.READ, {});
  if (data) {
    return data.info.cardno;
  } else {
    return false;
  }
}

export async function eject() {
  const data = await callDriver(DeviceEnum.INSCARD, MethodEnum.EJECT, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}
