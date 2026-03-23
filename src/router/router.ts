import { Open, Close } from '@/utils/loading';
export enum appRouteEnum {
  // 登录终端
  appLoad = 'App/Load',
  // 测试窗口
  appTest = '/App/Test',
  // 终端首页
  appHome = '/App/Home',
  // 患者登录(medium)
  userLogin = '/App/Login',
  // 患者登录（media）
  userLoginMedia = '/App/Login/Media',
  //终端登录-无首页直接刷卡-对应独有lis打印报告功能的打印机
  userLoginDirect = '/App/Login/Direct',
  // 终端管理
  Manager = '/App/Manager',
  // 流调表
  Survey = '/App/Survey',
  // 自动处方
  Automaton = '/App/Automaton',
  // 电力医院核酸缴费
  DlyyNucleic = '/App/Dlyy/Nucleic',
  // 电力医院核酸缴费
  DlyyNucleicInvoking = '/App/Dlyy/NucleicInvoking',
  // 自助建档
  PatientCreate = '/App/PatientCreate',
  // 自助建档--身份证
  MediumIdentity = '/App/Login/Identity',
  //自助挂号
  Register = '/App/Register',
  //自助预约
  Schedule = '/App/Schedule',
  //自助缴费
  Payment = '/App/Payment',
  //信用医疗结算
  Credit = '/App/Credit',
  //核酸缴费
  Nucleic = '/App/Nucleic',
  //住院押金
  Deposit = '/App/Deposit',
  //住院记录
  InHospitalRecord = '/App/Inhospital/Record',
  //住院每日一单
  OneDay = '/App/Inhospital/OneDay',
  //化验报告
  LisReport = '/App/LisReport',
  //化验报告(新版)
  LabReport = '/App/LisReport/New',
  //物价查询
  BasicItem = '/App/BasicItem',
  // 自助购药
  PurchaseMedicine = '/App/PurchaseMedicine',
  // 自助取药
  CollectionMedicine = '/App/CollectionMedicine',
  // 自助取药
  Invoice = '/App/Invoice',
  //交易结束-计时返回首页
  CompleteS = '/App/CompleteS',
  //挂号记录
  RegistRecord = '/App/Query/Regist',
  //挂号记录
  PaymentRecord = '/App/Query/Payment',
  //预约记录
  AppointmentRecord = '/App/Query/Appointment',
  //检验报告--电力医院B超登录
  bUltrasonicsLoad = '/App/Report/bUltrasonicsLoad',
  //检验报告--电力医院B超
  bUltrasonics = '/App/Report/bUltrasonics',
  //体检中心
  Examination = '/App/Examination',
  //体检中心--登录
  ExaminationLogin = '/App/Examination/Login',
  //体检中心--登记
  ExaminationSignin= '/App/Examination/Signin',
  //化验报告-直接打印
  LisReportPrint = '/App/LisReport/Print',
  //病历打印-直接打印
  MrPrint = '/App/Print/MrPrint',
  //诊断证明-直接打印
  Proof = '/App/Print/Proof',
  //病休单-直接打印
  Prescription = '/App/Print/Prescription',
  //转诊单-直接打印
  Transfer = '/App/Print/Transfer',
  //签到机
  Registry='/App/Registry',
  //药房签到机
  RegistryDlyy='/App/Registry/Dlyy',
  EInvoice='/App/Invoice/Electronic',
  EInvoiceMh='/App/Invoice/Electronic/minhang',
  //检查报告
  bUltrasonicsReport='/App/Report/bUltrasonicsReport',
}

import { menus, medias } from '../trans';
import router from '@/router/index';
import { Dialog } from 'vant';
import { getStore, setStore } from '@/utils/cache/storage';
import { eject } from '@/trans/driver/src/other';
export async function pushRouteWithParam(root: appRouteEnum, param: Record<string, any>) {
  switch (root) {
    case appRouteEnum.appHome: //登录前获取
      const res = await menus();
      if (res !== true) {
        return;
      }
      const media = await medias();
      if (media !== true) {
        //return;
      }
      closeDialog();
      break;
    default:
      break;
  }
  //console.log(param);
  //console.log(root);
  //closeDialog();
  
  router.push({
    name: root.replace('/', ''),
    query: param,
  });
}
export async function pushRouteWithoutParam(root: appRouteEnum) {
  switch (root) {
    case appRouteEnum.appHome: //登录前获取
      var redirect = getStore('machine').redirect;
      console.log('redirect',redirect);
      const res = await menus();

      if (redirect === 'surveyLoad') {
        root = appRouteEnum.Survey;
        break;
      }
      if (redirect === 'nucleicLoad') {
        await eject();
        root = appRouteEnum.DlyyNucleic;
        break;
      }
      if (redirect === 'bUltrasonics') {
        setStore('last', { menuCode: 'dlyy.examine' });
        await eject();
        root = appRouteEnum.userLoginMedia;
        break;
      }
      if (redirect === 'examination') {
        setStore('last', { menuCode: 'examination' });
        await eject();
        root = appRouteEnum.Examination;
        break;
      }
      if (redirect === 'lisreport') {
        setStore('last', { menuCode: 'lisreport' });
        await eject();
        root = appRouteEnum.userLoginDirect;
        pushRouteWithParam(root, {
          menucode: 'lisreport',
        });
        break;
      }
      if (redirect === 'registry') {
        setStore('last', { menuCode: 'registry.mhzyy' });
        root = appRouteEnum.userLoginDirect;
        pushRouteWithParam(root, {
          menucode: 'registry.mhzyy',
        });
        break;
      }
      if (redirect === 'registry.dlyy') {
        root = appRouteEnum.RegistryDlyy;
        break;
      }
  }
  closeDialog();
  router.push(root);
}
export async function pushAppHome() {
  Open('');
  await pushRouteWithoutParam(appRouteEnum.appHome);
  Close();
}
function closeDialog() {
  // console.log('跨路由时强制管理dialog');
  Dialog.close();
}
