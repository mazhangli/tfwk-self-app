import { serverTime } from '@/trans/server/his/public';
import { setStore, getStore } from '@/utils/cache/storage';
import { callbs, PayApiEnum, PayMethodEnum } from '../index';

export async function tfwk$alipay(method: PayMethodEnum, infor: any): Promise<any> {
  var patientId = '';
  if (getStore('history')) {
    patientId = getStore('history').patientid;
  } else {
    patientId = getStore('patient').patientid;
  }
  var operator = getStore('system').empId;
  infor.operatorId = operator;
  infor.patientId = patientId;
  var info = { apiCode: PayApiEnum.ALIPAY, method: method, infor: infor };

  var data = await callbs(info);
  // return data;
  if (method === PayMethodEnum.QueryOrder) {
    if (data) {
      var infor = data.infor.data;
      if (infor && infor.tradeStatus === 'TRADE_SUCCESS') {
        return { payapi: PayApiEnum.ALIPAY, tradestate: 'SUCCESS', payorder: infor };
      } else if (
        infor &&
        (infor.tradeStatus === null ||
          infor.tradeStatus === 'TRADE_CLOSED' ||
          infor.tradeStatus === 'TRADE_FINISHED')
      ) {
        return undefined;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return data;
  }
}
