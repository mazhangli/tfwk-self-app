import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, removeStore, setStore } from '@/utils/cache/storage';
import { Dialog, Toast } from 'vant';
import { history as dlyy } from '@/trans/server/his/nucleic';
import { isArray } from '@/utils/is';
export async function history(type: string, no: string, capinfo: object) {
  removeStore('historys');
  removeStore('history');
  setStore('historys', info)
  var menu = getStore('last').menuCode;
  if (getStore('machine').hospitalcode === 'dlyy') {
    return dlyy(type, no, capinfo);
  }
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'HPatient',
    finaltime: systime,
    operator: empid,
    info: {
      cardtype: type,
      cardno: no,
      menuCode: menu,
      capinfoInner: capinfo,
    },
  };
  var info = await callServer(json);
  if (info) {
    if (isArray(info)) {
      setStore('historys', info);
    } else {
      setStore('history', info);
    }
    setStore('media', { type: type === 'capinfo' ? '医保卡' : type, cardno: no });
    return true;
  } else {
    // Toast({
    //   message: '未获取到本院就诊档案',
    //   //theme: 'round-button',
    //   className: 'mat_vant__toast',
    // });
    return false;
  }
}
export async function history$confined(
  type: string,
  no: string,
  capinfo: object,
  menuCode: string | undefined | null
) {
  removeStore('historys');
  removeStore('history');
  if (getStore('machine').hospitalcode === 'dlyy') {
    return dlyy(type, no, capinfo);
  }
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'HPatient',
    finaltime: systime,
    operator: empid,
    info: {
      cardtype: type,
      cardno: no,
      menuCode: menuCode,
      capinfoInner: capinfo,
    },
  };
  var info = await callServer(json);
  console.log(info);
  if (isArray(info) && info.length === 0) info = null;
  if (info) {
    if (isArray(info)) {
      setStore('historys', info);
    } else {
      setStore('history', info);
      if(menuCode != 'account' && menuCode != 'register.schedule') await creditTost(info);
    }
    setStore('media', { type: type === 'capinfo' ? '医保卡' : type, cardno: no });
    return true;
  } else {
    if (menuCode != 'account'){
      // Toast({
      //   message: '未获取到本院就诊档案',
      //   //theme: 'round-button',
      //   className: 'mat_vant__toast',
      // });
    }
    return false;
  }
}
async function creditTost(info: any){
  if (info.credit && info.credit === true) {
    Dialog.confirm({
      message:
        '您已注册信用医疗用户,您本次就诊是否使用信用账户结算?\n选择[是]本次交易将跳过线上支付过程。\n选择[否]本次交易您需要支付自付金额。',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '是',
      cancelButtonText: '否',
      theme: 'round-button',
      className: 'mat-van-toast',
    })
      .then(() => {
        return false;
      })
      .catch(() => {
        info.credit = false;
        setStore('history', info);
        return true;
      });
  }
  return false;
}
export async function createHistory(info: any){
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'CreateHPatient',
    finaltime: systime,
    operator: empid,
    info: info
  };
  var info = await callServer(json);
  console.log(info);
  if (info) {    
    return true;
  } else {
    return false;
  }
}