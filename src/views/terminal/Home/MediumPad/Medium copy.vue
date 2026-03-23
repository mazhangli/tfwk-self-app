<template>
  <div>
    <van-button type="primary" v-preventReClick="2000" class="app__medium" :style="Resize" @click="onClicked"
      style="border: none;border-radius: 1em; overflow: hidden;">
      <template #default>
        <div class="ground">
          <van-image width="100%" height="100%" :src="image" />
        </div>
        <div class="contenor">
          <div class="contenor-null"></div>
          <div class="contenor-mask">
            <div v-if="medium.mediumcode === 'MEDICARE.BARCODE' && hospital === 'bjjcpfyy'" class="contenor-tip"></div>
            <p class="font-m blod chinese">{{ medium.mediumname }}</p>
            <p class="font english">{{ medium.english }}</p>
          </div>
        </div>
      </template>
    </van-button>
    <!-- <medium-index :menucode="menucode" :medium="medium" :key="new Date()" v-if="show === true" @onCalled="onClose" /> -->
  </div>
  <van-dialog class="app__medium_popup" :key="token" v-model:show="show" :closeOnPopstate="true" className="bg" :show-cancel-button="false"
    :show-confirm-button="true" width="9rem" :overlay="true" overlayClass="van-overlay-white" theme="round-button"
    confirm-button-text="取消" message-align="center" :teleport="mediumpadfef" @closed="onClose">
    <medium-identity :medium="medium" v-if="medium.mediumcode === 'IDENTITY'" :key="token" @onCallend="oneOff" />
    <medium-medicareQR :medium="medium" v-if="medium.mediumcode === 'MEDICARE.BARCODE'" :key="token"
      @onCallend="oneOff" />
    <medium-scanner :medium="medium" v-if="medium.mediumcode === 'SCANNING'" :key="token" @onCallend="oneOff" />
    <medium-medical :medium="medium" v-if="medium.mediumcode === 'MEDICAL'" :key="token" @onCallend="oneOff" />
    <medium-medicare-card :medium="medium" v-if="medium.mediumcode === 'MEDICARE.CARD'" :key="token"
      @onCallend="oneOff" />
  </van-dialog>
  
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  ref,
  onMounted,
} from 'vue';
import { oneOf } from 'vue-types';
import { Close, Open } from '@/utils/loading';
import { appRouteEnum, pushRouteWithoutParam, pushRouteWithParam } from '@/router/router';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { getStore } from '@/utils/cache/storage';
import MediumIndex from './Login/Index.vue';
import MediumIdentity from './Login/Identity.vue';
import MediumMedicareQR from './Login/Medicare.QR.vue';
import MediumScanner from './Login/Scanner.vue';
import MediumMedical from './Login/Medical.vue';
import MediumMedicareCard from './Login/Medicare.Card.vue';
import { read as idcard } from '@/trans/driver/src/idcard';
import { read as patcard } from '@/trans/driver/src/patcard';
import { capinfo$person } from '@/trans/driver/src/insapi';
import { history, history$confined } from '@/trans/server/his/patient';
import { callinsapi } from '@/trans/driver/src/insapi/index';
import { MethodEnum } from '@/trans/driver';
import { inject as Inscard } from '@/trans/driver/src/inscard';
import { inject as Patcard } from '@/trans/driver/src/patcard';
import { patient$confined } from '@/trans/server/his/inhospital';

