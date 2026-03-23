<template>
  <patient-container>
    <template v-slot:default>
      <schedule
        :type="registType"
        @budget="onBudget"
        v-if="active === 0 && registType != '预约取号'"
      />
      <reserved @budget="onBudget" v-if="active === 0 && registType === '预约取号'" />
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
    overlayClass="van-overlay-white"
    theme="round-button"
    title="请核对确认信息"
    showCancelButton
    width="8rem"
    confirmButtonColor="linear-gradient(to right,#1989fa,#63AEF9)"
    :overlay="true"
    cancelButtonColor="linear-gradient(to right,#9CC3F3,#85B0E4)"
    @confirm="userConfirm"
    @cancel="userCancel"
  >
    <regist-info
      ref="RegistDialog"
      :registType="registType"
      :info="hisOrder"
      v-if="hisOrder != null"
    />
  </van-dialog>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
  import PatientContainer from '@/views/terminal/Container/PatientContainer.vue';
  import Schedule from '@/views/terminal/Regist/Schedule/Schedule.vue';
  import Reserved from '@/views/terminal/Regist/Register.Reserved.vue';
  import Payoff from '@/views/terminal/Interface/Payoff/Payoff.vue';
  import Complete from '@/views/terminal/Interface/Complete.vue';
  import MatSteps from '@/components/Steps/MatSteps.vue';
  import RegistInfo from '@/views/terminal/Regist/Register.info.vue';
  import { Close, Open } from '@/utils/loading';
  import { registCancel, registCommit, registDivde } from '@/trans';
  import { useRoute } from 'vue-router';
  import { encode } from 'js-base64';
  import { getStore } from '@/utils/cache/storage';
  import { regist$schedule } from '@/trans/server/his/register';
  import { pushRouteWithoutParam, appRouteEnum, pushRouteWithParam } from '@/router/router';
  import { print } from '@/trans/driver/src/thermal';
  export default defineComponent({
    name: 'Register',
    props: {},
    components: { PatientContainer, MatSteps, Payoff, Complete, Schedule, RegistInfo, Reserved },
    setup(props) {
      const state = reactive({
        steps: [
          { id: 0, name: '选择号源', remark: '' },
          { id: 1, name: '费用分解', remark: '' },
          { id: 2, name: '打印凭据', remark: '' },
        ],
        registType: '预约取号',
        schedule: null as any,
        active: 0,
        userCon: false,
        hisOrder: null as any,
        payOrder: null as any,
        isSuccess: false,
        trading: false,
        canceling: false,
        first: true,
      });
      onBeforeMount(() => {
        /*路由*/
        const route = useRoute();
        state.registType = route.query.registType as string;
        if (!state.registType) state.registType = '预约取号';
        console.log(state.registType);
        switch (state.registType) {
          case '预约挂号':
            state.steps = [
              { id: 0, name: '选择号源', remark: '' },
              { id: 1, name: '打印凭据', remark: '' },
            ];
            break;
          case '当日挂号':
            state.steps = [
              { id: 0, name: '选择号源', remark: '' },
              { id: 1, name: '费用分解', remark: '' },
              { id: 2, name: '打印凭据', remark: '' },
            ];
            break;
          case '预约取号':
            state.steps = [
              { id: 0, name: '选择预约记录', remark: '' },
              { id: 1, name: '费用分解', remark: '' },
              { id: 2, name: '打印凭据', remark: '' },
            ];
            break;
        }
      });
      onMounted(() => {
        if (getStore('history').isHasSurvey === false) {
          Survey();
        }
      });
      const Survey = async function () {
        /*路由*/
        const route = useRoute();
        await pushRouteWithParam(appRouteEnum.Survey, route.query);
      };
      const onBudget = async function (schedule: any, scheduleOrderno = 0) {
        Open('');        
        if (state.registType === '预约取号') {
          if (scheduleOrderno > 0) {
            state.hisOrder = await registDivde('', scheduleOrderno);
            if (!state.hisOrder) await onCancel();
          }
        } else {
          if (schedule) {
            state.schedule = schedule;
            if (state.registType === '预约挂号') {
              var patient = getStore('history');
              //historyId patientName branchName doctorName registDate allCost pubCost disCost payCost
              state.hisOrder = {
                historyId: patient.historyid,
                patientName: patient.patname,
                branchName: schedule.branchName,
                doctorName: schedule.doctorName,
                registDate: schedule.dayString,
                allCost: schedule.registCost,
                pubCost: '取号时再行分解',
                disCost: '取号时再行分解',
                payCost: '取号时再行分解',
              };
            } else {
              state.hisOrder = await registDivde(schedule.id);
              if (!state.hisOrder) await onCancel();
            }
          }
        }
        if (state.hisOrder) {
          state.userCon = true;
          state.first = false;
        }
        Close();
      };
      const onCancel = async function () {
        Open('');
        if (state.trading === true) {
          console.log('账单正在提交提交,不允许撤销交易');
        } else {
          state.canceling = true;
          await registCancel(state.hisOrder);
          state.hisOrder = null;
          state.payOrder = null;
        }
        Close();
      };
      const userConfirm = async function () {
        state.userCon = false;
        //state.hisOrder.payCost = 0.1;
        var patient = getStore('history');
        if (parseFloat(state.hisOrder.payCost) > 0) {
          // 用户确认后转入支付路由
          console.log('用户确认交易,即将进入支付路由');
          state.active = 1;
          state.canceling = false;
          state.trading = false;
          Close();
        } else {
          Open('');
          await onCommit({});
        }
      };
      const userCancel = async function () {
        state.userCon = false;
        Open('交易正在取消,请稍等.....');
        // 用户取消刷新数据
        console.log('用户未确认交易,交易即将回滚');
        if (state.registType != '预约挂号') {
          try{
            await onCancel();
          }catch(e){
            console.log('取消交易出现异常,忽略此异常继续执行');
          }finally{
            onRefresh();
          }
        }        
        Close();
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
          let commitOrder = null;
          if (state.registType != '预约挂号') {
            commitOrder = await registCommit(state.hisOrder);
          } else {
            commitOrder = await regist$schedule(state.schedule.id);
          }
          console.dir(commitOrder);
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
        state.trading = false;
        state.canceling = false;
        state.isSuccess = false;
        state.first = false;
      };
      const onRestar = function () {
        state.hisOrder = null;
        state.payOrder = null;
        state.active = 0;
        state.trading = false;
        state.canceling = false;
      };
      return { ...toRefs(state), onBudget, onCommit, userCancel, userConfirm, onRestar, onRefresh };
    },
  });
</script>

<style lang="less" scoped></style>
