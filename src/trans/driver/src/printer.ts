import { setStore, getStore } from '@/utils/cache/storage';
import { callDriver, DeviceEnum, MethodEnum } from '../index';

export async function print(context: object) {
  const data = await callDriver(DeviceEnum.PRINTER, MethodEnum.PRINT, context);
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function imagePrint(context: object) {
  const data = await callDriver(DeviceEnum.PRINTER, MethodEnum.IMAGE, context);
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function htmlPrint(context: object) {
  const data = await callDriver(DeviceEnum.PRINTER, MethodEnum.HTML, context);
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function pdfPrint(context: object) {
  const data = await callDriver(DeviceEnum.PRINTER, MethodEnum.PDF, context);
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function pdffirst(context: object) {
  const data = await callDriver(DeviceEnum.PRINTER, MethodEnum.PDFFIRST, context);
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function state(context: object) {
    const data = await callDriver(DeviceEnum.PRINTER, MethodEnum.STATE, context);
    if (data) {
      return true;
    } else {
      return false;
    }
  }