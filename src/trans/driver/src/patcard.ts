import { setStore, getStore } from '@/utils/cache/storage';
import { callDriver, DeviceEnum, MethodEnum } from '../index';

export async function open() {
  const data = await callDriver(DeviceEnum.PATCARD, MethodEnum.OPEN, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function close() {
  const data = await callDriver(DeviceEnum.PATCARD, MethodEnum.CLOSE, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function inject() {
  const data = await callDriver(DeviceEnum.PATCARD, MethodEnum.INJECT, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function find() {
  const data = await callDriver(DeviceEnum.PATCARD, MethodEnum.FIND, {});
  if (data) {
    return data.info.isInject;
  } else {
    return false;
  }
}

export async function read() {
  const data = await callDriver(DeviceEnum.PATCARD, MethodEnum.READ, {});
  if (data) {
    setStore('patcard', { cardno: data.info.cardno });
    return data.info.cardno;
  } else {
    return false;
  }
}

export async function eject() {
  const data = await callDriver(DeviceEnum.PATCARD, MethodEnum.EJECT, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}
