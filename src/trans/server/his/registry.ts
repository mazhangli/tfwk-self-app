import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';

export async function deviceArrivalMessage() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var deviceIp = getStore('system').ipAddr;
  const json = {
    method: 'deviceArrivalMessage',
    finaltime: systime,
    operator: empid,
    info: {
      deviceIp: deviceIp,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function getArrivalList(qrCode: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  // var patientid = getStore('history').patientid;
  var deviceIp = getStore('system').ipAddr;
  const json = {
    method: 'getArrivalList',
    finaltime: systime,
    operator: empid,
    info: {
      deviceIp: deviceIp,
      qrCode: qrCode,
    },
  };
  var info = await callServer(json);
  if (info) {
    setStore('history', info);
    return info;
  } else {
    return null;
  }
}

export async function deviceArrivalByOne(data: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  // var patientid = getStore('history').patientid;
  var deviceIp = getStore('system').ipAddr;
  const json = {
    method: 'deviceArrivalByOne',
    finaltime: systime,
    operator: empid,
    info: {
      deviceIp: deviceIp,
      arrivalNoteId: data.arrivalNoteId,
      arrivalType: data.arrivalType,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}

export async function reportingMachine(context?: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var empName = getStore('machine').machinename;
  // var patientid = getStore('history').patientid;
  var deviceIp = getStore('system').ipAddr;
  var cardNumber = context;
  if (!cardNumber) cardNumber = getStore('identity').Code;
  var cardType = context && context.length === 12 ? '4' : context && context.length === 18 ? 5 : 1;
  const json = {
    method: 'reportingMachine',
    finaltime: systime,
    operator: empid,
    info: {
      cardNumber: cardNumber,
      cardType: cardType,
      opip: deviceIp,
      opmanNo: empid,
      opmanName: empName,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
