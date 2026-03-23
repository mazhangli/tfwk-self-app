import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage'

export async function serverTime() {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    const json = {
        method: "ServerTime",
        finaltime: systime,
        operator: empid,
    }
    var info = await callServer(json);
    if (info) {
        return info.servertime;
    } else {
        return null;
    }
}
export async function capinfoFinish(type: string, hisOrder: any) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    const json = {
        method: "CapinfoFinish",
        finaltime: systime,
        operator: empid,
        info: {
            type: type,
            hisOrderno: hisOrder.hisOrderno,
            capinfoInner: hisOrder.capinfoInner,
        }
    }
    var info = await callServer(json);
    if (info) {
        return true;
    } else {
        return false;
    }
}

export async function dict$Automaton(menuCode: string) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientid = getStore('history').patientid;
    const json = {
        method: "Dict.Automaton",
        finaltime: systime,
        operator: empid,
        info:{
            menuCode: menuCode,
            patientId: patientid,
        }
    }
    var info = await callServer(json);
    if (info) {
        return info;
    } else {
        return null;
    }
}