import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';

export async function advice$create(regId: number, menuCode: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'AdviceCreate',
    finaltime: systime,
    operator: empid,
    info: {
      regId: regId,
      patientId: patientid,
      menuCode: menuCode,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