export default defineComponent({
  name: 'Medium',
  components: {
    MediumIndex,
    MediumIdentity,
    MediumMedicareQR,
    MediumScanner,
    MediumMedical,
    MediumMedicareCard,
  },

  props: {
    size: oneOf(['large', 'small', 'mini']),
    menucode: String,
    medium: {} as any,
  },
  emits: ['onCallBack', 'PopupClose', 'push'],
  setup(props, ctx) {
    const state = reactive({
      token: 0,
      show: false,
      hospital: '',
    });
    const mediumpadfef = ref(null as any);
    const Resize = computed(() => {
      if (props.size === 'large') {
        return ['width: 4.5rem', 'height: 4.5rem'];
      }
      if (props.size === 'small') {
        return ['width: 3rem', 'height: 3rem'];
      }
      if (props.size === 'mini') {
        return ['width: 2.5rem', 'height: 2.5rem'];
      }
    });
    const image = computed(() => {
      return require('@/assets/img/button/' + props.medium.mediumimg);
    });
    const captiongif = computed(() => {
      return require('@/assets/img/gif/' + props.medium.caption);
    });

    onMounted(() => {
      state.hospital = getStore('machine').hospitalcode;
      console.log("mediumpadfef", mediumpadfef);
    });
    const onClicked = async function () {
      state.token++;
      state.show = false;
      console.log(props.medium.mediumcode);
      if (props.medium.children && props.medium.children.length > 0) {
        if (ctx) ctx.emit('onCallBack', props.medium.mediumcode);
        return;
      }
      if (ctx) ctx.emit('PopupClose', {}); //关闭一级弹窗
      switch (props.medium.mediumcode) {
        case 'IDENTITY':
          break;
        case 'MEDICARE':
        case 'MEDICARE.CARD':
          if ((await Inscard()) === false) return;
          break;
        case 'MEDICARE.BARCODE':
          break;
        case 'SCANNING':
          break;
        case 'MEDICAL':
          if ((await Patcard()) === false) return;
          break;
      }
      state.show = true;
    };

    const oneOff = async function (success: boolean, ...args: any[]) {
      state.show = false; //关闭弹窗
      state.token++;
      var type = '';
      var card = '';
      var capinfo = {};
      var readed = false;
      if (success === true) {
        switch (props.medium.mediumcode) {
          case 'IDENTITY':
            readed = await idcard();
            if (readed === true) {
              type = '身份证';
              card = getStore('identity').Code;
            }
            break;
          case 'MEDICARE':
          case 'MEDICARE.CARD':
            readed = await callinsapi(MethodEnum.READ);
            if (readed === true) {
              type = 'capinfo';
              capinfo = getStore('capinfo');
            }
            break;
          case 'MEDICARE.BARCODE':
            if (args) {
              readed = await callinsapi(MethodEnum.READ, args[0]);
              if (readed === true) {
                type = 'capinfo';
                card = args[0];
                capinfo = getStore('capinfo');
              }
            }
            else
              readed = false;
            break;
          case 'SCANNING':
            if (args[0])
              readed = true;
            if (readed === true) {
              type = '%';
              card = args[0];
            }
            else
              readed = false;
            break;
          case 'MEDICAL':
            readed = await patcard();
            if (readed === true) {
              type = '就诊卡';
              card = getStore('patcard').cardno;
            }
            break;
        }
        if (readed === true) {
          Close();
          Open('');
          var server = false;
          if (props.menucode?.toLowerCase().startsWith('inhospital'))
            server = await patient$confined(type, card, capinfo, props.menucode);
          else
            server = await history$confined(type, card, capinfo, props.menucode);
          if (server === true) {
            if (ctx) ctx.emit('push', props.menucode);
          }
        }
        Close();
      }
    };

    const PopupClose = function () {
      if (ctx) ctx.emit('PopupClose', {});
    };
    const onPush = function () {
      switch (props.menucode) {
        case 'register.today': //自助挂号
          pushRouteWithParam(appRouteEnum.Register, { registType: '当日挂号' });
          break;
        case 'register.schedule': //自助预约
          // pushRouteWithoutParam(appRouteEnum.Schedule);
          pushRouteWithParam(appRouteEnum.Register, { registType: '预约挂号' });
          break;
        case 'appointment': //预约取号
          pushRouteWithParam(appRouteEnum.Register, { registType: '预约取号' });
          break;
        case 'payfor.examination':
        case 'payfor.examination1':
        case 'payfor.examination2':
        case 'payment': // 扫码取药
          pushRouteWithoutParam(appRouteEnum.Payment);
          break;
        case 'lisreport': // 化验报告
          pushRouteWithoutParam(appRouteEnum.LisReport);
          break;
        case 'medicine.purchase': // 自助购药
          pushRouteWithoutParam(appRouteEnum.PurchaseMedicine);
          break;
        case 'medicine.collection': // 扫码取药
          pushRouteWithoutParam(appRouteEnum.CollectionMedicine);
          break;
        case 'invoice.print': // 发票打印
          pushRouteWithoutParam(appRouteEnum.Invoice);
          break;
        case 'visit.record.regist'://查询挂号记录
          pushRouteWithoutParam(appRouteEnum.RegistRecord);
          break;
        case 'visit.record.payment'://查询缴费记录
          pushRouteWithoutParam(appRouteEnum.PaymentRecord);
          break;
        case 'visit.record.appointment'://查询预约记录
          pushRouteWithoutParam(appRouteEnum.AppointmentRecord);
          break;
        case "Report.bUltrasonics"://检查报告打印
          pushRouteWithoutParam(appRouteEnum.bUltrasonicsReport);
          break;
      }
    };
    onBeforeRouteLeave(() => {
      state.show = false; //关闭弹窗
    });
    const onClose = async function () {
      state.show = false; //关闭弹窗
      state.token++;
    };
    return {
      ...toRefs(state),
      image,
      captiongif,
      Resize,
      onClicked,
      mediumpadfef,
      PopupClose,
      onPush,
      onClose,
      oneOff,
    };
  },
});
</script>

<style lang="less" scoped>
.app__medium {
  position: relative;
  box-shadow: 0 20px 25px -15px rgba(#252627, 0.2), 0 10px 10px -15px rgba(#252627, 0.1);
  margin-right: 0.2rem;
  // border: rgba(#394664, 0.2) solid 1px;
}
.app__medium_popup{
  width: 100vw;
  height: 50vh;
}
.ground {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(#252627, 0.2);
  top: 0;
  left: 0;

  img {
    position: relative;
    width: 100%;
    height: 100%;
  }
}

.contenor {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  &-null {
    width: 100%;
    height: 75%;
  }

  &-mask {
    background: rgba(#252627, 0.6);
    border-top: rgb(#252627) solid 5px;
    width: 100%;
    height: 25%;
  }

  &-tip {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  &-tip::after {
    content: '支付宝刷医保码';
    position: absolute;
    color: #fff;
    text-align: center;
    justify-content: center;
    font-size: 0.25rem;
    padding: 0.1rem;
    height: 0.3rem;
    line-height: 0.3rem;
    border-radius: 2%;
    top: -0.4rem;
    right: 5px;
    box-shadow: 0px 0px 3px 0px;
    background-color: red;
  }
}

.chinese {
  color: #fff;
  vertical-align: middle;
  width: 100%;
  padding: 5px;
  line-height: 0.5rem;
}

.english {
  color: #fff;
  vertical-align: middle;
  width: 100%;
  line-height: 0.3rem;
}

.bg {
  background-color: #ebeef5 !important;
  border: #ebeef5 solid 1px;
}

/deep/.van-button--default {
  background-color: transparent !important;
}

/deep/.van-field--min-height .van-field__control {
  min-height: 0 !important;
}
</style>
