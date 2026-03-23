import { MethodEnum } from '@/trans/driver';
import { setStore } from '@/utils/cache/storage';
import { decode } from 'js-base64';
import X2JS from 'x2js';
import { callcapinfo } from './capinfo';

export enum insroot{
  capinfo = 'capinfo',
}

// device | brand | version | invoke | params
export async function callinsapi(method: MethodEnum, args?: any) {
  var brand = 'capinfo'; //当前仅仅支持北京医保
  switch (brand) {
    case 'capinfo':
      return await callcapinfo(method, args);
    default:
      throw new Error('暂不支持的接口');
  }
}


