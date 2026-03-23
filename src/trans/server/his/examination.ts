import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';

export async function findPesNotesPlan() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var identity = getStore('identity');
  const json = {
    method: 'Examination.FindPesNotesPlan',
    finaltime: systime,
    operator: empid,
    info: identity,
  };
  var info = await callServer(json);
  if (info) {
    info.patientid = info.identityid;
    setStore('history', info);
    return info;
  } else {
    return null;
  }
}
export async function preRationByPesNotesPlanId(pesNotesPlanId: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'Examination.PreRationByPesNotesPlanId',
    finaltime: systime,
    operator: empid,
    info: {
      pesNotesPlanId: pesNotesPlanId,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function feeOrderPay(payCost: number, tjId: number, tradeNo: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var identity = getStore('identity');
  const json = {
    method: 'Examination.FeeOrderPay',
    finaltime: systime,
    operator: empid,
    info: {
      payCost: payCost,
      tjId: tjId,
      tradeNo: tradeNo,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function getBarCode(tjId: number) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'Examination.GetBarCode',
    finaltime: systime,
    operator: empid,
    info: {
      tjId: tjId
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
