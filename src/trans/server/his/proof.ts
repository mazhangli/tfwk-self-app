import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';
import { Console } from 'console';

export async function proof$lis() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'ProofList',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientid,
    },
  };
  var info = await callServer(json);
  if (info && info.sheets) {
    return info.sheets;
  } else {
    return null;
  }
}
export async function proof$lis$range(range: number) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'ProofList',
    finaltime: systime,
    operator: empid,
    info: {
      range:range,
      patientId: patientid,
    },
  };
  var info = await callServer(json);
  if (info && info.sheets) {
    return info;
  } else {
    return null;
  }
}
export async function proof$state(id: string, type: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  //var patientid = getStore('history').patientid;
  const json = {
    method: 'ProofState',
    finaltime: systime,
    operator: empid,
    info: {
      id: id,
      type: type,
    },
  };
  var info = await callServer(json);
  if (info) {
    return true;
  } else {
    return null;
  }
}
