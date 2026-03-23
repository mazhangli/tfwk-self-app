import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage'

export async function prescription$list() {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientid = getStore('history').patientid;
    var menuCode = getStore('last').menuCode;
    if(menuCode === 'payment') menuCode = '';
    const json = {
        method: "Preslist",
        finaltime: systime,
        operator: empid,
        info: {
            patientid: patientid,
            menuCode: menuCode,
        }
    }
    var info = await callServer(json);
    if (info) {
        return info.list;
    } else {
        return null;
    }
}
export async function prescription$view(advice: string) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    const json = {
        method: "Presview",
        finaltime: systime,
        operator: empid,
        info: {
            adviceid: advice,
        }
    }
    var info = await callServer(json);
    if (info) {
        return info.view;
    } else {
        return null;
    }
}
export async function payment$budget(prescribe: string[]) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientid = getStore('history').patientid;
    var isIns = getStore('media').type === "医保卡" ? "1" : "0";
    var menuCode = getStore('last').menuCode;
    const json = {
        method: "PaymentBudget",
        finaltime: systime,
        operator: empid,
        info: {
            patientId: patientid,
            isIns: isIns,
            prescribe: prescribe,
            menuCode: menuCode,
        }
    }
    var info = await callServer(json);
    if (info) {
        return info;
    } else {
        return null;
    }
}
export async function payment$cancel(hisOrder: any) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientid = getStore('history').patientid;
    const json = {
        method: "PaymentCancel",
        finaltime: systime,
        operator: empid,
        info: hisOrder,
    }
    var info = await callServer(json);
    if (info) {
        return true;
    } else {
        return false;
    }
}
export async function payment$divide(hisOrder: any) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientid = getStore('history').patientid;
    const json = {
        method: "PaymentDivide",
        finaltime: systime,
        operator: empid,
        info: hisOrder,
    }
    var info = await callServer(json);
    if (info) {
        return info;
    } else {
        return null;
    }
} 
export async function payment$commit(hisOrder: any) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    var patientid = getStore('history').patientid;
    const json = {
        method: "PaymentCommit",
        finaltime: systime,
        operator: empid,
        info: hisOrder,
    }
    var info = await callServer(json);
    if (info) {
        return info;
    } else {
        return null;
    }
}