import { getStore, setStore } from '@/utils/cache/storage';
import { decode, encode } from 'js-base64';
import X2JS from 'x2js';
import { Notify, Toast } from 'vant';
import { isArray } from '@/utils/is';
import Confirm from '@/views/terminal/Home/MediaPad/Capinfo';
import { ApiEnum, callApi, MethodEnum } from '@/trans/driver';
import { insroot } from './index';
import { formatToDateTime } from '@/utils/dateUtil';
import callServer from '@/trans/server/util';
export async function find() {
  var opend = await callcapinfo(MethodEnum.OPEN);
  if (opend) {
    if (decode(opend.Open) === 'UnInvoke') return { isInject: false };
    var x2js = new X2JS();
    var jsonObj = x2js.xml2js(decode(opend.Open)) as any;
    if (jsonObj.root.state._success === 'false') return { isInject: false };
  } else {
    return { isInject: false };
  }
  let insinfo = await callcapinfo(MethodEnum.CLASS);
  if (insinfo) {
    var x2js = new X2JS();
    var jsonObj = x2js.xml2js(decode(insinfo.Class)) as any;
    if (jsonObj.root.state._success === 'false' && jsonObj.root.state.error.no === '2011')
      return { isInject: false };
    return { isInject: true };
  } else {
    return { isInject: false };
  }
}
export async function read(barcode?: string) {
  if (!barcode) {
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
  let _class = await callcapinfo(MethodEnum.CLASS, barcode);
  if (_class) {
    var x2js = new X2JS();
    var jsonObj = x2js.xml2js(decode(_class.Class)) as any;
    if (jsonObj.root.state._success === 'false') return false;
    // setStore('capinfo', _class);
  } else {
    return false;
  }

  let insinfo = await callcapinfo(MethodEnum.PERSON, barcode);
  if (insinfo) {
    var x2js = new X2JS();
    var jsonObj = x2js.xml2js(decode(insinfo.Person)) as any;
    if (jsonObj.root.state._success === 'false') return false;
    insinfo.Class = _class.Class;
    setStore('capinfo', insinfo);
    return true;
  } else {
    return false;
  }
}
export async function web(barcode?: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'capinfoWebPerson',
    finaltime: systime,
    operator: empid,
    info: {
      qrCode: barcode,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function callcapinfo(method: MethodEnum, args?: any) {
  if (method === MethodEnum.FIND) {
    return await find();
  }
  if (method === MethodEnum.READ) {
    return await read(args);
  }
  if (method === MethodEnum.PERSON_WEB) {
    return await web(args);
  }
  var isNation = false;
  if (method === MethodEnum.PERSON || method === MethodEnum.CLASS) {
    if (args && args === 'redone') {
      //针对电子凭证二次读卡
      await Confirm({})
        .then(() => {
          console.log('二次读卡成功结束');
          return true;
        })
        .catch(() => {
          console.log('二次读卡失败结束');
          return false;
        });
    }
    let machine = getStore('machine');
    let system = getStore('system'); //{"empid":"01858","mac":"0250F2000002","HostName":"DESKTOP-OUAM13S","Ip":"fe80::b9d9:9c9:12e9:fc12%17"}

    let _p =
      '<?xml version="1.0" encoding="UTF-8"?><root version="2.003" sender="BJTFWKKJ00002.100021">';
    if (args) {
      _p += '<input><multiclass>2</multiclass><QRcode>' + args + '</QRcode>';
    } else {
      _p += '<input><multiclass>1</multiclass><QRcode></QRcode>';
    }
    _p += '<businessType>01101</businessType>';
    _p += '<termId>' + system.macAddr + '</termId>';
    _p += '<termIp>' + system.ipAddr + '</termIp>';
    _p += '<operatorId>' + machine.machineid + '</operatorId>';
    _p += '<operatorName>' + machine.machinename + '</operatorName>';
    _p += '<officeId>' + machine.officeid + '</officeId>';
    _p += '<officeName>' + machine.officename + '</officeName>';
    _p += '</input></root>';
    args = encode(_p);
  }
  if (method === MethodEnum.FINISH) {
    var jsonObj = getXmlObject('capinfo.divide');
    if (jsonObj.root.state._success === 'false') return null;
    let _p =
      '<?xml version="1.0" encoding="UTF-8"?><root version="2.003" sender="BJTFWKKJ00002.100021"><input><tradeno>' +
      jsonObj.root.output.tradeinfo.tradeno +
      '</tradeno></input></root>';
    args = encode(_p);
  }
  //判断是否异地医保
  if (
    method === MethodEnum.PERSON ||
    method === MethodEnum.DIVIDE ||
    method === MethodEnum.COMMIT ||
    method === MethodEnum.FINISH ||
    method === MethodEnum.ROLLBACK
  )
    isNation = getXmlObject('capinfo.class').root.output.ic.card_class === '2';
  var info = {
    brand: isNation === true ? 'capinfo.nation' : 'capinfo',
    context: args,
  };

  var data = (await callApi(ApiEnum.INSAPI, method, info)).info;

  if (data) {
    setStore('capinfo', data);
    var xmlInner = '';
    switch (method) {
      case MethodEnum.OPEN:
        xmlInner = data.Open;
        break;
      case MethodEnum.CLASS:
        xmlInner = data.Class;
        break;
      case MethodEnum.PERSON:
        xmlInner = data.Person;
        break;
      case MethodEnum.APPROVE:
        xmlInner = data.Approve;
        break;
      case MethodEnum.DIVIDE:
        xmlInner = data.Divide;
        break;
      case MethodEnum.COMMIT:
        xmlInner = data.Trade;
        break;
      case MethodEnum.ROLLBACK:
        xmlInner = data.RollBack;
        break;
      case MethodEnum.FINISH:
        xmlInner = data.Finish;
        break;
      case MethodEnum.CLOSE:
        break;
      default:
        data = { done: 'success' };
        break;
    }
    if (xmlInner && xmlInner !== 'VW5JbnZva2U=') {
      var x2js = new X2JS();
      var _Obj = x2js.xml2js(decode(xmlInner)) as any;
      console.log(_Obj);
      if (_Obj.root.state._success === 'false') {
        Toast.clear();
        if (isArray(_Obj.root.state.error))
          // Toast.fail({
          //   forbidClick: false,
          //   message: _Obj.root.state.error[0]._info,
          //   className: 'mat_vant__toast',
          // });
          Notify({
            type: 'warning',
            message: _Obj.root.state.error[0]._info,
            duration: 500,
            position: 'bottom',
          });
        // Toast.fail({
        //   forbidClick: false,
        //   message: _Obj.root.state.error._info,
        //   className: 'mat_vant__toast',
        // });
        else
          Notify({
            type: 'warning',
            message: _Obj.root.state.error._info,
            duration: 500,
            position: 'bottom',
          });
        return undefined;
      }
    }

    switch (method) {
      case MethodEnum.OPEN:
        setStore('capinfo.open', data.Open);
        break;
      case MethodEnum.CLASS:
        setStore('capinfo.class', data.Class);
        setStore(
          'capinfo.isNation',
          getXmlObject('capinfo.class').root.output.ic.card_class === '2' ? 'true' : 'false'
        );
        //setStore('capinfo.person', '');
        setStore('capinfo.divide', '');
        setStore('capinfo.trade', '');
        setStore('capinfo.rollback', '');
        setStore('capinfo.finish', '');
        break;
      case MethodEnum.PERSON:
        setStore('capinfo.person', data.Person);
        break;
      case MethodEnum.APPROVE:
        setStore('capinfo.approve', data.Approve);
        break;
      case MethodEnum.DIVIDE:
        setStore('capinfo.divide', data.Divide);
        break;
      case MethodEnum.COMMIT:
        setStore('capinfo.trade', data.Trade);
        break;
      case MethodEnum.ROLLBACK:
        setStore('capinfo.rollback', data.RollBack);
        break;
      case MethodEnum.FINISH:
        setStore('capinfo.finish', data.Finish);
        break;
      case MethodEnum.CLOSE:
        setStore('capinfo.close', data.Close);
        break;
    }
    data.isNation = getStore('capinfo.isNation');
    return data;
  } else {
    switch (method) {
      case MethodEnum.OPEN:
        setStore('capinfo.open', '');
        break;
      case MethodEnum.CLASS:
        setStore('capinfo.class', '');
        break;
      case MethodEnum.PERSON:
        setStore('capinfo.person', '');
        break;
      case MethodEnum.APPROVE:
        setStore('capinfo.approve', '');
        break;
      case MethodEnum.DIVIDE:
        setStore('capinfo.divide', '');
        break;
      case MethodEnum.COMMIT:
        setStore('capinfo.trade', '');
        break;
      case MethodEnum.ROLLBACK:
        setStore('capinfo.rollback', '');
        break;
      case MethodEnum.FINISH:
        setStore('capinfo.finish', '');
        break;
      case MethodEnum.CLOSE:
        setStore('capinfo.close', '');
        break;
    }
    return null;
  }
}

export function getPeronInfoObject() {
  var _Obj = getXmlObject('capinfo.person');
  if (_Obj.root.state._success === 'false') {
    return null;
  } else {
    console.dir(_Obj.root.output);
    return _Obj.root.output;
  }
}
export function getXmlObject(nodes: any) {
  var capinfo = getStore(nodes);
  var xmlInner = decode(capinfo);
  var x2js = new X2JS();
  var _Obj = x2js.xml2js(xmlInner) as any;
  return _Obj;
}
