import { serverTime } from '@/trans/server/his/public';
import { setStore, getStore } from '@/utils/cache/storage';
import { callbs, PayApiEnum, PayMethodEnum } from '../index';

export async function tfwk$wechat(method: PayMethodEnum, infor: any): Promise<any> {
  var patientId = '';
  if (getStore('history')) {
    patientId = getStore('history').patientid;
  } else {
    patientId = getStore('patient').patientid;
  }
  var operator = getStore('system').empId;
  infor.operatorId = operator;
  infor.patientId = patientId;
  var info = { apiCode: PayApiEnum.WECHAT, method: method, infor: infor };

  var data = await callbs(info);
  // return data;
  if (method === PayMethodEnum.QueryOrder) {
    if (data) {
      var infor = data.infor.data;
      if (infor && infor.trade_state === 'SUCCESS') {
        return { payapi: PayApiEnum.WECHAT, tradestate: 'SUCCESS', payorder: infor };
      } else if (infor && infor.trade_state === 'NOTPAY') {
        return null;
      } else {
        return undefined;
      }
    } else {
      return null;
    }
  } else {
    return data;
  }
}
