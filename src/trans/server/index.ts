import { menu, machine } from './self/machine';
import { history } from './his/patient';
import {
  scheduling$date,
  scheduling$branch,
  scheduling$today,
  scheduling$primary,
  scheduling$schedule,
  regist$schedule,
  regist$Reserve,
} from './his/register';
import { prescription$list, prescription$view } from './his/payment';
import { serverTime } from './his/public';
import moment from 'moment';
export async function serverDatetime() {
  return await serverTime();
}
export async function serverMenu() {
  var res = await menu();
  return res;
}
export async function serverMachine() {
  var res = await machine();
  return res;
}
export async function serverHistory(type: string, no: string, capinfo: object) {
  var res = await history(type, no, capinfo);
  return res;
}
//挂号号源
export async function schedulingToday(branchCode: string, doctorCode: string) {
  let branch = null;
  if (!branchCode) {
    branch = await scheduling$branch();
    if (!branch || branch.length === 0) return null;
    branchCode = branch[0].branchCode;
  } else {
    branch = null;
  }
  console.log('schedulingToday');
  let schedule = await scheduling$today(branchCode, '');
  return { branch: branch, schedule: schedule ?? [] };
}
// 预约号源
export async function schedulingSchedule(branchCode: string, registDate: string) {
  let branch = null;
  let days = null;
  if (!branchCode) {
    branch = await scheduling$branch();
    if (!branch || branch.length === 0) return null;
    branchCode = branch[0].branchCode;
  } else {
    branch = null;
  }
  if (!registDate) {
    days = await scheduling$date();
    if (!days || days.length === 0) return null;
    registDate = days[0].dayString;
  } else {
    days = null;
  }
  if (registDate) {
    const isToday = registDate
      ? moment(registDate, 'YYYY-MM-DD').date() ===
        moment(await serverTime(), 'YYYYMMDDHHmmss').date()
      : false;
    const schedule = isToday
      ? await scheduling$today(branchCode, '')
      : await scheduling$schedule(branchCode, registDate, '');
      
    // 统一返回结果，避免重复的return结构
    return { days: days, branch: branch, schedule: schedule ?? [] };
  } else {
    return null;
  }
}
//0表示当日挂号 1表示预约挂号 9表示取号
export async function schedulingPrimary(type: string, primary: string) {
  var res = await scheduling$primary(type, primary);
  return res;
}

export async function registerSchedule(scheduleId: string) {
  var res = await regist$schedule(scheduleId);
  return res;
}
export async function serverPaylist() {
  var res = await prescription$list();
  return res;
}
export async function serverPayview(advice: string) {
  var res = await prescription$view(advice);
  return res;
}
export async function registReserve() {
  var res = await regist$Reserve();
  return res;
}
