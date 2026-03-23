import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';
import { Console } from 'console';

export async function report$lis() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').historyid;
  const json = {
    method: 'LisReportList',
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
export async function report$lis$range(range: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').historyid;
  const json = {
    method: 'LisReportListOfRange',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientid,
      range: range,
    },
  };
  var info = await callServer(json);
  if (info && info.sheets) {
    if (getStore('machine').hospitalcode === 'mhzyy') {
      return info;
    } else {
      return info.sheets;
    }
  } else {
    return null;
  }
}
export async function report$lis$view(id: string) {
  var Is: any[] = [];
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').historyid;
  const json = {
    method: 'LisReportView',
    finaltime: systime,
    operator: empid,
    info: {
      id: id,
    },
  };
  var info = await callServer(json);
  if (info && info.Images) {
    return info.Images;
  } else {
    return null;
  }
}
export async function report$lis$state(id: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  //var patientid = getStore('history').historyid;
  const json = {
    method: 'LisReportState',
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

export async function report$bc$lis() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').Patient.QueryPatientInfoRp.AnamNo;

  if (!patientid) {
    patientid = getStore('history').Patient.QueryPatientInfoRp.PatiNo;
  }

  console.log(getStore('history'));
  const json = {
    method: 'dlyy.bUltrasonicsList',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientid,
    },
  };
  var info = await callServer(json);
  if (info && info.info && info.info.sheets) {
    return info.info.sheets;
  } else {
    return null;
  }
}
export async function report$bc$view(id: string) {
  var Is: any[] = [];
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').historyid;
  const json = {
    method: 'dlyy.bUltrasonicsView',
    finaltime: systime,
    operator: empid,
    info: {
      id: id,
    },
  };
  var info = await callServer(json);
  if (info && info.info.Images) {
    return info.info.Images;
  } else {
    return null;
  }
}
export async function report$bc$state(id: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  //var patientid = getStore('history').historyid;
  const json = {
    method: 'dlyy.bUltrasonicsState',
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

export async function report$bw$lis() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;

  console.log(getStore('history'));
  const json = {
    method: 'bw.Report.List',
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
export async function report$bw$view(id: string) {
  var Is: any[] = [];
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'bw.Report.View',
    finaltime: systime,
    operator: empid,
    info: {
      id: id,
    },
  };
  var info = await callServer(json);
  if (info && info.Images) {
    return info.Images;
  } else {
    return null;
  }
}
export async function report$bw$state(id: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  //var patientid = getStore('history').historyid;
  const json = {
    method: 'bw.Report.State',
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
