import { serverTime } from '@/trans/server/his/public';
import { setStore, getStore } from '@/utils/cache/storage';
import { callbs, callcs, PayApiEnum, PayMethodEnum } from '../index';

export async function chasedll(method: PayMethodEnum, infor: any): Promise<any> {
  console.log('chasedll', infor);
  var patientId = '';
  if (getStore('history')) {
    patientId = getStore('history').patientid;
  } else {
    patientId = getStore('patient').patientid;
  }
  var operator = getStore('system').empId;
  infor.operatorId = operator;
  infor.patientId = patientId;
  infor.currentTime = await serverTime();
  infor.method = method;
  if (method === PayMethodEnum.QueryOrder) {
    infor.thirdOrderno = infor.payOrder.infor.misNo;
  }
  var info = { apiCode: PayApiEnum.CHASED, method: 'transaction', infor: infor };

  var data = await callcs(info);
  if (data && data.info) data.infor = data.info;
  // return data;
  if (method === PayMethodEnum.QueryOrder) {
    if (data) {
      var infor = data.infor;
      if (infor && infor.code === '00') {
        return { payapi: PayApiEnum.CHASED, tradestate: 'SUCCESS', payorder: infor };
      } else if (
        infor &&
        (infor.code === 'RB' || infor.code === 'RP' || infor.code === 'NP')
      ) {
        return null;
      } else {
        return undefined;
      }
    } else {
      return null;
    }
  } else if (method === PayMethodEnum.RequestOrder) {
    data.infor.qrCode = data.infor.payUrl;
    return data;
  } else {
    return data;
  }
}
