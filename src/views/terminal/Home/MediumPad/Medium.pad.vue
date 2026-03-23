<template>
  <div class="content flex-c" ref="mediumpadfef">
    <div class="content__pack flex-center" v-show="shown === false && show === false">
      <!-- <span class="title__sub mat-header font-l blod">请选择身份认证方式</span> -->
      <span class="mat_fill__header font-l blod">请选择身份认证方式</span>
      <div class="content_pack_sub flex-r-c">
        <medium
          v-for="(item, index) in mediums"
          :key="index"
          size="large"
          :menucode="menucode"
          :medium="item"
          @onCallBack="onShowChild"
          @call="onCall"
          @push="onPush"
        />
      </div>
      <!-- <span style="width: 100%;height: 2rem">
                    <van-row justify="center">
                        <p class="font-m blod">
                            <van-icon name="warning-o" color="red" />自助机暂不支持工伤、特病患者挂号，请到窗口办理
                        </p>
                    </van-row>
                    <van-row justify="center">
                        <p class="font-m blod">北京医保患者请使用北京社保卡挂号、取号、缴费，否则费用将全额自费</p>
                    </van-row>
                    <van-row justify="center">
                        <p class="font-m blod">住院期间无法使用社保卡</p>
                    </van-row>
                </span> -->
      <!-- 当存在子属性时弹出界面选择子属性 -->
      <van-popup
        v-model:show="child"
        position="center"
        :style="{ height: '7.5rem', width: '12rem' }"
        overlay-class="van-overlay-white"
      >
        <div :style="{ width: '12rem', height: '6rem', margin: '0 auto' }" class="flex-r-c">
          <medium
            v-for="(item, index) in children"
            :key="index"
            size="large"
            :menucode="menucode"
            :medium="item"
            @onCallBack="onShowChild"
            @PopupClose="closepopup"
            @push="onPush"
          />
        </div>
        <div :style="{ width: '100%', height: '1rem' }" class="flex-center">
          <van-button
            type="default"
            :style="{ width: '90%', height: '100%', 'font-size': '0.4rem' }"
            color="#4fc08d"
            block
            :icon="front"
            @click="closepopup"
            >返回</van-button
          >
        </div>
      </van-popup>
    </div>
    <div class="content__pack flex-center" v-show="shown === true">
      <span class="mat_fill__header font-l blod">请选择本次就诊身份类型</span>
      <div class="content_pack_sub flex-r-c">
        <div class="left-pad flex-c-c">
          <van-empty
            :image="require('@/assets/img/ground.fund.png')"
            image-size="90%"
            description="描述文字"
          >
            <template #description>
              <span class="flex-r-c" style="height: 1.5rem">
                <van-icon name="label-o" size="0.5rem" />
                <p class="font-m">请选择本次就诊合适的身份类型</p>
              </span>
              <span style="width: 100%; height: 1.5rem" class="flex-c-c">
                <van-button
                  v-preventReClick="2000"
                  type="primary"
                  class="btn-size-normal font-l margin"
                  icon="wap-home"
                  icon-position="left"
                  @click="onCancel"
                  >&nbsp;返&nbsp;&nbsp;&nbsp;回
                </van-button>
              </span>
            </template>
          </van-empty>
        </div>
        <div class="right-pad">
          <span :key="index" v-for="(item, index) in classes" class="mediu m-class">
            <div class="content medium-class__pack" :key="index">
              <medium-class :history="item" @confirm="onConfirm" />
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="content__pack" v-if="show === true" :style="{ padding: '0 10%' }">
      <medium-index
        :medium="medium"
        :menucode="menucode"
        :token="token"
        @called="onPush"
        @cancel="show = false"
      />
    </div>
    <div class="content__foot flex-r-3">
      <van-button
        class="btn-size-normal btn__foot font-s"
        type="primary"
        icon="wap-home"
        @click="onReturn"
        v-preventReClick="2000"
        >返回首页</van-button
      >
      <timer-button ref="RefItimer" :total="120" :finish="onReturn" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  toRefs,
} from 'vue';
import Medium from './Medium.vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import {
  appRouteEnum,
  pushAppHome,
  pushRouteWithParam,
  pushRouteWithoutParam,
} from '@/router/router';
import { useRoute } from 'vue-router';
import { getStore, removeStore, setStore } from '@/utils/cache/storage';
import MediumClass from './Medium.Class.vue';
import { Dialog } from 'vant';
import { read as idcard } from '@/trans/driver/src/idcard';
import { read as patcard } from '@/trans/driver/src/patcard';
import { callinsapi } from '@/trans/driver/src/insapi/index';
import { MethodEnum } from '@/trans/driver';
import { Close, Open } from '@/utils/loading';
import { patient$confined } from '@/trans/server/his/inhospital';
import { history$confined } from '@/trans/server/his/patient';
import MediumIndex from './model/Index.vue';
import MediumIdentity from './model/Identity.vue';
import MediumMedicareQR from './Login/Medicare.QR.vue';
import MediumScanner from './model/Scanner.vue';
import MediumMedical from './Login/Medical.vue';
import MediumMedicareCard from './Login/Medicare.Card.vue';
export default defineComponent({
  name: 'MediumPad',
  props: {},
  emits: [],
  components: {
    Medium,
    MediumClass,
    TimerButton,
    MediumIndex,
    MediumIdentity,
    MediumMedicareQR,
    MediumScanner,
    MediumMedical,
    MediumMedicareCard,
  },
  setup(props, ctx) {
    const state = reactive({
      menucode: '',
      mediums: [] as any[],
      child: false,
      children: [] as any,
      shown: false,
      classes: [] as any[],
      medium: null as any,
      show: false,
      token: 0,
    });
    const front = require('@/assets/svg/button/front.svg');
    onBeforeMount(() => {
      /*路由*/
      const route = useRoute();
      if (route.query.mediums) state.mediums = JSON.parse(route.query.mediums.toString());
      if (route.query.menucode) state.menucode = route.query.menucode.toString();
      removeStore('historys');
      removeStore('history');
      removeStore('patients');
      removeStore('patient');
      removeStore('capinfo');
      removeStore('capinfo.open');
      removeStore('capinfo.class');
      removeStore('capinfo.person');
      removeStore('capinfo.approve');
      removeStore('capinfo.divide');
      removeStore('capinfo.trade');
      removeStore('capinfo.rollback');
      removeStore('capinfo.finish');
    });
    const onReturn = function () {
      pushAppHome();
    };
    const findchild = function (code: string) {
      var array = state.mediums.filter(function (item) {
        return item.mediumcode === code;
      });
      if (array) {
        return array[0].children;
      }
    };
    const onShowChild = function (val: any) {
      state.children = findchild(val);
      state.child = true;
    };
    const closepopup = function () {
      state.child = false;
    };
    const onCall = function (medium: any) {
      console.log(medium);
      state.medium = medium;
      state.show = true;
    };
    const onPush = function () {
      console.log('准备跳转...');
      state.token++;
      state.show = false;
      if (getStore('historys')) {
        state.shown = true;
        state.classes = getStore('historys');
        //state.classes=[{pattype:'自费', patclass:"4"},{pattype:'自费', patclass:"4"},{pattype:'自费', patclass:"4"},{pattype:'自费', patclass:"4"},{pattype:'自费', patclass:"4"}];
        return;
      }
      switch (state.menucode) {
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
        case 'payment': // 缴费
          pushRouteWithoutParam(appRouteEnum.Payment);
          break;
        case 'credit': // 信用医疗结算
          pushRouteWithoutParam(appRouteEnum.Credit);
          break;
        case 'nucleic': // 核酸缴费
          pushRouteWithoutParam(appRouteEnum.Nucleic);
          break;
        case 'lisreport': // 化验报告
          pushRouteWithoutParam(appRouteEnum.LisReport);
          break;
        case 'lisreport.new': // 化验报告
          pushRouteWithoutParam(appRouteEnum.LabReport);
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
        case 'visit.record.regist': //查询挂号记录
          pushRouteWithoutParam(appRouteEnum.RegistRecord);
          break;
        case 'visit.record.payment': //查询缴费记录
          pushRouteWithoutParam(appRouteEnum.PaymentRecord);
          break;
        case 'visit.record.appointment': //查询预约记录
          pushRouteWithoutParam(appRouteEnum.AppointmentRecord);
          break;
        case 'inhospital.deposit': //住院补缴押金
          pushRouteWithoutParam(appRouteEnum.Deposit);
          break;
        case 'inhospital.record': //住院记录
          pushRouteWithoutParam(appRouteEnum.InHospitalRecord);
          break;
        case 'inhospital.oneday': //每日一单
          pushRouteWithoutParam(appRouteEnum.OneDay);
          break;
        case 'einvoice.print': //电子发票打印
          pushRouteWithoutParam(appRouteEnum.EInvoice);
          break;
        case "medical.record.print"://门诊病历打印
          pushRouteWithoutParam(appRouteEnum.MrPrint);
          break;
        case "report.bultrasonics"://检查报告打印
          pushRouteWithoutParam(appRouteEnum.bUltrasonicsReport);
          break;
      }
    };
    const onConfirm = function (history: any) {
      if (history.credit && history.credit === true) {
        Dialog.confirm({
          message:
            '您已注册信用医疗用户,您本次就诊是否使用信用账户结算,/r/n选择[是]本次交易将跳过线上支付过程。',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
          closeOnPopstate: true,
          className: 'mat-vant__dialog',
          theme:'round-button',
        })
          .then(() => {})
          .catch(() => {
            history.credit = false;
          });
      }
      setStore('history', history);
      removeStore('historys');
      onPush();
    };
    const onCancel = function () {
      state.shown = false;
    };
    return {
      ...toRefs(state),
      onReturn,
      onShowChild,
      closepopup,
      onPush,
      front,
      onCancel,
      onConfirm,
      onCall,
    };
  },
});
</script>

