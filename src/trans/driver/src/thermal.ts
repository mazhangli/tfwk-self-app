import { setStore, getStore } from '@/utils/cache/storage';
import { callDriver, DeviceEnum, MethodEnum } from '../index';

export async function print(context: object) {
  const data = await callDriver(DeviceEnum.THERMAL, MethodEnum.PRINT, context);
  if (data) {
    return true;
  } else {
    return false;
  }
}