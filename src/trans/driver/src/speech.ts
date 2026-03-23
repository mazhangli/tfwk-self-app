import { setStore, getStore } from '@/utils/cache/storage';
import { isString } from '@/utils/is';
import { callDriver, DeviceEnum, MethodEnum } from '../index';

export async function speak(context: object | string) {
  if (isString(context)) {
    context = { sound: context };
  }
  const data = await callDriver(DeviceEnum.SPEECH, MethodEnum.SPEAK, context);
  if (data) {
    return true;
  } else {
    return false;
  }
}
