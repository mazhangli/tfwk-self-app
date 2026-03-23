import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';
import { Toast } from 'vant';
import { isArray } from '@/utils/is';
export async function patient$confined(
  type: string,
  no: string,
  capinfo: object,
  menuCode: string | undefined | null
) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'InPatient',
    finaltime: systime,
    operator: empid,
    info: {
      cardtype: type,
      cardno: no,
      menuCode: menuCode,
      capinfoInner: capinfo,
    },
  };
  var info = await callServer(json);
  if (isArray(info) && info.length === 0) info = null;
  if (info) {
    if (isArray(info)) {
      setStore('patients', info);
    } else {
      setStore('patient', info);
    }
    setStore('media', { type: type === 'capinfo' ? '医保卡' : type, cardno: no });
    return true;
  } else {
    Toast({
      message: '未获取到住院记录',
      //theme: 'round-button',
      className: 'mat_vant__toast',
    });
    return false;
  }
}
////申请押金账单
export async function deposit$budget(amount: number) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientId = getStore('patient').patientid;
  var visitId = getStore('patient').visitId;
  const json = {
    method: 'DepositBudget',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientId,
      visitId: visitId,
      amount: amount,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function deposit$commit(hisOrder: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'DepositCommit',
    finaltime: systime,
    operator: empid,
    info: hisOrder,
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function deposit$cancel(hisOrder: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'DepositCancel',
    finaltime: systime,
    operator: empid,
    info: hisOrder,
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function daycost$query(day?: Date, itemClass?: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientId = getStore('patient').patientid;
  var visitId = getStore('patient').visitId;
  const json = {
    method: 'DayCost',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientId,
      visitId: visitId,
      day: day,
      itemClass: itemClass,
    },
  };
  var info = await callServer(json);
  if (info && info.items) {
    return info.items;
  } else {
    return null;
  }
}
