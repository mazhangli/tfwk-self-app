<template>
  <div class="content flex-c">
    <div class="content__pack flex-c-s" :style="{ padding: '1rem' }">
      <span class="blod content__nav flex-c-c" style="font-size: 1.5rem; background-color: rgba(#3ee, 0.5)"
        v-if="deviceName">
        {{ deviceName }}</span>
      <el-input id="inputfield" ref="inputfield" placeholder="请扫描条码或二维码 / 输入条码或二维码内容" :rows="1" prefix-icon="FullScreen"
        :disabled="lockfield" v-model="inputfieldtext" :autofocus="true" :clearable="true" class="field"
        @change="onChange">
        <template #suffix>
          <i class="el-icon-edit el-input__icon" :style="{ 'font-size': '0.6rem' }"></i>
        </template>
      </el-input>
      <h2 class="tips flex-c-c">{{ head }}</h2>
      <div style="width: 100%; height: 50%" class="flex-c-c">
        <van-image :src="icon" height="100%" fit="contain" />
      </div>

      <van-empty v-if="printer()" :image="error" :description="printer()" image-size="4rem" class="bottom_icon" />
    </div>
    <div v-if="menucode === 'registry.mhzyy' && deviceCode" class="content__nav font-l blod flex-r-2"
      style="padding-left: 1rem">
      签到机号:{{ deviceCode }}</div>
    <div class="content__foot flex-r-3" v-if="!redirect">
      <van-button class="btn-size-small font-s" type="primary" icon="wap-home" v-on:click="onReturn()">返回首页
      </van-button>
      <timer-button ref="RefItimer" :total="60" :finish="onReturn" />
    </div>
  </div>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    nextTick,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    toRaw,
    toRefs,
  } from 'vue';
  import InputPad from '@/components/InputPad/InputPad.vue';
  import { useEventListener } from '@vant/use';
  import { Close, Open } from '@/utils/loading';
  import { ApiEnum, callApi, callDriver, DeviceEnum, MethodEnum } from '@/trans/driver';
  import { serverHistory } from '@/trans/server';
  import { getStore, setStore } from '@/utils/cache/storage';
  import {
    appRouteEnum,
    pushAppHome,
    pushRouteWithoutParam,
    pushRouteWithParam,
  } from '@/router/router';
  import { useRoute } from 'vue-router';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { speak } from '@/trans/driver/src/speech';
  import { callinsapi } from '@/trans/driver/src/insapi/index';
  import { deviceArrivalMessage, getArrivalList } from '@/trans/server/his/registry';
  import { Toast } from 'vant';
  import { isArray } from '@/utils/is';

  export default defineComponent({
    name: 'LoginDirect', //此组件将当做HOME路由使用 因此router.ts中对应/home
    props: {},
    emits: [],
    components: { InputPad, TimerButton },
    setup(props, ctx) {
      let field = window.document.getElementById('inputfield');

      const state = reactive({
        menucode: '',
        head: '',
        lockfield: false,
        icon: null as any,
        error: null as any,
        inputfieldtext: '',
        timer: null as any,
        deviceName: '',
        deviceCode: '',
        show: false,
        redirect: '',
        unmount: false,
      });
      const inputfield = ref(null as any);

      onMounted(async () => {
        state.redirect = getStore('machine').redirect;
        if(getStore('machine').redirect === "appHome") {
          state.redirect = "";
        }
        /*路由*/
        const route = useRoute();
        state.menucode = route.query.menucode ? route.query.menucode.toString() : '';
        console.log(getStore('last'));

        if (getStore('last').menuCode === 'registry.mhzyy') {
          state.menucode = 'registry.mhzyy';
          var d = await deviceArrivalMessage();
          state.head = d.operateTip;
          state.deviceName = d.deviceName;
          state.deviceCode = d.deviceCode;
          console.log(d);
        }
        if (getStore('last').menuCode === 'lisreport') {
          state.menucode = 'lisreport';
        }

        switch (state.menucode) {
          case 'medical.record.print':
            state.head = '请扫描就诊码、医保卡条形码或医保电子凭证，打印门诊病历';
            break;
          case 'medical.proof.print':
            state.head = '请扫描就诊码、医保卡条形码或医保电子凭证，打印诊断证明/病休单';
            break;
          case 'medical.prescription.print':
            state.head = '请扫描就诊码、医保卡条形码或医保电子凭证，打印门诊处方单';
            break;
          case 'medical.transfer.print':
            state.head = '请扫描就诊码、医保卡条形码或医保电子凭证，打印转诊单';
            break;
            case 'medical.invoice.print':
            state.head = '请扫描就诊码、医保卡条形码或医保电子凭证，打印发票';
            break;
          case 'lisreport':
            state.head = '请扫描就诊码、医保卡条形码或医保电子凭证，打印检验报告';
            break;
        }
        state.error = require('@/assets/svg/printer.error.svg');
        state.icon = require('@/assets/img/gif/scanning.mhzyy.gif');
        console.dir(inputfield.value);
        inputfield.value.focus();
      });
      let timer = setInterval(() => {
        focus();
      }, 100);
      const focus = function () {
        inputfield.value.focus();
      }; //销毁定时器
      onBeforeUnmount(() => {
        state.inputfieldtext = '';
        state.unmount = true;
        if (timer) {
          console.log('销毁定时器');
          clearTimeout(timer); //在Vue实例销毁前，清除我们的定时器
        }
      });
      useEventListener(
        'click',
        () => {
          inputfield.value.focus();
        },
        { target: document.body }
      );
      const onChange = async function () {
        if (!state.inputfieldtext) return;
        if(state.inputfieldtext.indexOf('wx.mhzyy.cn')>=0){
          Toast.loading({
            forbidClick: true,
            message: "当前为电子发票下载码，请您使用顶端条形码扫码签到。",
            className: 'mat_vant__toast',
            icon: require('@/assets/toast.mat.svg'),
            duration: 3000,
            overlay: true,
          });
          onReset();
          speak("当前为电子发票下载码，请您使用凭条顶端条形码扫码签到。");
          return;
        }
        state.lockfield = true;
        try {
          Open('正在查询信息,请等待...');

          ///民航签到机不判断打印机状态
          if (state.menucode != 'registry.mhzyy') {
            let sta = await callDriver(DeviceEnum.PRINTER, MethodEnum.STATE, {});
            if (!sta) {
              await speak('打印机状态异常,请前往其他设备打印');
              onReset();
              return;
            } else {
              setStore('reportPrinter', { state: 'ready', info: '正常状态' });
              console.log(printer());
            }
          }
          ///民航签到机
          console.log(state.menucode);
          if (state.menucode === 'registry.mhzyy') {
            await onReistry();
            return;
          }
          await speak('正在查询...');
          /////身份证识别开始
          await serverHistory('%', state.inputfieldtext, {});
          var info = getStore('history');
          if (isArray(info) && info.length === 0) info = null;
          console.log('info', info);
          if (!info || info.isSuccess === true) {
            if (state.menucode === 'registry.mhzyy') {
              onReset();
              return;
            }
            if (getStore('machine').hospitalcode === 'mhzyy') {
              let insinfo = await callinsapi(MethodEnum.PERSON_WEB, state.inputfieldtext);
              if (insinfo) {
                await serverHistory('%', insinfo.patientId, {});
                info = getStore('history');
                if (isArray(info) && info.length === 0) info = null;
                if (info) {
                  setStore('login', { cardtype: '医保卡' });
                  //continue;//capinfo电子凭证可识别
                } else {
                  speak('未识别出患者身份');
                  onReset();
                  return;
                }
              } else {
                speak('未识别出患者身份');
                onReset();
                return;
              }
            } else {
              var readed = await callinsapi(MethodEnum.READ, state.inputfieldtext);
              if (readed === true) {
                var capinfo = getStore('capinfo');
                await serverHistory('capinfo', state.inputfieldtext, capinfo);
                info = getStore('history');
                if (isArray(info) && info.length === 0) info = null;
                if (info) {
                  setStore('login', { cardtype: '医保卡' });
                  //continue;//capinfo电子凭证可识别
                } else {
                  speak('未识别出患者身份');
                  onReset();
                  return;
                }
              } else {
                speak('未识别出患者身份');
                onReset();
                return;
              }
            }
          } else {
            setStore('login', { cardtype: '非医保卡' });
            //continue;//条码可识别
          }
          /////身份证识别结束
          onPush();
        } catch (e) {
          console.log(e);
          speak('未识别出患者身份');
          onReset();
        }
      };
      const onReistry = async function () {
        ////民航签到机
        var d = await deviceArrivalMessage();
        if (d.workStatus === '0') {
          Toast.loading({
            forbidClick: true,
            message: d.notWorkTip,
            className: 'mat_vant__toast',
            icon: require('@/assets/toast.mat.svg'),
            duration: 5000,
            overlay: true,
          });
          onReset();
          speak(d.notWorkTip);
          return;
        }

        var of = await getArrivalList(state.inputfieldtext);
        Close();
        if (of) {
          pushRouteWithParam(appRouteEnum.Registry, {
            menucode: 'registry.mhzyy',
            qrCode: state.inputfieldtext,
            data: JSON.stringify(of.append),
          });
        } else {
          speak('签到失败');
          Toast.loading({
            forbidClick: true,
            message: '签到失败',
            className: 'mat_vant__toast',
            icon: require('@/assets/toast.mat.svg'),
            duration: 5000,
            overlay: true,
          });
        }
        onReset();
        return;
      };
      const onReset = function () {        
        state.inputfieldtext = '';
        state.lockfield = false;
        if(!state.unmount){
          if(inputfield) inputfield.value.focus();
        }
        Close();
      };
      const onPush = function () {
        console.log('push', state.menucode);
        switch (state.menucode) {
          case 'medical.record.print':
            console.log('路径跳转' + appRouteEnum.MrPrint);
            pushRouteWithoutParam(appRouteEnum.MrPrint);
            break;
          case 'medical.proof.print':
            console.log('路径跳转' + appRouteEnum.Proof);
            pushRouteWithoutParam(appRouteEnum.Proof);
            break;
          case 'medical.prescription.print':
            console.log('路径跳转' + appRouteEnum.Prescription);
            pushRouteWithoutParam(appRouteEnum.Prescription);
            break;
          case 'medical.transfer.print':
            console.log('路径跳转' + appRouteEnum.Transfer);
            pushRouteWithoutParam(appRouteEnum.Transfer);
            break;
          case 'medical.invoice.print':
            console.log('路径跳转' + appRouteEnum.EInvoiceMh);
            pushRouteWithoutParam(appRouteEnum.EInvoiceMh);
            break;
          case 'lisreport':
            if (getStore('machine').hospitalcode === 'mhzyy')
              pushRouteWithoutParam(appRouteEnum.LisReportPrint);
            else pushRouteWithoutParam(appRouteEnum.LisReport);
            break;
          case 'registry.mhzyy':
            pushRouteWithoutParam(appRouteEnum.Registry);
            break;
        }
      };
      const printer = function () {
        var print = getStore('reportPrinter');
        console.log('查询记录的打印机状态' + JSON.stringify(print));
        if (!print) return null;
        if (print.state === 'ready') {
          return null;
        } else {
          return getStore('reportPrinter').info;
        }
      };
      const onReturn = function () {
        pushAppHome();
      };
      return {
        ...toRefs(state),
        field,
        onChange,
        printer,
        onReturn,
        inputfield,
        onReset,
        onPush,
        onReistry,
      };
    },
  });
</script>

<style lang="less" scoped>
.field {
  z-index: 2022;
  box-shadow: 12px 12px 14px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 1em;
}

.tips {
  color: coral;
  font-size: 0.75rem;
  font-weight: bolder;
  line-height: 1rem;
  height: 1rem;
  vertical-align: middle;
  width: 100%;
}

.bottom_icon {
  bottom: 15vh;
  right: 2vw;
  position: fixed;
}

/deep/.el-input__icon {
  width: 1rem;
  vertical-align: middle;
}

/deep/.el-input__inner {
  height: 1rem;
}

/deep/.el-input .el-input__clear {
  font-size: 0.6rem;
}

/dee/.el-icon-edit .el-input__icon {
  font-size: 0.6rem;
}
</style>
