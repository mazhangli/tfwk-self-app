import { isUseMock, isDevMode } from '@/utils/env';
import { http } from './request';
import { Toast, Dialog } from 'vant';
import { Close } from '@/utils/loading';
export function callMachine<T = any>(json: Object): Promise<T> {
  const input = JSON.stringify(json);
  if (isDevMode()) console.log(input);
  let params = {
    input: input,
  };
  //console.log('isUseMock:' + isUseMock());
  const method = isUseMock() ? '/IMock' : '/MachineServer';
  return new Promise((resolve, reject) => {
    // http('/api')
    http('/machine')
      .post(method, params)
      .then(function(res: any) {
        if (res) {
          const state = stateres(res);
          resolve((state as unknown) as Promise<T>);
        } else {
          Toast.loading({
            forbidClick: true,
            message: '终端设备发生异常...',
            className: 'mat_vant__toast',
            icon: require("@/assets/toast.mat.svg"),
            duration: 3000,
            overlay:true,
          });
          //reject(new Error('调用服务端发生未知异常!'));
          resolve((null as unknown) as Promise<T>);
          Close();
        }
      })
      .catch(function(e: Error) {
        Toast.loading({
          forbidClick: true,
          message: e.message,
          className: 'mat_vant__toast',
          icon: require("@/assets/toast.mat.svg"),
          duration: 3000,
          overlay:true,
        });
        Close();
        reject(e);
      });
  });
}
export function stateres(res: any) {
  if (isDevMode()) console.log(res.data);
  if (!res.data) return null;
  const info = JSON.parse(res.data);
  if (info.state != 0) {
    Toast.loading({
      forbidClick: true,
      message: '终端设备服务器未应答',
      className: 'mat_vant__toast',
      icon: require("@/assets/toast.mat.svg"),
      duration: 3000,
      overlay:true,
    });
    return null;
  }
  if (info.info === null || info.info === [] || info.info.length === 0) {
    Toast.loading({
      forbidClick: true,
      message: '终端设备服务器未应答',
      className: 'mat_vant__toast',
      icon: require("@/assets/toast.mat.svg"),
      duration: 3000,
      overlay:true,
    });
    return null;
  }
  var message = '';
  info.info.forEach((item: any) => {
    if (item.code != 0) {
      message += (item.message || '终端设备无效应答') + '\r\n';
    }
  });
  if (message) {
    Toast.loading({
      forbidClick: true,
      message: message,
      className: 'mat_vant__toast',
      icon: require("@/assets/toast.mat.svg"),
      duration: 3000,
      overlay:true,
    });
    return null;
  } else {
    if (info.info.length === 1) return info.info[0];
    return info.info;
  }
}