<style lang="less" scoped>
.popover {
  width: max-content;
  height: max-content;
}

.content_pack_sub {
  height: ~'calc(100% - 1rem)';
  width: 100%;
}

.left-pad {
  width: 50%;
  height: 100%;
}

.right-pad {
  width: 50%;
  height: 100%;
  padding: 3% 5% 3% 5%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  grid-template-rows: 3rem;
}

.medium-class {
  width: 100%;
  height: 100%;

  border-radius: 1em;
  overflow: hidden;

  &__pack {
    //background: rgba(112, 133, 247, 0.5);
    background-image: linear-gradient(
      to right,
      rgba(112, 133, 247, 1) 0%,
      rgba(112, 133, 247, 0.6) 80%
    );
  }
}

.medium-class:nth-child(5n + 1) {
  background: url('~@/assets/img/ground.301.png');
  background-repeat: no-repeat;
  background-size: auto 60%;
  background-position: 100% 100%;
}

.medium-class:nth-child(5n + 2) {
  background: url('~@/assets/img/ground.302.png');
  background-repeat: no-repeat;
  background-size: auto 60%;
  background-position: 100% 100%;
}

.medium-class:nth-child(5n + 3) {
  background: url('~@/assets/img/ground.303.png');
  background-repeat: no-repeat;
  background-size: auto 60%;
  background-position: 100% 100%;
}

.medium-class:nth-child(5n + 4) {
  background: url('~@/assets/img/ground.304.png');
  background-repeat: no-repeat;
  background-size: auto 60%;
  background-position: 100% 100%;
}

.medium-class:nth-child(5n + 5) {
  background: url('~@/assets/img/ground.305.png');
  background-repeat: no-repeat;
  background-size: auto 60%;
  background-position: 100% 100%;
}
/deep/ .divtip {
  background-color: rgba(#fff, 0.5) !important;
  border-radius: 0.5rem;
  box-shadow: x-shadow 0 10px 10px rgba(0, 0, 0, 0.5);
}
</style>
