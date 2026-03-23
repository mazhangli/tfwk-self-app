import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';
import { callinsapi } from '@/trans/driver/src/insapi/index';
import { decode } from 'js-base64';
import { xml2json } from '@/utils/convert';
import { MethodEnum } from '@/trans/driver';

export async function history(type: string, no: string, capinfo: object) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var menuCode = getStore('last').menuCode;
  console.log(menuCode);
  var method;
  switch (menuCode) {
    case 'dlyy.nucleic.appointment':
      method = 'dlyy.Patient';
      break;
    case 'dlyy.examine':
      method = 'dlyy.Patient.3';
      break;
    default:
      method = 'dlyy.Patient.2';
      break;
  }
  const json = {
    method: method,
    finaltime: systime,
    operator: empid,
    info: {
      cardtype: type,
      cardno: no,
      capinfoInner: capinfo,
    },
  };
  var info = await callServer(json);
  if (info) {
    setStore('history', info);
    return true;
  } else {
    return false;
  }
}
export async function regist$divide() {
  var sDivide = getStore('history').Record.DivideInfo;
  if (sDivide) {
    var divideInner = await callinsapi(MethodEnum.DIVIDE, sDivide);
    if (divideInner) {
      /////debug数据
      // divideInner.Divide =
      //   'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTE2IiBzdGFuZGFsb25lPSJ5ZXMiPz4NCjxyb290IHZlcnNpb249IjEuMDAuMDkwMyI+PHN0YXRlIHN1Y2Nlc3M9InRydWUiPjwvc3RhdGU+PG91dHB1dD48dHJhZGVpbmZvPjx0cmFkZW5vPjA2MTUyMDAxMEMyMjA4MDMwMDE3NjM8L3RyYWRlbm8+PGZlZW5vPjwvZmVlbm8+PHRyYWRlZGF0ZT4yMDIyMDgwMzE4NDc1NTwvdHJhZGVkYXRlPjwvdHJhZGVpbmZvPjxmZWVpdGVtYXJyYXk+PGZlZWl0ZW0gaXRlbW5vPSIxIiByZWNpcGVubz0iMSIgaGlzY29kZT0iMDA2MzciIGl0ZW1jb2RlPSJ3MDEwMTAyMDAzNSIgaXRlbW5hbWU9IuWMu+S6i+acjeWKoei0ueOAkOS4gOe6p+WMu+mZouOAkeOAkOaZrumAmumXqOiviuOAkSIgaXRlbXR5cGU9IjIiIHVuaXRwcmljZT0iMjAuMDAwMCIgY291bnQ9IjEiIGZlZT0iMjAuMDAwMCIgZmVlaW49IjE5LjAwMDAiIGZlZW91dD0iMS4wMDAwIiBzZWxmcGF5Mj0iMS4wMDAwIiBzdGF0ZT0iMCIgZmVlX3R5cGU9IjA2MDEiIHByZWZlcmVudGlhbGZlZT0iMC4wMDAwIiBwcmVmZXJlbnRpYWxzY2FsZT0iMCI+PC9mZWVpdGVtPjwvZmVlaXRlbWFycmF5PjxzdW1wYXk+PGZlZWFsbD4yMC4wMDwvZmVlYWxsPjxmdW5kPjE5LjAwPC9mdW5kPjxjYXNoPjEuMDA8L2Nhc2g+PHBlcnNvbmNvdW50cGF5PjAuMDA8L3BlcnNvbmNvdW50cGF5Pjwvc3VtcGF5PjxwYXlpbmZvPjxtemZlZT4yMC4wMDwvbXpmZWU+PG16ZmVlaW4+MTkuMDA8L216ZmVlaW4+PG16ZmVlb3V0PjEuMDA8L216ZmVlb3V0PjxtenBheWZpcnN0PjAuMDA8L216cGF5Zmlyc3Q+PG16c2VsZnBheTI+MS4wMDwvbXpzZWxmcGF5Mj48bXpiaWdwYXk+MTkuMDA8L216YmlncGF5PjxtemJpZ3NlbGZwYXk+MC4wMDwvbXpiaWdzZWxmcGF5Pjxtem91dG9mYmlnPjAuMDA8L216b3V0b2ZiaWc+PGJjcGF5PjAuMDA8L2JjcGF5PjxqY2J6PjAuMDA8L2pjYno+PC9wYXlpbmZvPjxtZWRpY2F0YWxvZz48bWVkaWNpbmU+MC4wMDwvbWVkaWNpbmU+PHRtZWRpY2luZT4wLjAwPC90bWVkaWNpbmU+PHRoZXJiPjAuMDA8L3RoZXJiPjxleGFtaW5lPjAuMDA8L2V4YW1pbmU+PGN0PjAuMDA8L2N0Pjxtcmk+MC4wMDwvbXJpPjx1bHRyYXNvbmljPjAuMDA8L3VsdHJhc29uaWM+PG94eWdlbj4wLjAwPC9veHlnZW4+PG9wZXJhdGlvbj4wLjAwPC9vcGVyYXRpb24+PHRyZWF0bWVudD4wLjAwPC90cmVhdG1lbnQ+PHhyYXk+MC4wMDwveHJheT48bGFiZXhhbT4wLjAwPC9sYWJleGFtPjxibG9vZHQ+MC4wMDwvYmxvb2R0PjxvcnRob2RvbnRpY3M+MC4wMDwvb3J0aG9kb250aWNzPjxwcm9zdGhlc2lzPjAuMDA8L3Byb3N0aGVzaXM+PGZvcmVuc2ljX2V4cGVydGlzZT4wLjAwPC9mb3JlbnNpY19leHBlcnRpc2U+PG1hdGVyaWFsPjAuMDA8L21hdGVyaWFsPjxvdGhlcj4yMC4wMDwvb3RoZXI+PC9tZWRpY2F0YWxvZz48bWVkaWNhdGFsb2cyPjxkaWFnbm9zaXM+MjAuMDA8L2RpYWdub3Npcz48ZXhhbWluZT4wLjAwPC9leGFtaW5lPjxsYWJleGFtPjAuMDA8L2xhYmV4YW0+PHRyZWF0bWVudD4wLjAwPC90cmVhdG1lbnQ+PG9wZXJhdGlvbj4wLjAwPC9vcGVyYXRpb24+PG1hdGVyaWFsPjAuMDA8L21hdGVyaWFsPjxtZWRpY2luZT4wLjAwPC9tZWRpY2luZT48dGhlcmI+MC4wMDwvdGhlcmI+PHRtZWRpY2luZT4wLjAwPC90bWVkaWNpbmU+PG1lZGljYWxzZXJ2aWNlPjAuMDA8L21lZGljYWxzZXJ2aWNlPjxjb21tb25zZXJ2aWNlPjAuMDA8L2NvbW1vbnNlcnZpY2U+PHJlZ2lzdGZlZT4wLjAwPC9yZWdpc3RmZWU+PG90aGVyb3BmZWU+MC4wMDwvb3RoZXJvcGZlZT48L21lZGljYXRhbG9nMj48L291dHB1dD48L3Jvb3Q+DQo=';
      var tradeInner = await callinsapi(MethodEnum.COMMIT);
      if (tradeInner) {
        /////debug数据
        // tradeInner.Trade =
        //   'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTE2IiBzdGFuZGFsb25lPSJ5ZXMiPz4NCjxyb290IHZlcnNpb249IjEuMDAuMDkwMyI+PHN0YXRlIHN1Y2Nlc3M9InRydWUiPjwvc3RhdGU+PG91dHB1dD48cGVyc29uY291bnRhZnRlcnN1Yj4wLjAwPC9wZXJzb25jb3VudGFmdGVyc3ViPjxjZXJ0aWQ+Qk85NGpjRzRieVhpSTJ1SGlvb3hMNmtTemVOVlhlMTBzeTladlYyMWJja3VjMkMvZXJ3d3B6WXkxeHozTVRJZHJ6RTZDbU5aRzRuRG02T1dJay9yQWM0PTwvY2VydGlkPjxzaWduPnRCSDdwYkpHdzY5Skd5VlRHS1V5ZWh1a1d4Qlcwc3NuVDhiYVBlbjBXZC9aVGlHU0Y4bitXWlFzN1JvT0puVGtXV25iUkJTdUlyVTV2WTEzZEtxL1JnPT08L3NpZ24+PC9vdXRwdXQ+PC9yb290Pg0K';
        var Person = getStore('capinfo.person') ? xml2json(decode(getStore('capinfo.person'))) : {};
        if (Person) {
          if (!Person.root.output.ic.fromhosp) Person.root.output.ic.fromhosp = '';
          if (!Person.root.output.net.chroniccode) Person.root.output.net.chroniccode = '';
        }
        var Divide = getStore('capinfo.divide') ? xml2json(decode(getStore('capinfo.divide'))) : {};
        if (Divide) {
          if (!Divide.root.output.sumpay.personcount)
            Divide.root.output.sumpay.personcount = '0.00';
          if (!Divide.root.output.tradeinfo.feeno) Divide.root.output.tradeinfo.feeno = '';
        }
        return {
          Class: getStore('capinfo.class') ? xml2json(decode(getStore('capinfo.class'))) : {},
          Person: Person,
          Divide: Divide,
          Trade: getStore('capinfo.trade') ? xml2json(decode(getStore('capinfo.trade'))) : {},
        };
      } else {
        return false;
      }
    } else {
      //预算成功 医保分解失败
      return false;
    }
  } else {
    return false;
  }
}

