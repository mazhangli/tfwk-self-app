import { callcapinfo } from './insapi/capinfo';
import { MethodEnum } from '@/trans/driver';
import { setStore } from '@/utils/cache/storage';
import { decode } from 'js-base64';
import X2JS from 'x2js';
export async function capinfo$person(barcode?: string) {
  if (barcode) {
    var opend = await callcapinfo(MethodEnum.OPEN);
    if (opend) {
      if (decode(opend.Open) === 'UnInvoke') return false;
      var x2js = new X2JS();
      var jsonObj = x2js.xml2js(decode(opend.Open)) as any;
      if (jsonObj.root.state._success === 'false') return false;
    } else {
      return false;
    }
  }
  let insinfo = await callcapinfo(MethodEnum.PERSON, barcode);
  if (insinfo) {
    var x2js = new X2JS();
    var jsonObj = x2js.xml2js(decode(insinfo.Person)) as any;
    if (jsonObj.root.state._success === 'false') return false;
    return true;
  } else {
    return false;
  }
}
