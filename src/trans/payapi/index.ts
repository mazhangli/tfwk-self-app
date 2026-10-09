export enum PayModeEnum {
  WECHAT = 'wechat',
  ALIPAY = 'alipay',
  UNIONPAY = 'union',
}
export enum PayApiEnum {
  WECHAT = 'tfwk.wechat',
  ALIPAY = 'tfwk.alipay',
  CHINAUMS = 'chinaums',
  SWIFTPASS = 'swiftpass',
  CHASE = 'chase',
  CHASED = 'chase.dll',
  ADMPAY = 'admPay',
}
export enum PayMethodEnum {
  RequestOrder = 'requestorder',
  QueryOrder = 'queryorder',
  CloseOrder = 'closeorder',
  RefundOrder = 'refundorder',
}
import { getStore } from '@/utils/cache/storage';
import { formatToDateTime } from '@/utils/dateUtil';
import callServer from '@/trans/server/util';
import { tfwk$wechat } from './src/wechat';
import { tfwk$alipay } from './src/alipay';
import { chinaums } from './src/chinaums';
import { chase } from './src/chase';
import { chasedll } from './src/chase.dll';
import { adm$pay } from './src/admPay';
import { ApiEnum, callApi, MethodEnum } from '../driver';

export async function callpayapi(mode: PayModeEnum, method: PayMethodEnum, infor: any) {
  console.log(mode, method, infor);
  var brand = null; //支付接口
  switch (mode) {
    case PayModeEnum.WECHAT:
      brand = getStore('machine').paymodes.wechat.apicode;
      break;
    case PayModeEnum.ALIPAY:
      brand = getStore('machine').paymodes.alipay.apicode;
      break;
    case PayModeEnum.UNIONPAY:
      brand = getStore('machine').paymodes.union.apicode;
      break;
  }
  switch (brand) {
    case 'swiftpass':
      //return await swiftpassapi(invoke, params);
      break;
    case 'tfwk.wechat':
      return await tfwk$wechat(method, infor);
      break;
    case 'tfwk.alipay':
      return await tfwk$alipay(method, infor);
      break;
    case 'chinaums':
      return await chinaums(method, infor);
      break;
    case 'chase':
      return await chase(method, infor);
      break;
    case 'chase.dll':
      return await chasedll(method, infor);
      break;
      case 'admPay':
      return await adm$pay(method, infor);
      break;
    default:
      throw new Error('暂不支持的接口');
      break;
  }
}

export async function callbs(infor: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'payapi',
    finaltime: systime,
    operator: empid,
    info: infor,
  };
  var data = await callServer(json);
  if (data) {
    return data;
  } else {
    return null;
  }
}
export async function callcs(infor: any) {
  var data = await callApi(ApiEnum.PAYAPI, MethodEnum.EXE, infor);
  if (data) {
    return data;
  } else {
    return null;
  }
}
