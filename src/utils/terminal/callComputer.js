// import {decode} from 'js-base64';
let encoder = require('js-base64').Base64;
import { Toast, Notify } from 'vant';
import { getStore, setStore } from '../cache/storage';
// //记录终端调用结果
export function result(infor) {
  console.log(infor);
  const info = JSON.parse(infor);
  if (info.state != 0) {
    Toast.loading({
      forbidClick: true,
      message: '终端设备服务器未应答',
      className: 'mat_vant__toast',
      icon: require('@/assets/toast.mat.svg'),
      duration: 3000,
      overlay: true,
    });
    return null;
  }
  if (info.info === null || info.info.length === 0) {
    Toast.loading({
      forbidClick: true,
      message: '终端设备服务器未应答',
      className: 'mat_vant__toast',
      icon: require('@/assets/toast.mat.svg'),
      duration: 3000,
      overlay: true,
    });
    return null;
  }
  var message = '';
  info.info.forEach((item) => {
    if (item.code != 0) {
      message += (item.message || '终端设备无效应答') + '\r\n';
      if (item.device === 'printer' && item.method === 'state' && item.code != 0) {
        setStore('reportPrinter', { state: 'error', info: item.message });
      }
    }
  });
  if (message) {
    if (getStore('machine').hospitalcode === 'mhzyy') {
      Notify({ type: 'danger', message: message, position: 'bottom', duration: 5000 });
    } else {
      Toast.loading({
        forbidClick: true,
        message: message,
        className: 'mat_vant__toast',
        icon: require('@/assets/toast.mat.svg'),
        duration: 3000,
        overlay: true,
      });
    }
    
    return null;
  } else {
    if (info.info.length === 1) return info.info[0];
    return info.info;
  }
}

function callComputer(json) {
  const input = JSON.stringify(json);
  console.log(input);
  return new Promise((resolve, reject) => {
    //jsCallDriver定义在C#端 此处异常无法处理也无需处理
    jsCallDriver
      .callDriver(input)
      .then(function (res) {
        const state = result(res);
        resolve(state);
      })
      .catch(function (e) {
        Toast.fail({
          forbidClick: true,
          message: e.message,
        });
        reject(e);
      });
  });
}

export default callComputer;
