import { http } from './request';
import { Toast, Dialog } from 'vant';
import { Open, Close } from '@/utils/loading';
// let KeyBoard = null as any;
// import { createSocket, sendWSPush, oncloseWS } from '@/utils/socket';

export enum Lang {
  English = 'english',
  Chinese = 'chinese',
  Write = 'write',
  Number = 'number',
  Identity = 'identity',
}
function callBoard<T = any>(data: string): Promise<T> {
  console.log(data);
  return new Promise((resolve, reject) => {
    //jsCallBack定义在C#端 此处异常无法处理也无需处理
    http('/keyboard')
      .post(data)
      .then(function(res: any) {
        if (res) {
          const state = stateres(res);
          resolve((state as unknown) as Promise<T>);
        } else {
          Toast.fail({
            forbidClick: true,
            message: '调用服务端发生未知异常!',
          });
          //reject(new Error('调用服务端发生未知异常!'));
          resolve((null as unknown) as Promise<T>);
          Close();
        }
      })
      .catch(function(e: Error) {
        Toast.fail({
          forbidClick: true,
          message: e.message,
        });
        Close();
        reject(e);
      });
  });
}
function stateres(res: any, dialog = false) {
  if (!res.data) return null;
  const info = res.data;
  return info;
}
export async function Show(lang: Lang) {
  Open('虚拟键盘');
  var screenWidth = window.screen.width * window.devicePixelRatio;
  var screenHeight = window.screen.height * window.devicePixelRatio;
  //   console.log(screenWidth, screenHeight);
  var width = (screenWidth / 1920) * 1200;
  var height = (screenWidth / 1920) * 600;
  console.log(parseInt(width), parseInt(height));
  var size = parseInt(width) + ',' + parseInt(height); //'1200,600';
  var post = parseInt((screenWidth - width) / 2) + ',' + parseInt((screenHeight - height) / 2);
  //await callBoard('hide');
  switch (lang) {
    case Lang.English:
      var res = await callBoard(
        'hide/inputbox(show,hint[请输入],fsize[33],row[1],done)/clearuserdb/showicon/enableautohide/size(' +
          size +
          ')/toolbar(1)/pos(' +
          post +
          ')/' +
          'skin(wathet)/png()/mode(Mat_En)'
      );
      var res = await callBoard('show');
      break;
    case Lang.Chinese:
      var res = await callBoard(
        'hide/inputbox(show,hint[请输入],fsize[33],row[1],done)/clearuserdb/showicon/enableautohide/size(' +
          size +
          ')/toolbar(1)/pos(' +
          post +
          ')/' +
          'skin(wathet)/png()/mode(Mat_Py)'
      );
      var res = await callBoard('show');
      break;
    case Lang.Write:
      var res = await callBoard(
        'hide/inputbox(show,hint[请输入],fsize[33],row[1],done)/clearuserdb/showicon/enableautohide/size(' +
          size +
          ')/toolbar(1)/pos(' +
          post +
          ')/' +
          'skin(wathet)/png()/mode(Mat_Hw)'
      );
      var res = await callBoard('show');
      break;
    case Lang.Identity:
      var res = await callBoard(
        'hide/inputbox(show,hint[请输入],fsize[33],row[1],done)/clearuserdb/showicon/enableautohide/size(' +
          size +
          ')/toolbar(0)/pos(' +
          post +
          ')/' +
          'skin(wathet)/png()/mode(Mat_Id)'
      );
      var res = await callBoard('show');
      break;
    default:
      break;
  }
  Close();
}

export async function Hide() {
  var res = await callBoard('hide');
}
