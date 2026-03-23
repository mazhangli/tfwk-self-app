import { advice$create } from './server/his/automaton';
import { dict$Automaton } from './server/his/public';
import { regist$budget } from './server/his/register';
import { paymentCommit, paymentDivde, registCancel, registCommit, registDivde } from './index';
import { serverPaylist } from './server';
import { encode } from 'js-base64';
import { getStore } from '@/utils/cache/storage';
import Confirm from '@/views/terminal/Home/MediaPad/Capinfo';
import { MethodEnum } from './driver';
import { callinsapi } from './driver/src/insapi/index';
import { print } from './driver/src/thermal';

export async function using$1(menuCode: string) {
  var Automaton = await dict$Automaton(menuCode);
  if (!Automaton || Automaton.regist > 0) {
    var Regist = await registDivde('', 0);
    if (!Regist) registCancel(Regist);
    var Registed = await registCommit(Regist);
    if (!Registed) return false;

    //二次读卡
    var media = getStore('media');
    if (media.type === '医保卡') {
      if (media.cardno) {
        // var read = await calldrive(DeviceEnum.INSAPI, 'person', ['redone'], 0);
        //针对电子凭证二次读卡
        await Confirm({})
          .then(() => {
            console.log('二次读卡成功结束');
          })
          .catch(() => {
            console.log('二次读卡失败结束');
            return false;
          });
      } else {
        var read = await callinsapi(MethodEnum.READ);
        if (!read) return false;
      }
    }
  }
  var Advice = await serverPaylist();
  var Pay = await paymentDivde(Advice.map((item: { adviceid: any }) => item.adviceid));
  if (Pay) {
    var Payed = await paymentCommit(Pay);
    if (Payed) {
      await print({ context: encode(Payed.printContent) });
      return true;
    } else {
      return false;
    }
  }
  return false;
}
