import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage'

export async function Info(method: string, state: string, context: string) {
    try {
        const systime = formatToDateTime(new Date().getTime());
        var system = getStore('system');
        var empid = system.empId;
        var ip = system.ipAddr;
        const json = {
            method: "Logger",
            finaltime: systime,
            operator: empid,
            info: {
                machineid: empid,
                Ip: ip,
                method: method,
                state: state,
                error: context,
            }
        }
        var info = await callServer(json);

        if (info) {
            return true;
        } else {
            return false;
        }

    } catch (e) {

    }
}
