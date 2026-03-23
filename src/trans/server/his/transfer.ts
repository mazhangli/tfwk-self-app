import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';
import { Console } from 'console';

export async function transfer$lis() {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientid = getStore('history').patientid;
    const json = {
        method: 'TransferList',
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
export async function transfer$lis$range(range:number) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientid = getStore('history').patientid;
    const json = {
        method: 'TransferList',
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
export async function transfer$state(id: string) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    //var patientid = getStore('history').patientid;
    const json = {
        method: 'TransferState',
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