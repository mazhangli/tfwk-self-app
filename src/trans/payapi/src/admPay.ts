import { serverTime } from '@/trans/server/his/public';
import { setStore, getStore } from '@/utils/cache/storage';
import { callbs, PayApiEnum, PayMethodEnum } from '../index';

export async function adm$pay(method: PayMethodEnum, infor: any): Promise<any> {
  var patientId = '';
  if (getStore('history')) {
    patientId = getStore('history').patientid;
  } else {
    patientId = getStore('patient').patientid;
  }
  var operator = getStore('system').empId;
  infor.operatorId = operator;
  infor.patientId = patientId;
  var info = { apiCode: PayApiEnum.ADMPAY, method: method, infor: infor };

  var data = await callbs(info);
  // return data;
  if (method === PayMethodEnum.QueryOrder) {
    if (data) {
      var infor = data.infor;
      console.log("判断结果",infor);
      if (infor && infor.status === 'SUCCESS') {
        return { payapi: PayApiEnum.ADMPAY, tradestate: 'SUCCESS', payorder: infor };
      } else if (
        infor &&
        (infor.status === null ||
          infor.status === 'CLOSED' ||
          infor.status === 'FINISHED')
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
