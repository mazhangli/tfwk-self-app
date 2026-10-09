import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage'

export async function machine() {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('system').empId;
    const json = {
        method: "Machine",
        finaltime: systime,
        operator: empid
    }
    var info = await callServer(json);

    if (info) {
        setStore('machine', info);
        return true;
    } else {
        return false;
    }
}
export async function menu() {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('machine').machineid;
    const json = {
        method: "Menu",
        finaltime: systime,
        operator: empid        
    }
    var info = await callServer(json);
    if (info) {
        setStore('menu', info.menus);
        return true;
    } else {
        return false;
    }
}
export async function menuSuspend(menucode: string) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('machine').machineid;
    const json = {
        method: "MenuSuspend",
        finaltime: systime,
        operator: empid,
        info:{
            menuCode: menucode,
        }     
    }
    var info = await callServer(json);
    if (info) {
        return info;
    } else {
        return false;
    }
}
export async function media(menuCode: string) {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('machine').machineid;
    const json = {
        method: "Media",
        finaltime: systime,
        operator: empid,
        info:{
            menuCode: menuCode,
        }     
    }
    var info = await callServer(json);
    if (info) {
        //setStore('media', info.medias);
        return info.medias;
    } else {
        return null;
    }
}

export async function style() {
    const systime = formatToDateTime(new Date().getTime());
    var empid = getStore('machine').machineid;
    var styleId = getStore('machine').styleId;
    const json = {
        method: "getStyleModel",
        finaltime: systime,
        operator: empid,
        info:{
            styleId: styleId,
        }     
    }
    var info = await callServer(json);
    console.log('style() 返回:', info);
    if (info) {
        return info;
    } else {
        return null;
    }
}