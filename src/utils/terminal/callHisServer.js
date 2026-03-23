// import {decode} from 'js-base64';
let encoder = require('js-base64').Base64;
import { Toast } from 'vant';
import { getStore } from '../cache/storage';
// //记录终端调用结果
function result(info) {
  console.log(info);
  if (info) {
    var data = JSON.parse(info);
    if (data.resultcode === '1') {
      return data.info;
    } else {
      if (
        data.method === 'MenuSuspend' ||
        (!data.method && getStore('machine').hospitalcode === 'mhzyy' && window.location.href.indexOf('/App/Home') > -1)
      ) {
        return null;
      }
      //Toast.fail(data.resultmsg);
      Toast.fail({
        forbidClick: true,
        message: data.resultmsg,
        className: 'mat_vant__toast',
        icon: require('@/assets/toast.mat.svg'),
        duration: 5000,
        overlay: true,
      });
      //待补充 弹窗提示
      return null;
    }
  } else {
    return null;
  }
}

function callHisServer(json, timeOut) {
  const input = JSON.stringify(json);
  console.log(input);
  return new Promise((resolve, reject) => {
    //jsCallBack定义在C#端 此处异常无法处理也无需处理
    jsCallServer
      .callserver(input, parseInt(Number(timeOut)))
      .then(function (res) {
        const state = result(res);
        resolve(state);
      })
      .catch(function (e) {
        //Toast.fail(e.message);
        Toast.fail({
          forbidClick: true,
          message: e.message,
          className: 'mat_vant__toast',
          icon: require('@/assets/toast.mat.svg'),
          duration: 3000,
          overlay: true,
        });
        reject(e);
      });
  });
}

export default callHisServer;
