export enum DeviceEnum {
  /**其他功能 */
  //系统操作 重启 关机 配置等
  SYSTEM = 'system',
  /**登录部分 */
  //身份证
  IDCARD = 'idcard',
  //医保卡
  INSCARD = 'inscard',
  //扫码枪
  SCANNER = 'scanner',
  //就诊卡
  PATCARD = 'patcard',
  /**发卡 */
  //发卡器
  ISSUER = 'issuer',
  /**打印部分 */
  //激光打印机
  PRINTER = 'printer',
  //热敏打印机
  THERMAL = 'thermal',
  //文本语音
  SPEECH = 'speech',
}
export enum ApiEnum {
  //医保接口 capinfo 医保需要终端运行
  INSAPI = 'insapi',
  //支付接口
  PAYAPI = 'payapi',
}
export enum MethodEnum {
  OPEN = 'open',
  CLOSE = 'close',
  STATE = 'state',
  INJECT = 'inject',
  FIND = 'find',
  READ = 'read',
  EJECT = 'eject',
  PRINT = 'print',
  IMAGE = 'image',
  PDF='pdf',
  PDFFIRST='pdffirst',
  HTML='html',
  SPEAK = 'speak',
  CANCEL = 'cancel',
  INFO = 'info',
  QUIT = 'quit',
  SHUTDOWN = 'shutdown',
  REBOOT = 'reboot',
  EXE = 'exe',

  CLASS = 'cardclass',
  PERSON = 'person',
  APPROVE = 'approve',
  DIVIDE = 'divide',
  COMMIT = 'commit',
  FINISH = 'finish',
  ROLLBACK = 'rollback',
  PERSON_WEB = 'personweb',
}

import callComputer from '@/utils/terminal/callComputer';
import { callMachine } from './util';

async function callDriver(device: DeviceEnum, method: MethodEnum, infor: any) {
  var info = { info: [{ device: device, method: method, info: infor }] };
  // var data = await callMachine(info);
  var data = await callComputer(info);
  return data;
}
async function callDriver$unified(method: MethodEnum, except?: string[]) {
  var list = [];
  for (var device in DeviceEnum) {
    if (except && except.indexOf(device) >= 0) continue;
    list.push({ device: device, method: method, info: {} });
  }
  var info = { info: list };
  // var data = await callMachine(info);
  var data = await callComputer(info);
  return data;
}
async function callApi(api: ApiEnum, method: MethodEnum, infor: any) {
  var info = { info: [{ device: api, method: method, info: infor }] };
  // var data = await callMachine(info);
  var data = await callComputer(info);
  return data;
}
export { callDriver, callDriver$unified, callApi };
