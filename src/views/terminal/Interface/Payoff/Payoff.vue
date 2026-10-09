<template>
  <div class="content">
    <div class="content__pack">
      <div class="content flex-c" v-if="active === ''">
        <span class="content__pack__context-title flex-r-c">
          <p class="blod">¥</p>
          <p class="font-xl blod">{{ amount }}</p>
          <p class="font-l" :style="{ width: '100%', color: '#5e5f61' }">待支付金额</p>
        </span>
        <div :style="{ height: 'calc(100% - 2rem)' }" class="flex-r-c">
          <van-image :src="icon" height="80%" :style="{ opacity: '0.7' }" />
        </div>
        <div :style="{ height: '0.5rem', width: '90%' }">
          <van-divider
            content-position="left"
            :style="{
              width: '100%',
              height: '0.5rem',
              'font-size': '0.3rem',
              color: '#1989fa',
              borderColor: '#1989fa',
              padding: '0 2px',
            }"
          >
            请选择支付方式
          </van-divider>
        </div>
      </div>
      <payoff-wechat
        :amount="amount"
        :barcode="qrbarcode"
        :minute="5"
        v-if="active === 'wechat' && paymode === 'nativepay'"
      />
      <payoff-alipay
        :amount="amount"
        :barcode="qrbarcode"
        :minute="5"
        v-if="active === 'alipay' && paymode === 'nativepay'"
      />
      <payoff-micropay
        :amount="amount"
        :minute="5"
        v-if="(active === 'wechat' || active === 'alipay') && paymode === 'micropay'"
        @scanSuccess="onPayask"
      />
    </div>
    <div class="content__foot">
      <div class="flex-r-3 payoff__pack">
        <span :class="locked ? ['payoff_lock'] : []">
          <payoff-method
            v-preventReClick="2000"
            type="wechat"
            :active="active === 'wechat'"
            v-if="paymodes.wechat"
            @click="onWechat"
          />
          <payoff-method
            v-preventReClick="2000"
            type="alipay"
            :active="active === 'alipay'"
            v-if="paymodes.alipay"
            @click="onAlipay"
          />
          <payoff-method
            v-preventReClick="2000"
            type="unionpay"
            :active="active === 'unionpay'"
            v-if="paymodes.union"
            @click="onUnionPay"
          />
          <payoff-method
            v-preventReClick="2000"
            type="credit"
            :active="active === 'credit'"
            v-if="paymodes.credit && patient.credit === true"
            @click="onCreditPay"
          />
        </span>
        <el-divider direction="vertical"></el-divider>
        <van-button
          v-preventReClick="2000"
          class="btn-size-normal font-s margin"
          type="primary"
          icon="revoke"
          icon-position="left"
          @click="onCancel"
          >取消支付
        </van-button>
        <timer-button
          :total="300"
          class="margin"
          ref="RefItimer"
          size="1.1rem"
          :finish="onCancel"
        />
      </div>
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
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import PayoffWechat from './Payoff.wechat.vue';

  import PayoffMicropay from './Payoff.tfwk.micropay.vue';
  import PayoffAlipay from './Payoff.alipay.vue';
  import PayoffMethod from './Payoff.method.vue';
  import { Close, Open } from '@/utils/loading';
  import moment from 'moment';
  import { serverDatetime } from '@/trans/server';
  import { getStore } from '@/utils/cache/storage';
  import { callpayapi, PayMethodEnum, PayModeEnum } from '@/trans/payapi';
  export default defineComponent({
    name: 'PayOff',
    props: {
      hisOrder: {} as any,
      amount: Number,
    },
    emits: ['onCancel', 'onPayend'],
    components: { TimerButton, PayoffMethod, PayoffWechat, PayoffAlipay, PayoffMicropay },
    setup(props, ctx) {
      const state = reactive({
        patient: {} as any,
        amount: 0,
        icon: null as any,
        qrbarcode: '',
        payOrder: {} as any,
        payInfo: {} as any,
        locked: false,
        paymodes: {} as any,
        payend: false,
        paymode: {} as any /**选择的支付方式**/,
        thirdOrderNo: '' as string,
      });
      const active = ref('');
      onBeforeMount(async () => {
        state.patient = getStore('history');
        state.paymodes = getStore('machine').paymodes;
        if (checkPaymodesOtherIsEmpty(state.paymodes)) {
          if (
            state.paymodes.wechat.paymode === 'micropay' &&
            state.paymodes.alipay.paymode === 'micropay'
          ) {
            console.log('仅微信和支付宝两种方式时, 支持同时扫码根据条码内容判断支付方式');
            active.value = 'wechat';
            state.paymode = 'micropay';
            state.locked = true;
          }
        }
        state.amount = props.amount as number;
        state.qrbarcode = '';
        state.icon = require('@/assets/svg/pay.wait.svg');
        if (state.patient.credit && state.patient.credit === true) {
          Open('');
          await onCreditPay();
        }
      });
      const checkPaymodesOtherIsEmpty = function (paymodes: any): boolean {
        // 边界校验：确保是对象且非数组
        if (!paymodes || typeof paymodes !== 'object' || Array.isArray(paymodes)) {
          return false;
        }
        // 允许有值的白名单属性
        const allowedKeys = ['wechat', 'alipay'];
        // 遍历所有自有属性
        for (const key in paymodes) {
          if (!paymodes.hasOwnProperty(key)) continue;
          const value = paymodes[key];
          // 白名单属性：允许非null/undefined（可追加有效值校验）
          if (allowedKeys.includes(key)) {
            continue;
          }
          if (key === 'credit' && state.patient.credit === false) {
            continue;
          }
          // 非白名单属性：必须是null或undefined
          if (value != null) {
            return false;
          }
        }
        return true;
      };
      const onAlipay = async function () {
        if (state.locked === false) {
          console.log('用户选择支付宝支付', props.hisOrder.thirdOrderno, props.amount);
          var pay = state.paymodes.alipay;
          if (pay && pay.paymode && pay.paymode === 'micropay') {
            state.paymode = pay.paymode;
            active.value = 'alipay';
            console.log('用户选择支付宝主扫支付');
          } else {
            if (!pay) {
              console.log('配置错误请联系研发处理');
              return;
            }
            state.paymode = 'nativepay';
            console.log('用户选择支付宝被扫支付');
            await onPayask('alipay');
          }
        }
      };
      const onWechat = async function () {
        if (state.locked === false) {
          console.log('用户选择微信支付', props.hisOrder.thirdOrderno, props.amount);
          var pay = state.paymodes.wechat;
          if (pay && pay.paymode && pay.paymode === 'micropay') {
            state.paymode = pay.paymode;
            active.value = 'wechat';
            console.log('用户选择微信主扫支付');
          } else {
            if (!pay) {
              console.log('配置错误请联系研发处理');
              return;
            }
            state.paymode = 'nativepay';
            console.log('用户选择微信被扫支付');
            await onPayask('wechat');
          }
        }
      };

      const onUnionPay = async function () {
        if (state.locked === false) {
          console.log('用户选择银联在线支付', props.hisOrder.thirdOrderno, props.amount);
          var pay = state.paymodes.unionpay;
          if (pay && pay.paymode && pay.paymode === 'micropay') {
            state.paymode = pay.paymode;
            active.value = 'unionpay';
            console.log('用户选择银联主扫支付');
          } else {
            if (!pay) {
              console.log('配置错误请联系研发处理');
              return;
            }
            state.paymode = 'nativepay';
            console.log('用户选择银联被扫支付');
            await onPayask('unionpay');
          }
        }
      };

      const onCreditPay = async function () {
        if (state.locked === false) {
          Open('');
          console.log('用户选择信用付', props.hisOrder.thirdOrderno, props.amount);
          await onPayoff({
            paymode: 'credit',
            payapi: 'credit',
            payorder: { hasInfo: false },
          });
        }
      };

      const onPayask = async function (type: string, authcode?: string) {
        if(state.thirdOrderNo == props.hisOrder.thirdOrderno){
          console.log('当前订单号重复，返回', state.thirdOrderNo);
          return;
        }
        console.log('记录信息', type, props.hisOrder.thirdOrderno, props.amount, authcode);
        if (props.hisOrder && props.hisOrder.thirdOrderno && props.amount) {
          console.log(
            '传入后端支付信息',
            type,
            props.hisOrder.thirdOrderno,
            props.amount,
            authcode
          );
          Open('');
          active.value = type;
          // state.locked = true;
          let start = await serverDatetime();
          if (start) {
            let end = moment(start, 'YYYYMMDDHHmmss').add(3, 'minute').format('YYYYMMDDHHmmss');
            //state.qrbarcode = await calldrive(DeviceEnum.PAYAPI, 'RequestOrder', [type, props.hisOrder.thirdOrderno, props.amount.toString(), start, end], 0);
            var payorder = null as any;
            try {
              state.thirdOrderNo = props.hisOrder.thirdOrderno;
              payorder = await callpayapi(
                type === 'wechat'
                  ? PayModeEnum.WECHAT
                  : type === 'alipay'
                  ? PayModeEnum.ALIPAY
                  : PayModeEnum.UNIONPAY,
                PayMethodEnum.RequestOrder,
                {
                  authCode: authcode,
                  thirdOrderno: props.hisOrder.thirdOrderno,
                  amount: props.amount,
                  start: start,
                  end: end,
                  payway: type === 'wechat'
                  ? PayModeEnum.WECHAT
                  : type === 'alipay'
                  ? PayModeEnum.ALIPAY
                  : PayModeEnum.UNIONPAY,
                }
              );
              state.payOrder = payorder;
            } catch (error) {
              console.log('支付请求失败', error);
            }
            if (!payorder) {
              Close();
              active.value = '';
              return;
            }
            console.log(payorder);
            if (payorder && payorder.infor && payorder.infor.qrCode) {
              state.qrbarcode = payorder.infor.qrCode;
            }
            Close();
            //if (state.qrbarcode) {
            state.locked = true;
            var payorder = null;
            do {
              payorder = await onPaying(type);
              if (payorder) {
                await onPayoff(payorder);
                break;
              }
              //// 若流程已结束，直接退出循环
              //if (state.payend === true) break;
              // if(payorder && payorder != null){
              //     await onPayoff(payorder);
              // }
              // if(payorder === undefined){
              //     state.payend = true;
              // }
              // 每次查询间隔半秒，避免高频请求
              await new Promise((resolve) => setTimeout(resolve, 500));
            } while ((payorder === null || payorder === undefined) && state.payend === false);
            //}
          } else {
            Close();
          }
        }
      };
      const onPaying = async function (type: string): Promise<any> {
        var result = await callpayapi(
          type === 'wechat'
            ? PayModeEnum.WECHAT
            : type === 'alipay'
            ? PayModeEnum.ALIPAY
            : PayModeEnum.UNIONPAY,
          PayMethodEnum.QueryOrder,
          {
            thirdOrderno: props.hisOrder.thirdOrderno,
            payOrder: state.payOrder,
          }
        );

        console.log(JSON.stringify(result));
        if (result && result.tradestate === 'SUCCESS') {
          return result;
        } else {
          return null;
        }
      };

      const onPayoff = async function (payorder: any) {
        if (state.payend === true) return null; // 正再取消，或者提交状态尚未完成，拦截二次调用

        if (payorder.paymode === 'credit') {
          ///信用支付
          state.payInfo = payorder;
          state.payend = true;
        } else {
          //支付方式 仅代表用户所选择的方式 并非真实的支付方式.如果需要修改  则在服务端处理,此处无需考虑;
          payorder.paymode = active.value;
          state.payInfo = payorder;
        }
        console.log(JSON.stringify(state.payInfo));
        console.log('支付成功,即将切换路由');
        state.payend = true;
        //  if (state.payend === true) {
        ctx.emit('onPayend', state.payInfo);
        // } else {
        //   state.payend = true;
        // }
      };

      const onCancel = async function () {
        if (!active || active.value === '') {
          ctx.emit('onCancel'); //支付方式未选择
        } else {
          if (state.payend === true) {
            return null; //正在取消支付 或者 已经支付成功正在提交状态
          } else {
            try {
              //用户选择取消支付
              var canceler = await callpayapi(
                active.value === 'wechat'
                  ? PayModeEnum.WECHAT
                  : active.value === 'alipay'
                  ? PayModeEnum.ALIPAY
                  : PayModeEnum.UNIONPAY,
                PayMethodEnum.CloseOrder,
                {
                  thirdOrderno: props.hisOrder.thirdOrderno,
                }
              );
              state.payend = true;
            } catch (error) {
            } finally {
              ctx.emit('onCancel');
            }
          }
        }
      };
      return {
        ...toRefs(state),
        active,
        onUnionPay,
        onWechat,
        onAlipay,
        onCreditPay,
        onCancel,
        onPayask,
        onPaying,
        onPayoff,
      };
    },
  });
</script>

<style lang="less" scoped>
  .payoff__btn-border {
    //border: red 1px solid;
    margin-right: 0.2rem;
  }

  .content__pack__context {
    height: ~'calc(100% - 0.8rem)';
    width: 100%;
  }

  .content__pack__context-title {
    height: 1rem;
    width: 100%;
    vertical-align: middle;
    text-align: center;
  }

  .payoff__pack {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .payoff_lock {
    filter: progid:DXImageTransform.Microsoft.BasicImage(graysale=1);
    -webkit-filter: grayscale(100%);
  }
</style>
