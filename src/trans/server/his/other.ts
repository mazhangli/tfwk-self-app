import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage'
//新冠肺炎流调数据上报
export async function covidSurvey(data: object) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientid = getStore('history').patientid;
    const json = {
        method: "CovidSurvey",
        finaltime: systime,
        operator: empid,
        info: {
            patientid: patientid,
            data: data,
        }
    }
    var info = await callServer(json);
    if (info) {
        return info;
    } else {
        return null;
    }
}

