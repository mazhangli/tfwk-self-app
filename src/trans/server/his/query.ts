import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';

export async function queryBasicitem(
  itemType: String,
  pageIndex: Number,
  pageContain: Number,
  pinyinCode: String
) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'QueryBasicItem',
    finaltime: systime,
    operator: empid,
    info: {
      itemType: itemType,
      pageIndex: pageIndex,
      pageContain: pageContain,
      pinyinCode: pinyinCode,
      content: '%',
    },
  };
  var info = await callServer(json);
  if (info) {
    return info.list;
  } else {
    return null;
  }
}

export async function queryRegist(hisOrderno?: number) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientId = getStore('history').patientid;
  const json = {
    method: 'Query.Regist',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientId,
      hisOrderno: hisOrderno || 0,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}

export async function queryPayment(hisOrderno?: number) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientId = getStore('history').patientid;
    const json = {
      method: 'Query.Payment',
      finaltime: systime,
      operator: empid,
      info: {
        patientId: patientId,
        hisOrderno: hisOrderno || 0,
      },
    };
    var info = await callServer(json);
    if (info) {
      return info;
    } else {
      return null;
    }
  }
  export async function queryAppointment(hisOrderno?: number) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientId = getStore('history').patientid;
    const json = {
      method: 'Query.Appointment',
      finaltime: systime,
      operator: empid,
      info: {
        patientId: patientId,
        hisOrderno: hisOrderno || 0,
      },
    };
    var info = await callServer(json);
    if (info) {
      return info;
    } else {
      return null;
    }
  }