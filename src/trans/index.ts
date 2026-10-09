import { menu, menuSuspend, machine, media } from '@/trans/server/self/machine';
import { getStore, setStore } from '@/utils/cache/storage';
import {
  payment$budget,
  payment$cancel,
  payment$commit,
  payment$divide,
} from './server/his/payment';
import { callinsapi } from './driver/src/insapi/index';
import {
  regist$budget,
  regist$cancel,
  regist$commit,
  regist$divide,
  regist$schedule,
  regist$scheduled,
  scheduling$branch$cathe$set,
  scheduling$cathe$set,
} from './server/his/register';
import { capinfoFinish } from './server/his/public';
import { decode } from 'js-base64';
import X2JS from 'x2js';
import { system } from './driver/src/system';
import { speak } from './driver/src/speech';
import { open } from './driver/src/other';
import { MethodEnum } from './driver';

export async function startup() {
  // 获得设备信息
  if ((await system()) === false) return false;
  if ((await machine()) === false) return false;
  if ((await medias()) === false) return false;
  if ((await scheduling$cathe$set()) === false) return false;
  if ((await scheduling$branch$cathe$set()) === false) return false;
  if ((await open()) === false) return true; //忽略异常
  speak('终端启动成功');
  return true;
}
export async function menus() {
  // 取本机所需功能表
  const res = await menu();
  if (res === true) {
    return true;
  } else {
    return false;
  }
}
export async function menuSuspends(menucode: string) {
  
    const res = await menuSuspend(menucode);
    if (res === false) {
      return false;
    } else {
      return res;
    }
  
}
export async function medias() {
  const menuCode = getStore('last')?.menuCode || '';
  // 取本机所需功能表
  const res = await media(menuCode);
  if (res) {
    setStore('medias', res);
    return res;
  } else {
    return null;
  }
}

export async function paymentDivde(prescribe: string[]) {
  var hisOrder = await payment$budget(prescribe);
  console.dir('budgetOrder:' + JSON.stringify(hisOrder));
  if (hisOrder && hisOrder.capinfo && hisOrder.capinfo.Divide) {
    hisOrder.isIns = 1;
    var capinfoInner = await callinsapi(MethodEnum.DIVIDE, hisOrder.capinfo.Divide);
    console.dir('capinfoInner:' + JSON.stringify(capinfoInner));
    if (capinfoInner) {
      hisOrder.capinfoInner = capinfoInner;
      var hisDivdeOrder = await payment$divide(hisOrder);
      console.log('分解后账单:' + JSON.stringify(hisDivdeOrder));
      if (!hisDivdeOrder) await paymentCancel(hisOrder);
      return hisDivdeOrder;
    } else {
      //预算成功 医保分解失败
      await paymentCancel(hisOrder);
      return null;
    }
  } else {
    if (hisOrder) return hisOrder;
    else return null;
  }
}
export async function paymentCancel(hisOrder: any) {
  if (hisOrder) {
    if (hisOrder.isTrade === 1) {
      //回滚医保
      var capinfoInner = await callinsapi(MethodEnum.ROLLBACK);
      hisOrder.capinfoInner = capinfoInner;
    }
    await payment$cancel(hisOrder);
  }
}
export async function paymentCommit(hisOrder: any) {
  console.log(JSON.stringify(hisOrder));
  if (hisOrder) {
    if (hisOrder.isDivide === 1) {
      console.log('医保commit');
      var capinfoInner = await callinsapi(MethodEnum.COMMIT);
      if (!capinfoInner || capinfoInner === null) return null;
      hisOrder.capinfoInner = capinfoInner;
    }
    var hisSubmittedOrder = await payment$commit(hisOrder);
    if (!hisSubmittedOrder || hisSubmittedOrder === null) {
      return null;
    } else {
      if (hisOrder.isDivide === 1) {
        console.log('医保finish');
        var capinfoInner2 = await callinsapi(MethodEnum.FINISH, hisOrder.capinfo.Finish);
        if (!capinfoInner2 || capinfoInner2 === null) return null;
        hisOrder.capinfoInner = capinfoInner2;
        await capinfoFinish('10', hisOrder);
      }
      return hisSubmittedOrder;
    }
  } else {
    return null;
  }
}
export async function registDivde(scheduleId: string, scheduleOrderno = 0) {
  var hisOrder = null;
  if (scheduleOrderno > 0) {
    hisOrder = await regist$scheduled(scheduleOrderno);
  } else {
    hisOrder = await regist$budget(scheduleId);
  }
  console.dir('budgetOrder:' + JSON.stringify(hisOrder));
  if (hisOrder && hisOrder.capinfo && hisOrder.capinfo.Divide) {
    hisOrder.isIns = 1;
    var capinfoInner = await callinsapi(MethodEnum.DIVIDE, hisOrder.capinfo.Divide);
    console.dir('capinfoInner:' + JSON.stringify(capinfoInner));
    if (capinfoInner) {
      hisOrder.capinfoInner = capinfoInner;
      var hisDivdeOrder = await regist$divide(hisOrder);
      console.log('分解后账单:' + JSON.stringify(hisDivdeOrder));
      if (!hisDivdeOrder) await registCancel(hisOrder);
      return hisDivdeOrder;
    } else {
      //预算成功 医保分解失败
      await registCancel(hisOrder);
      return null;
    }
  } else {
    if (hisOrder) return hisOrder;
    else return null;
  }
}
export async function registCancel(hisOrder: any) {
  if (hisOrder) {
    console.log('hisOrder.isTrade' + hisOrder.isTrade);
    if (hisOrder.isTrade === 1) {
      //回滚医保
      var capinfoInner = await callinsapi(MethodEnum.ROLLBACK, hisOrder.capinfo.RollBack);
      hisOrder.capinfoInner = capinfoInner;
    } else {
      hisOrder.capinfoInner = null;
    }
    await regist$cancel(hisOrder);
  }
}
export async function registCommit(hisOrder: any) {
  if (hisOrder) {
    if (hisOrder.isDivide === 1) {
      console.log('医保commit');
      var capinfoInner = await callinsapi(MethodEnum.COMMIT);
      console.log('capinfoInner', capinfoInner);
      if (!capinfoInner || capinfoInner === null) return null;
      hisOrder.capinfoInner = capinfoInner;
    }

    var hisSubmittedOrder = await regist$commit(hisOrder);
    if (!hisSubmittedOrder || hisSubmittedOrder === null) {
      return null;
    } else {
      if (hisOrder.isDivide === 1) {
        console.log('医保finish');
        var capinfoInner2 = await callinsapi(MethodEnum.FINISH, hisOrder.capinfo.Finish);
        if (!capinfoInner2 || capinfoInner2 === null) return null;
        hisOrder.capinfoInner = capinfoInner2;
        await capinfoFinish('00', hisOrder);
      }
      return hisSubmittedOrder;
    }
  } else {
    return null;
  }
}
