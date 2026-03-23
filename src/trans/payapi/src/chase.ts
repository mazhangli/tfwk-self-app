import { serverTime } from '@/trans/server/his/public';
import { setStore, getStore } from '@/utils/cache/storage';
import { callbs, PayApiEnum, PayMethodEnum } from '../index';

export async function chase(method: PayMethodEnum, infor: any): Promise<any> {
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
  if(method === PayMethodEnum.QueryOrder){
    infor.barcodeId = getStore('chase').barcodeId;
  }
  var info = { apiCode: PayApiEnum.CHASE, method: method, infor: infor };

  var data = await callbs(info);
  // return data;
  if (method === PayMethodEnum.QueryOrder) {
    if (data) {
      var infor = data.infor;
      if (infor && infor.respcode === '00') {
        return { payapi: PayApiEnum.CHASE, tradestate: 'SUCCESS', payorder: infor };
      } else if (infor && (infor.billStatus === 'RP' || infor.billStatus === 'NP')) {
        return null;
      } else {
        return undefined;
      }
    } else {
      return null;
    }
  } else if(method === PayMethodEnum.RequestOrder){
    var infor = data.infor;
    setStore('chase', { barcodeId: infor.qrCodeId });
    infor.qrCode = infor.barImage;
    return data;
  }
  else {
    return data;
  }
}
