import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage'

export async function province() {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    const json = {
        method: "Dict.Province",
        finaltime: systime,
        operator: empid,
    }
    var info = await callServer(json);

    if (info) {
        return info.districts;
    } else {
        return null;
    }
}

export async function city(province: string) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    const json = {
        method: "Dict.City",
        finaltime: systime,
        operator: empid,
        info:{
            code:province,
        }
    }
    var info = await callServer(json);

    if (info) {
        return info.districts;
    } else {
        return null;
    }
}

export async function district(city: string) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    const json = {
        method: "Dict.District",
        finaltime: systime,
        operator: empid,
        info:{
            code:city,
        }
    }
    var info = await callServer(json);

    if (info) {
        return info.districts;
    } else {
        return null;
    }
}

export async function idcardtype() {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    const json = {
        method: "Dict.IdCardType",
        finaltime: systime,
        operator: empid,
    }
    var info = await callServer(json);

    if (info) {
        return info.items;
    } else {
        return null;
    }
}