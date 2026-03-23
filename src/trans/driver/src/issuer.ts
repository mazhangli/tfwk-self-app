import { setStore, getStore } from '@/utils/cache/storage';
import { callDriver, DeviceEnum, MethodEnum } from '../index';

export async function open() {
  const data = await callDriver(DeviceEnum.ISSUER, MethodEnum.OPEN, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function close() {
  const data = await callDriver(DeviceEnum.ISSUER, MethodEnum.CLOSE, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function inject() {
  const data = await callDriver(DeviceEnum.ISSUER, MethodEnum.INJECT, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function state() {
  const data = await callDriver(DeviceEnum.ISSUER, MethodEnum.STATE, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function read() {
  const data = await callDriver(DeviceEnum.ISSUER, MethodEnum.READ, {});
  if (data) {
    return data.info.cardno;
  } else {
    return false;
  }
}
export async function eject() {
  const data = await callDriver(DeviceEnum.ISSUER, MethodEnum.EJECT, {});
  if (data) {
    return true;
  } else {
    return false;
  }
}
