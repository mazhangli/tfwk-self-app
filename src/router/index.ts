import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AppTest from '@/views/Test.vue';
import AppLoad from '@/views/terminal/Load.vue';
import AppPage from '@/views/terminal/Page.vue';
import AppHome from '@/views/terminal/Home/Home.vue';
import AppLogin from '@/views/terminal/Home/Login.vue';
import AppLoginDirect from '@/views/terminal/Home/Login.direct.vue';
import AppLoginMedia from '@/views/terminal/Home/MediaPad/Index.vue';
import Manager from '@/views/terminal/Manager.vue';
import PatientCreate from '@/views/terminal/Patient/Creator/Index.vue';
import Automaton from '@/views/terminal/Automaton/Automaton.vue';
import Register from '@/views/terminal/Regist/Register.vue';
// import Scheduling from '@/views/terminal/Regist/失效组件暂时留存/Scheduling.vue';
import Payment from '@/views/terminal/Payment/Payment.vue';
import Deposit from '@/views/terminal/Inpatient/Deposit.vue';
import InHospitalRecord from '@/views/terminal/Inpatient/Record.vue';
import OneDay from '@/views/terminal/Inpatient/OneDay.vue';
import Inventory from '@/views/terminal/Inpatient/Inventory.vue';
import LisReport from '@/views/terminal/Report/LisReport.vue';
import LabReport from '@/views/terminal/Report/LisReport.New.vue';
import BasicItem from '@/views/terminal/BasicItem/BasicItem.vue';
import Purchase from '@/views/terminal/Medicine/Purchase.vue';
import Collection from '@/views/terminal/Medicine/Collection.vue';
import Survey from '@/views/terminal/Interface/COVID/Survey.vue';
import DlyyNucleic from '@/views/terminal/Nucleic/Nucleic.vue';
import DlyyNucleicInvoking from '@/views/terminal/Dlyy/Nucleic.vue';
import CompleteS from '@/views/terminal/Interface/Complete.2.vue';
import Invoice from '@/views/terminal/Invoice/Invoice.vue';
import InvoicePrint from '@/views/terminal/Invoice/Invoice.Print.vue';
import RegistRecord from '@/views/terminal/Query/Regist.vue';
import PaymentRecord from '@/views/terminal/Query/Payment.vue';
import AppointmentRecord from '@/views/terminal/Query/Appointment.vue';
import bUltrasonicsLoad from '@/views/terminal/bUltrasonics/bUltrasonicsLoad.vue';
import bUltrasonics from '@/views/terminal/Dlyy/bUltrasonics.vue';
import Examination from '@/views/terminal/Examination/Index.vue';
import ExaminationLogin from '@/views/terminal/Examination/Login.vue';
import ExaminationSignin from '@/views/terminal/Examination/SignIn/Index.vue';
import LisReportPrint from '@/views/terminal/Report/LisReport.Print.vue';
import MrPrint from '@/views/terminal/Print/Medical.Record.Print.vue';
import Proof from '@/views/terminal/Print/Medical.Proof.Print.vue';
import Prescription from '@/views/terminal/Print/Medical.Prescription.Print.vue';
import Transfer from '@/views/terminal/Print/Medical.Transfer.Print.vue';
import Registry from '@/views/terminal/Registry/Index.vue';
import RegistryDlyy from '@/views/terminal/Registry/Registry.D.vue';
import EInvoice from '@/views/terminal/Invoice/Invoice.Electronic.vue';
import EInvoiceMh from '@/views/terminal/Print/Medical.Invoice.Print.vue';
import bUltrasonicsReport from '@/views/terminal/Report/bUltrasonicsReport.vue';
import FilmPay from '@/views/terminal/FilmPay/Index.vue';
// import App from '@/App.vue';
import { appRouteEnum } from './router';
import { setStore } from '@/utils/cache/storage';

