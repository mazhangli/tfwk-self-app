import { callDriver, callDriver$unified, DeviceEnum, MethodEnum } from '../index';
export async function open() {
  const data = await callDriver$unified(MethodEnum.OPEN);
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function inject() {
  const data = await callDriver$unified(MethodEnum.INJECT, ['ISSUER']);
  if (data) {
    return true;
  } else {
    return false;
  }
}
export async function eject() {
  const data = await callDriver$unified(MethodEnum.EJECT, ['ISSUER']);
  if (data) {
    return true;
  } else {
    return false;
  }
}

import { find as findInscard } from '@/trans/driver/src/inscard';
import { find as findPatcard } from '@/trans/driver/src/patcard';
import { find as findIdcard } from '@/trans/driver/src/idcard';
export async function find(device: DeviceEnum, off: Function) {
  if (!off()) return false;
  while (off() === true) {
    var finded = false as any;
    switch (device) {
      case DeviceEnum.INSCARD:
        finded = (await findInscard()) as any;
        break;
      case DeviceEnum.PATCARD:
        finded = (await findPatcard()) as any;
        break;
      case DeviceEnum.IDCARD:
        finded = (await findIdcard()) as any;
        break;
    }
    if (finded === true) {
      console.log('当前患者登录成功', '登录方式', device);
      return true;
    }
  }
  return false;
}

import { read as idcard } from '@/trans/driver/src/idcard';
import { read as patcard } from '@/trans/driver/src/patcard';
import { capinfo$person } from './insapi';
export async function read(device: DeviceEnum, ...args: any[]) {
  var readed = false;
  switch (device) {
    case DeviceEnum.IDCARD:
      readed = await idcard();
      break;
    case DeviceEnum.INSCARD:
      if (args[0]) readed = await capinfo$person();
      else readed = await capinfo$person(args[0]);
      break;
    case DeviceEnum.PATCARD:
      readed = await patcard();
      break;
    case DeviceEnum.SCANNER:
      if (args[0]) readed = true;
      else readed = false;
      break;
  }
}
export async function close() {
  const data = await callDriver$unified(MethodEnum.CLOSE);
  if (data) {
    return true;
  } else {
    return false;
  }
}

export async function exe(infor: object) {
  const data = await callDriver(DeviceEnum.SYSTEM, MethodEnum.EXE, infor);
  if (data) {
    return true;
  } else {
    return false;
  }
}
