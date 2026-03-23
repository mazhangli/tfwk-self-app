import { decode } from 'js-base64';
import { Toast } from 'vant';
// //记录终端调用结果
function result(info: string): any {
  var data = JSON.parse(info);
  if (data.resultcode === "0") {
    switch (data.device) {
      case 'insapi':
        return data.insinfo;
      default:
        var content = decode(data.content);
        if (content) {
          console.log("设备调用成功,返回结果[" + content + "]");
          return JSON.parse(content);
        } else {
          console.log("设备调用成功,无结果值 返回默认'success'");
          return { done: 'success' };
        }
    }
  } else {
    Toast.fail(data.resultmsg);
    //待补充 弹窗提示
    return null;
  }
}

function callComputer<T = any>(json: any, timeOut: number): Promise<T> {
  const input = JSON.stringify(json);
  console.log(input);
  return new Promise((resolve, reject) => {
    //jsCallBack定义在C#端 此处异常无法处理也无需处理
    jsCallBack.calldevices(input, timeOut).then(
      function (res: any) {
        const state = result(res);
        console.log(state);
        resolve((state as unknown) as Promise<T>);
      }).catch(function (e: Error) {
        Toast.fail(e.message);
        reject(e);
      });
  });
}

export default callComputer;

