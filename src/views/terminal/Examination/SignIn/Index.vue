<template>
  <div class="content flex-c">
    <div class="content__foot flex-r-3">
      <div class="content__nav flex-r-s">
        <div class="flex-r">
          <van-icon name="contact" color="#1989fa" size="0.7rem" />
          <p class="font-l"> {{ patient.Name }}</p>
        </div>
        <div class="flex-r">
          <van-icon name="idcard" color="#1989fa" size="0.7rem" />
          <p class="font-l" :style="{ float: 'right' }"> 证件号:{{ patient.Code }}</p>
        </div>
      </div>
    </div>
    <div class="content__pack flex-center">
      <examination-order @budget="onBudget" @cancel="onNull" v-if="active === 0" />
      <payoff
        :hisOrder="hisOrder"
        :amount="hisOrder.personalFeeItemTotalCost"
        :lock="false"
        @onCancel="userCancel"
        @onPayend="onCommit"
        v-if="active === 1"
        :style="{ 'padding-top': '30%' }"
      ></payoff>
      <complete
        :type="isSuccess === true ? 'success' : 'faild'"
        :description="
          isSuccess === true
            ? ['请取走交易凭证,体检期间妥善留存', '正在打印体检项目条码,请耐心等待']
            : ['交易失败,如已付款,资金将在0-3个工作日内原路退回']
        "
        @CallBack="userCancel"
        v-if="active === 2"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { getStore } from '@/utils/cache/storage';
  import ExaminationOrder from './Order.vue';
  import Payoff from '@/views/terminal/Interface/Payoff/Payoff.vue';
  import { defineComponent, nextTick, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
  import { Close, Open } from '@/utils/loading';
  import { feeOrderPay, getBarCode } from '@/trans/server/his/examination';
  import Complete from '@/views/terminal/Interface/Complete.vue';
  import { speak } from '@/trans/driver/src/speech';
  import { htmlPrint, imagePrint } from '@/trans/driver/src/printer';
  export default defineComponent({
    name: 'ExaminationSignin',
    props: {},
    emits: [],
    components: { ExaminationOrder, Payoff, Complete },
    setup(props, ctx) {
      const state = reactive({
        active: 0,
        patient: null as any,
        hisOrder: null as any,
        isSuccess: false,
      });
      onBeforeMount(() => {
        state.patient = getStore('identity');
        console.log(state.patient);
      });
      onMounted(() => {});
      const onBudget = async function (hisOrder: any) {
        // hisOrder.personalFeeItemTotalCost = 10;
        state.hisOrder = hisOrder;
        console.log('amount', hisOrder.needFeeItemTotalCost);
        if (hisOrder.needFeeItemTotalCost > 0) {
          state.active = 1;
        } else {
          Open('正在通知体检中心数据中心,请稍后...');
          await onCommit(hisOrder);
          Close();
        }
      };
      const userCancel = function () {
        state.isSuccess = false;
        state.hisOrder = null;
        console.log('取消支付');
        state.isSuccess = false;
        state.active = 0;
      };
      const onCommit = async function (payInfo: any) {
        console.log('用户选支付成功', payInfo);
        Open('正在通知体检中心数据中心,请稍后...');
        var content = await feeOrderPay(
          state.hisOrder.needFeeItemTotalCost,
          state.hisOrder.tjId,
          state.hisOrder.thirdOrderno
        );
        Close();
        // if (content) {
        state.isSuccess = true;
        state.active = 2;
        await speak('正在打印体检项目条码,请耐心等待...');
        await onPrint();
        // } else {
        //   state.isSuccess = false;
        //   state.active = 2;
        // }
      };
      const onPrint = async function () {
        var data = await getBarCode(state.hisOrder.tjId);
        await imagePrint({ Images: data.Images, IsUrl: false, Printer: 'A' });
        await htmlPrint({ Images: [data.Url], IsUrl: true, Printer: 'B' });
      };
      const onNull = function () {
        state.isSuccess = false;
        state.active = 2;
      };
      return { ...toRefs(state), onBudget, userCancel, onCommit, onPrint, onNull };
    },
  });
</script>

<style lang="less" scoped></style>