export async function ownExpense() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'dlyy.OwnExpense',
    finaltime: systime,
    operator: empid,
    info: getStore('history'),
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return false;
  }
}
export async function regist$trade(capinfo: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'dlyy.PayRegister',
    finaltime: systime,
    operator: empid,
    info: { server: getStore('history'), capinfo: capinfo },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return false;
  }
}
export async function payment$info() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'dlyy.PaymentInfo',
    finaltime: systime,
    operator: empid,
    info: { server: getStore('history') },
  };
  var info = await callServer(json);
  if (info) {
    setStore('prescription', info);
    return info;
  } else {
    return false;
  }
}
export async function payment$divide() {
  var sDivide = getStore('prescription').DivideInfo;
  if (sDivide) {
    var divideInner = await callinsapi(MethodEnum.DIVIDE, sDivide);
    if (divideInner) {
      /////debug数据
      // divideInner.Divide =
      //   'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTE2IiBzdGFuZGFsb25lPSJ5ZXMiPz4NCjxyb290IHZlcnNpb249IjEuMDAuMDkwMyI+PHN0YXRlIHN1Y2Nlc3M9InRydWUiPjwvc3RhdGU+PG91dHB1dD48dHJhZGVpbmZvPjx0cmFkZW5vPjA2MTUyMDAxMEMyMjA4MDMwMDE3NjM8L3RyYWRlbm8+PGZlZW5vPjwvZmVlbm8+PHRyYWRlZGF0ZT4yMDIyMDgwMzE4NDc1NTwvdHJhZGVkYXRlPjwvdHJhZGVpbmZvPjxmZWVpdGVtYXJyYXk+PGZlZWl0ZW0gaXRlbW5vPSIxIiByZWNpcGVubz0iMSIgaGlzY29kZT0iMDA2MzciIGl0ZW1jb2RlPSJ3MDEwMTAyMDAzNSIgaXRlbW5hbWU9IuWMu+S6i+acjeWKoei0ueOAkOS4gOe6p+WMu+mZouOAkeOAkOaZrumAmumXqOiviuOAkSIgaXRlbXR5cGU9IjIiIHVuaXRwcmljZT0iMjAuMDAwMCIgY291bnQ9IjEiIGZlZT0iMjAuMDAwMCIgZmVlaW49IjE5LjAwMDAiIGZlZW91dD0iMS4wMDAwIiBzZWxmcGF5Mj0iMS4wMDAwIiBzdGF0ZT0iMCIgZmVlX3R5cGU9IjA2MDEiIHByZWZlcmVudGlhbGZlZT0iMC4wMDAwIiBwcmVmZXJlbnRpYWxzY2FsZT0iMCI+PC9mZWVpdGVtPjwvZmVlaXRlbWFycmF5PjxzdW1wYXk+PGZlZWFsbD4yMC4wMDwvZmVlYWxsPjxmdW5kPjE5LjAwPC9mdW5kPjxjYXNoPjEuMDA8L2Nhc2g+PHBlcnNvbmNvdW50cGF5PjAuMDA8L3BlcnNvbmNvdW50cGF5Pjwvc3VtcGF5PjxwYXlpbmZvPjxtemZlZT4yMC4wMDwvbXpmZWU+PG16ZmVlaW4+MTkuMDA8L216ZmVlaW4+PG16ZmVlb3V0PjEuMDA8L216ZmVlb3V0PjxtenBheWZpcnN0PjAuMDA8L216cGF5Zmlyc3Q+PG16c2VsZnBheTI+MS4wMDwvbXpzZWxmcGF5Mj48bXpiaWdwYXk+MTkuMDA8L216YmlncGF5PjxtemJpZ3NlbGZwYXk+MC4wMDwvbXpiaWdzZWxmcGF5Pjxtem91dG9mYmlnPjAuMDA8L216b3V0b2ZiaWc+PGJjcGF5PjAuMDA8L2JjcGF5PjxqY2J6PjAuMDA8L2pjYno+PC9wYXlpbmZvPjxtZWRpY2F0YWxvZz48bWVkaWNpbmU+MC4wMDwvbWVkaWNpbmU+PHRtZWRpY2luZT4wLjAwPC90bWVkaWNpbmU+PHRoZXJiPjAuMDA8L3RoZXJiPjxleGFtaW5lPjAuMDA8L2V4YW1pbmU+PGN0PjAuMDA8L2N0Pjxtcmk+MC4wMDwvbXJpPjx1bHRyYXNvbmljPjAuMDA8L3VsdHJhc29uaWM+PG94eWdlbj4wLjAwPC9veHlnZW4+PG9wZXJhdGlvbj4wLjAwPC9vcGVyYXRpb24+PHRyZWF0bWVudD4wLjAwPC90cmVhdG1lbnQ+PHhyYXk+MC4wMDwveHJheT48bGFiZXhhbT4wLjAwPC9sYWJleGFtPjxibG9vZHQ+MC4wMDwvYmxvb2R0PjxvcnRob2RvbnRpY3M+MC4wMDwvb3J0aG9kb250aWNzPjxwcm9zdGhlc2lzPjAuMDA8L3Byb3N0aGVzaXM+PGZvcmVuc2ljX2V4cGVydGlzZT4wLjAwPC9mb3JlbnNpY19leHBlcnRpc2U+PG1hdGVyaWFsPjAuMDA8L21hdGVyaWFsPjxvdGhlcj4yMC4wMDwvb3RoZXI+PC9tZWRpY2F0YWxvZz48bWVkaWNhdGFsb2cyPjxkaWFnbm9zaXM+MjAuMDA8L2RpYWdub3Npcz48ZXhhbWluZT4wLjAwPC9leGFtaW5lPjxsYWJleGFtPjAuMDA8L2xhYmV4YW0+PHRyZWF0bWVudD4wLjAwPC90cmVhdG1lbnQ+PG9wZXJhdGlvbj4wLjAwPC9vcGVyYXRpb24+PG1hdGVyaWFsPjAuMDA8L21hdGVyaWFsPjxtZWRpY2luZT4wLjAwPC9tZWRpY2luZT48dGhlcmI+MC4wMDwvdGhlcmI+PHRtZWRpY2luZT4wLjAwPC90bWVkaWNpbmU+PG1lZGljYWxzZXJ2aWNlPjAuMDA8L21lZGljYWxzZXJ2aWNlPjxjb21tb25zZXJ2aWNlPjAuMDA8L2NvbW1vbnNlcnZpY2U+PHJlZ2lzdGZlZT4wLjAwPC9yZWdpc3RmZWU+PG90aGVyb3BmZWU+MC4wMDwvb3RoZXJvcGZlZT48L21lZGljYXRhbG9nMj48L291dHB1dD48L3Jvb3Q+DQo=';
      var tradeInner = await callinsapi(MethodEnum.COMMIT);
      if (tradeInner) {
        /////debug数据
        // tradeInner.Trade =
        //   'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTE2IiBzdGFuZGFsb25lPSJ5ZXMiPz4NCjxyb290IHZlcnNpb249IjEuMDAuMDkwMyI+PHN0YXRlIHN1Y2Nlc3M9InRydWUiPjwvc3RhdGU+PG91dHB1dD48cGVyc29uY291bnRhZnRlcnN1Yj4wLjAwPC9wZXJzb25jb3VudGFmdGVyc3ViPjxjZXJ0aWQ+Qk85NGpjRzRieVhpSTJ1SGlvb3hMNmtTemVOVlhlMTBzeTladlYyMWJja3VjMkMvZXJ3d3B6WXkxeHozTVRJZHJ6RTZDbU5aRzRuRG02T1dJay9yQWM0PTwvY2VydGlkPjxzaWduPnRCSDdwYkpHdzY5Skd5VlRHS1V5ZWh1a1d4Qlcwc3NuVDhiYVBlbjBXZC9aVGlHU0Y4bitXWlFzN1JvT0puVGtXV25iUkJTdUlyVTV2WTEzZEtxL1JnPT08L3NpZ24+PC9vdXRwdXQ+PC9yb290Pg0K';
        return {
          Class: getStore('capinfo.class') ? xml2json(decode(getStore('capinfo.class'))) : {},
          Person: getStore('capinfo.person') ? xml2json(decode(getStore('capinfo.person'))) : {},
          Divide: getStore('capinfo.divide') ? xml2json(decode(getStore('capinfo.divide'))) : {},
          Trade: getStore('capinfo.trade') ? xml2json(decode(getStore('capinfo.trade'))) : {},
        };
      } else {
        return false;
      }
    } else {
      //预算成功 医保分解失败
      return false;
    }
  } else {
    return false;
  }
}
export async function payment$trade(capinfo: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var infor = getStore('history');
  infor.Record = getStore('prescription');
  const json = {
    method: 'dlyy.PayPayment',
    finaltime: systime,
    operator: empid,
    info: { server: infor, capinfo: capinfo },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return false;
  }
}
