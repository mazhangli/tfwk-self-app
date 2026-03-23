import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';

export async function invoice$lis() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'InvoiceList',
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
export async function einvoice$lis$range(range: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'eInvoiceList',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientid,
      range: range,
    },
  };
  var info = await callServer(json);
  if (info && info.sheets) {
    return info.sheets;
  } else {
    return null;
  }
}
export async function invoice$lis$page(type: string, pageIndex: number, pageContain: number) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'InvoiceListOfPage',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientid,
      type: type,
      pageIndex: pageIndex,
      pageContain: pageContain,
    },
  };
  var info = await callServer(json);
  if (info && info.sheets) {
    return info.sheets;
  } else {
    return null;
  }
}
export async function invoice$state(id: string, type: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  //var patientid = getStore('history').patientid;
  const json = {
    method: 'InvoiceState',
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
export async function invoice$file(type: string, noteId: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  //var patientid = getStore('history').patientid;
  const json = {
    method: 'invoiceFile',
    finaltime: systime,
    operator: empid,
    info: {
      type: type,
      noteId: noteId,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function invoice$lis$mh$range(range:number) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
      method: 'MhInvoiceList',
      finaltime: systime,
      operator: empid,
      info: {
          range: range,
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
export async function invoice$state$mh(id: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  //var patientid = getStore('history').patientid;
  const json = {
      method: 'MhInvoiceState',
      finaltime: systime,
      operator: empid,
      info: {
          id: id,
      },
  };
  var info = await callServer(json);
  if (info) {
      return true;
  } else {
      return null;
  }
}