const routes: RouteRecordRaw[] = [
  {
    path: '/App/Test',
    name: appRouteEnum.appTest.replace('/', ''),
    component: AppTest,
  },
  {
    //終端登錄
    path: '/App/Load',
    name: appRouteEnum.appLoad.replace('/', ''),
    component: AppLoad,
  },
  {
    path: '/',
    component: AppPage, //顶层路由，对应index.html
    children: [
      {
        //首页
        path: appRouteEnum.appHome,
        name: appRouteEnum.appHome.replace('/', ''),
        component: AppHome,
      },
      {
        //登录方式
        path: appRouteEnum.userLogin,
        name: appRouteEnum.userLogin.replace('/', ''),
        component: AppLogin,
        props: true,
      },
      {
        //登录方式
        path: appRouteEnum.userLoginMedia,
        name: appRouteEnum.userLoginMedia.replace('/', ''),
        component: AppLoginMedia,
        props: true,
      }, {
        //登录方式---直接登录
        path: appRouteEnum.userLoginDirect,
        name: appRouteEnum.userLoginDirect.replace('/', ''),
        component: AppLoginDirect,
      },
      {
        //终端管理
        path: appRouteEnum.Manager,
        name: appRouteEnum.Manager.replace('/', ''),
        component: Manager,
      },
      {
        //流调表
        path: appRouteEnum.Survey,
        name: appRouteEnum.Survey.replace('/', ''),
        component: Survey,
      },
      {
        //自动处方
        path: appRouteEnum.Automaton,
        name: appRouteEnum.Automaton.replace('/', ''),
        component: Automaton,
      },
      {
        //核酸缴费-登录
        path: appRouteEnum.DlyyNucleic,
        name: appRouteEnum.DlyyNucleic.replace('/', ''),
        component: DlyyNucleic,
      },
      {
        //核酸缴费
        path: appRouteEnum.DlyyNucleicInvoking,
        name: appRouteEnum.DlyyNucleicInvoking.replace('/', ''),
        component: DlyyNucleicInvoking,
      },
      {
        //自助购药
        path: appRouteEnum.PurchaseMedicine,
        name: appRouteEnum.PurchaseMedicine.replace('/', ''),
        component: Purchase,
      },
      {
        //自助取药
        path: appRouteEnum.CollectionMedicine,
        name: appRouteEnum.CollectionMedicine.replace('/', ''),
        component: Collection,
      },
      {
        //自助建档
        path: appRouteEnum.PatientCreate,
        name: appRouteEnum.PatientCreate.replace('/', ''),
        component: PatientCreate,
      },
      {
        //自助挂号
        path: appRouteEnum.Register,
        name: appRouteEnum.Register.replace('/', ''),
        component: Register,
      },
      {
        //自助缴费
        path: appRouteEnum.Payment,
        name: appRouteEnum.Payment.replace('/', ''),
        component: Payment,
      },
      {
        //信用医疗结算
        path: appRouteEnum.Credit,
        name: appRouteEnum.Credit.replace('/', ''),
        component: Payment,
      },
      {
        //核酸缴费
        path: appRouteEnum.Nucleic,
        name: appRouteEnum.Nucleic.replace('/', ''),
        component: Payment,
      },
      {
        //住院押金
        path: appRouteEnum.Deposit,
        name: appRouteEnum.Deposit.replace('/', ''),
        component: Deposit,
      },
      {
        //住院记录
        path: appRouteEnum.InHospitalRecord,
        name: appRouteEnum.InHospitalRecord.replace('/', ''),
        component: InHospitalRecord,
      },
      {
        //住院每日一单
        path: appRouteEnum.OneDay,
        name: appRouteEnum.OneDay.replace('/', ''),
        component: OneDay,
      },
      {
        //住院费用清单
        path: appRouteEnum.Inventory,
        name: appRouteEnum.Inventory.replace('/', ''),
        component: Inventory,
      },
      {
        //化验报告
        path: appRouteEnum.LisReport,
        name: appRouteEnum.LisReport.replace('/', ''),
        component: LisReport,
      },
      {
        //化验报告(新版)
        path: appRouteEnum.LabReport,
        name: appRouteEnum.LabReport.replace('/', ''),
        component: LabReport,
      },
      {
        //物价查询
        path: appRouteEnum.BasicItem,
        name: appRouteEnum.BasicItem.replace('/', ''),
        component: BasicItem,
      },
      {
        //发票打印
        path: appRouteEnum.Invoice,
        name: appRouteEnum.Invoice.replace('/', ''),
        component: Invoice,
      },
      {
        //交易结束,等待返回首页
        path: appRouteEnum.CompleteS,
        name: appRouteEnum.CompleteS.replace('/', ''),
        component: CompleteS,
      },
      {
        path: appRouteEnum.RegistRecord,
        name: appRouteEnum.RegistRecord.replace('/', ''),
        component: RegistRecord,
      },
      {
        path: appRouteEnum.PaymentRecord,
        name: appRouteEnum.PaymentRecord.replace('/', ''),
        component: PaymentRecord,
      },
      {
        path: appRouteEnum.AppointmentRecord,
        name: appRouteEnum.AppointmentRecord.replace('/', ''),
        component: AppointmentRecord,
      },
      {
        path: appRouteEnum.bUltrasonicsLoad,
        name: appRouteEnum.bUltrasonicsLoad.replace('/', ''),
        component: bUltrasonicsLoad,
      },
      {
        path: appRouteEnum.bUltrasonics,
        name: appRouteEnum.bUltrasonics.replace('/', ''),
        component: bUltrasonics,
      },
      {
        // Examination 体检中心
        path: appRouteEnum.Examination,
        name: appRouteEnum.Examination.replace('/', ''),
        component: Examination,
      },
      {
        //ExaminationLogin 体检中心登录
        path: appRouteEnum.ExaminationLogin,
        name: appRouteEnum.ExaminationLogin.replace('/', ''),
        component: ExaminationLogin,
      },
      {
        //ExaminationSignin 体检中心登记
        path: appRouteEnum.ExaminationSignin,
        name: appRouteEnum.ExaminationSignin.replace('/', ''),
        component: ExaminationSignin,
      },
      {
        //化验报告-不显示明细
        path: appRouteEnum.LisReportPrint,
        name: appRouteEnum.LisReportPrint.replace('/', ''),
        component: LisReportPrint,
      },
      {
        //病历打印-不显示明细
        path: appRouteEnum.MrPrint,
        name: appRouteEnum.MrPrint.replace('/', ''),
        component: MrPrint,
      },
      {
        //诊断证明-不显示明细
        path: appRouteEnum.Proof,
        name: appRouteEnum.Proof.replace('/', ''),
        component: Proof,
      }, 
      {
        //病休单-不显示明细
        path: appRouteEnum.Prescription,
        name: appRouteEnum.Prescription.replace('/', ''),
        component: Prescription,
      },
      {
        //转诊单-不显示明细
        path: appRouteEnum.Transfer,
        name: appRouteEnum.Transfer.replace('/', ''),
        component: Transfer,
      },
      {
        //签到机
        path: appRouteEnum.Registry,
        name: appRouteEnum.Registry.replace('/', ''),
        component: Registry,
      },
      {
        //药房签到
        path: appRouteEnum.RegistryDlyy,
        name: appRouteEnum.RegistryDlyy.replace('/', ''),
        component: RegistryDlyy,
      },
      {
        //电子发票打印
        path: appRouteEnum.EInvoice,
        name: appRouteEnum.EInvoice.replace('/', ''),
        component: EInvoice,
      },
      {
        //电子发票打印(民航)
        path: appRouteEnum.EInvoiceMh,
        name: appRouteEnum.EInvoiceMh.replace('/', ''),
        component: EInvoiceMh,
      },
      {
        path: appRouteEnum.bUltrasonicsReport,
        name: appRouteEnum.bUltrasonicsReport.replace('/', ''),
        component: bUltrasonicsReport,
      },
      {
        //检查报告-胶片自助
        path: appRouteEnum.FilmPay,
        name: appRouteEnum.FilmPay.replace('/', ''),
        component: FilmPay,
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.afterEach((to) => {
  switch (to.path.toLowerCase()) {
    case appRouteEnum.userLogin.toLowerCase():
      setStore('countdown', { path: appRouteEnum.userLogin, timer: 90 });
      break;
  }
});
export default router;
