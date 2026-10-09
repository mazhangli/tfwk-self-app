import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';

/**
 * 交易1：查询可补收胶片医嘱列表
 * @param {string} patientId - 患者ID
 * @returns {Promise} 医嘱列表
 */
export async function queryAdviceList(patientId: any) {
    const systime = formatToDateTime(new Date().getTime());
    const empid = getStore('system')?.empId || '';
    const patientid = patientId || getStore('history')?.patientid || '';
    
    const json = {
        method: "pacs.Film.Advice",
        finaltime: systime,
        operator: empid,
        info: {
            patientId: patientid,
        }
    };
    
    try {
        const info = await callServer(json);
        return info || null;
    } catch (error) {
        console.error('查询医嘱列表失败:', error);
        return null;
    }
}

/**
 * 交易2：查询胶片收费项目
 * @param {string} itemId - 项目ID
 * @returns {Promise} 收费项目列表
 */
export async function queryFilmItems(itemId: any) {
    const systime = formatToDateTime(new Date().getTime());
    const empid = getStore('system')?.empId || '';
    
    const json = {
        method: "pacs.Film.Item",
        finaltime: systime,
        operator: empid,
        info: {
            itemId: itemId,
        }
    };
    
    try {
        const info = await callServer(json);
        return info || null;
    } catch (error) {
        console.error('查询胶片项目失败:', error);
        return null;
    }
}

/**
 * 交易3：生成胶片医嘱
 * @param {object} data - 参数
 * @param {string} data.patientId - 患者ID
 * @param {string} data.adviceId - 原CT检查医嘱ID
 * @param {number} data.pacsItemId - PACS项目ID
 * @param {string} data.operator - 操作人
 * @returns {Promise} 生成结果
 */
export async function createFilmAdvice(data: { patientId: any; adviceId: any; pacsItemId: any; operator: any; }) {
    const systime = formatToDateTime(new Date().getTime());
    const empid = getStore('system')?.empId || '';
    const patientid = data.patientId || getStore('history')?.patientid || '';
    
    const json = {
        method: "pacs.Film.Pay",
        finaltime: systime,
        operator: empid,
        info: {
            patientId: patientid,
            adviceId: data.adviceId,
            pacsItemId: data.pacsItemId,
            operator: data.operator || empid,
        }
    };
    console.log(json);
    try {
        const info = await callServer(json);
        return info || null;
    } catch (error) {
        console.error('生成胶片医嘱失败:', error);
        return null;
    }
}