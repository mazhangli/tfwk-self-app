<template>
  <patient-container>
    <template v-slot:default>
      <payment-prescription ref="advicepad" @budget="onBudget" v-if="active === 0" />
      <payoff
        :hisOrder="hisOrder"
        :amount="hisOrder.payCost"
        :lock="false"
        @onCancel="userCancel"
        @onPayend="onCommit"
        v-if="active === 1"
      ></payoff>
      <complete
        :type="isSuccess === true ? 'success' : 'faild'"
        :description="
          isSuccess === true
            ? ['请取走交易凭证,就诊期间妥善留存', '请取走您的卡片']
            : ['交易失败,如已付款,资金将在0-3个工作日内原路退回']
        "
        @CallBack="onRestar"
        v-if="active === 2"
      />
    </template>
    <template v-slot:stepper>
      <mat-steps :active="active" :steps="steps" />
    </template>
  </patient-container>
  <van-dialog
    v-model:show="userCon"
    theme="round-button"
    title="请核对确认信息"
    showCancelButton
    width="7rem"
    confirmButtonColor="linear-gradient(to right,#1989fa,#63AEF9)"
    cancelButtonColor="linear-gradient(to right,#9CC3F3,#85B0E4)"
    overlayClass="van-overlay-white"
    @confirm="userConfirm"
    @cancel="userCancel"
  >
    <payment-info ref="PaymentDialog" :info="hisOrder" v-if="hisOrder != null" />
  </van-dialog>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import PatientContainer from '@/views/terminal/Container/PatientContainer.vue';
  import PaymentPrescription from './Prescription/Prescription.vue';
  import PaymentInfo from './Payment.info.vue';
  import Payoff from '@/views/terminal/Interface/Payoff/Payoff.vue';
  import Complete from '@/views/terminal/Interface/Complete.vue';
  import MatSteps from '@/components/Steps/MatSteps.vue';
  import { Close, Open } from '@/utils/loading';
  import { paymentCancel, paymentCommit, paymentDivde } from '@/trans';
  import { print } from '@/trans/driver/src/thermal';
  import { encode } from 'js-base64';
  export default defineComponent({
    name: 'Payment',
    props: {},
    components: {
      PatientContainer,
      PaymentPrescription,
      PaymentInfo,
      Payoff,
      Complete,
      // AppStepper,
      MatSteps,
    },
    setup() {
      const steps = [
        { id: 1, name: '待缴费处方信息', description: '可查看详情' },
        { id: 2, name: '自付金额支付', description: '线上支付' },
        { id: 3, name: '缴费结束', description: '交易完成' },
      ];
      const state = reactive({
        active: 0,
        hisOrder: null as any,
        payOrder: null as any,
        isSuccess: false,
        trading: false,
        canceling: false,
      });
      const userCon = ref(false);
      const PaymentDialog = ref();
      const advicepad = ref();
      const onBudget = async function (prescribe: string[]) {
        Open();
        console.dir(prescribe);
        state.isSuccess = false;
        state.trading = false;
        state.canceling = false;
        if (state.hisOrder) {
        } else {
          state.hisOrder = await paymentDivde(prescribe);
        }
        if (state.hisOrder) {
          console.log('应该弹出提示窗口');
          userCon.value = true;
        }
        Close();
      };
      const onCancel = async function () {
        Open('');
        if (state.trading === true) {
          console.log('账单正在提交提交,不允许撤销交易');
        } else {
          state.canceling = true;
          await paymentCancel(state.hisOrder);
          state.hisOrder = null;
          state.payOrder = null;
        }
        Close();
      };
      const userConfirm = async function () {
        userCon.value = false;
        if (parseFloat(state.hisOrder.payCost) > 0) {
          // 用户确认后转入支付路由
          console.log('用户确认交易,即将进入支付路由');
          state.active = 1;
          state.canceling = false;
          state.trading = false;
        } else {
          Open('');
          await onCommit({});
        }
      };
      const userCancel = async function () {
        userCon.value = false;
        onRefresh();
        // 用户取消刷新数据
        console.log('用户未确认交易,交易即将回滚');
        await onCancel();
      };
      const onCommit = async function (payorder: any) {
        if (state.canceling === true) {
            console.log('账单正在撤销,不允许提交交易');
            state.canceling = false;
            Close(); //如果有遮罩需要关闭
            return;
        } else {
          state.payOrder = payorder;
          state.hisOrder.payinfo = state.payOrder;
          console.log('账单正在提交提交,此刻后禁止撤销交易');
          state.trading = true;
          let commitOrder = await paymentCommit(state.hisOrder);
          Close(); //如果有遮罩需要关闭
          if (commitOrder) {
            state.isSuccess = true;
            state.active = 2;
            await print({ context: encode(commitOrder.printContent) });
          } else {
            state.isSuccess = false;
            state.active = 2;
          }
        }
      };
      const onRefresh = function () {
        state.active = 0;
      };
      const onRestar = function () {
        state.hisOrder = null;
        state.payOrder = null;
        state.active = 0;
        state.trading = false;
        state.canceling = false;
      };
      return {
        ...toRefs(state),
        userCon,
        advicepad,
        PaymentDialog,
        steps,
        onBudget,
        onCancel,
        onCommit,
        userCancel,
        userConfirm,
        onRefresh,
        onRestar,
      };
    },
  });
</script>

<style lang="less" scoped></style>
