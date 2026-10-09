import { isUseMock, isDevMode } from '@/utils/env';
import { getUrl, http } from '@/utils/request';
import { Toast, Dialog } from 'vant';
import { Close } from '@/utils/loading';
import { getStore } from '@/utils/cache/storage';
import callHisServer from '@/utils/terminal/callHisServer';
export function getFileUri(path: String): String {
  var baseUrl = new URL(getUrl() as string).origin;
  return baseUrl + path;
}
export default function callServer<T = any>(json: Object): Promise<T> {
  if (getStore('system').root === 'localhost') {
    return callHisServer(json, 10000);
  }
  const input = JSON.stringify(json);
  if (isDevMode()) console.log(input);
  let params = {
    json: input,
  };
  //console.log('isUseMock:' + isUseMock());
  const method = isUseMock() ? '/IMock' : '/IServer';
  return new Promise((resolve, reject) => {
    //jsCallBack定义在C#端 此处异常无法处理也无需处理
    // http('/api')
    http('')
      .post(method, params)
      .then(async function (res: any) {
        console.dir(res);
        if (res) {
          const state = await Analysis(res);
          if (state) {
            resolve(state as unknown as Promise<T>);
          } else {
            console.log('Error: 用户取消操作');
            throw new Error('用户取消操作');
          }
        } else {
          Toast.loading({
            forbidClick: true,
            message: '调用服务端发生未知异常!',
            className: 'mat_vant__toast',
            icon: require('@/assets/toast.mat.svg'),
            duration: 3000,
            overlay: true,
          });
          //reject(new Error('调用服务端发生未知异常!'));
          resolve(null as unknown as Promise<T>);
          Close();
        }
      })
      .catch(function (e: Error) {
        //业务错误提示已由 Analysis 中的 Toast.fail 展示，此处不再重复弹出"用户取消操作"等 message，避免覆盖真实提示
        Close();
        reject(e);
      });
  });
}
function stateres(res: any, dialog = false) {
  if (isDevMode()) console.log(JSON.stringify(res.data));
  if (!res.data) return null;
  const info = res.data;
  if (info.resultcode != '1' && info.method !="MenuSuspend") {
    // Dialog.alert({
    //   title: '错误',
    //   message: info.resultmsg,
    //   closeOnPopstate: true,
    //   className: 'mat-vant__dialog',
    //   theme:'round-button',
    // }).then(() => {
    //   return null;
    // });
    Toast.fail({
      forbidClick: true,
      message: info.resultmsg,
      className: 'mat_vant__toast',
      icon: require('@/assets/toast.mat.svg'),
      duration: 5000,
      overlay: true,
    });
  } else {
    if (info.dialog === true) {
      // return new Promise((resolve, reject) => {
      //   Dialog.confirm({
      //     title: '请选择',
      //     message: info.resultmsg,
      //     closeOnPopstate: true,
      //     className: 'mat-vant__dialog',
      //     theme: 'round-button',
      //   })
      //     .then(async () => {
      //       resolve(info.info);
      //     })
      //     .catch(async () => {
      //       reject(null);
      //     });
      // });
    } else {
      return info.info ? info.info : { isSuccess: true };
    }
  }
}
export function Analysis<T = any>(res: any): Promise<T> {
  if (isDevMode()) console.log(JSON.stringify(res.data));
  return new Promise((resolve, reject) => {
    if (!res.data) {
      resolve(null as unknown as Promise<T>);
      return;
    }
    const info = res.data;
    if (info.resultcode != '1' && info.method !="MenuSuspend") {
      Toast.fail({
        forbidClick: true,
        message: info.resultmsg,
        className: 'mat_vant__toast',
        icon: require('@/assets/toast.mat.svg'),
        duration: 5000,
        overlay: true,
      });
      Close();
      resolve(null as unknown as Promise<T>);
    } else {
      if (info.dialog === true) {
        Close();
        Dialog.confirm({
          title: '请选择',
          message: info.resultmsg,
          closeOnPopstate: true,
          className: 'mat-vant__dialog',
          theme: 'round-button',
          overlay: true,
        })
          .then(async () => {
            resolve(info.info);
          })
          .catch(async () => {
            reject(null);
          });
      } else {
        resolve(info.info ? info.info : { isSuccess: true });
      }
    }
  });
}
