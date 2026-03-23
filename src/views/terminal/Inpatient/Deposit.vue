<template>
    <patient-container type="zy">
        <template v-slot:default>
            <DepositAmount @confirm="onBudget" v-if="(active === 0)" />
            <payoff :hisOrder="hisOrder" :amount="hisOrder.payCost" :lock="false" @onCancel="userCancel"
                @onPayend="onCommit" v-if="active === 1"></payoff>
            <complete :type="isSuccess === true ? 'success' : 'faild'" :description="
                isSuccess === true
                    ? ['请取走交易凭证,就诊期间妥善留存', '请取走您的卡片']
                    : ['交易失败,如已付款,资金将在0-3个工作日内原路退回']
            " @CallBack="onRestar" v-if="active === 2" />
        </template>
        <template v-slot:stepper>
            <mat-steps :active="active" :steps="steps" />
        </template>
    </patient-container>
    <van-dialog v-model:show="userCon" overlayClass="van-overlay-white" theme="round-button" title="请核对确认信息"
        showCancelButton width="7rem" confirmButtonColor="linear-gradient(to right,#1989fa,#63AEF9)"
        cancelButtonColor="linear-gradient(to right,#9CC3F3,#85B0E4)" @confirm="userConfirm" @cancel="userCancel">
        <deposit-info ref="RegistDialog" :info="hisOrder" v-if="hisOrder != null" />
    </van-dialog>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import PatientContainer from '@/views/terminal/Container/PatientContainer.vue';
import Payoff from '@/views/terminal/Interface/Payoff/Payoff.vue';
import Complete from '@/views/terminal/Interface/Complete.vue';
import MatSteps from '@/components/Steps/MatSteps.vue';
import { Close, Open } from '@/utils/loading';
import DepositAmount from './Deposit.Amount.vue';
import { useRoute } from 'vue-router';
import { encode } from 'js-base64';
import { getStore } from '@/utils/cache/storage';
import DepositInfo from './Deposit.Info.vue';
import { deposit$budget, deposit$cancel, deposit$commit } from '@/trans/server/his/inhospital';
import { pushRouteWithoutParam, appRouteEnum, pushRouteWithParam } from '@/router/router';
import { print } from '@/trans/driver/src/thermal';
export default defineComponent({
    name: 'Deposit',
    props: { },
    components: { PatientContainer, DepositAmount, DepositInfo, MatSteps, Payoff, Complete },
    setup(props) { 
        const state = reactive({
            steps: [
                { id: 0, name: '应交金额', remark: '' },
                { id: 1, name: '完成支付', remark: '' },
                { id: 2, name: '打印凭据', remark: '' },
            ],
            active: 0,
            userCon: false,
            hisOrder: null as any,
            payOrder: null as any,
            isSuccess: false,
        });
        onBeforeMount(() => {

        });
        onMounted(() => {

        });

        const onBudget = async function (amount: number) {
            if (amount <= 0) return;
            state.hisOrder = await deposit$budget(amount);
            if (!state.hisOrder) await onCancel();
            if (state.hisOrder)
                state.userCon = true;
        };
        const onCancel = async function () {
            Open('');
            await deposit$cancel(state.hisOrder);
            state.hisOrder = null;
            state.payOrder = null;
            Close();
        };
        const userConfirm = async function () {
            state.userCon = false;
            if (parseFloat(state.hisOrder.payCost) > 0) {
                // 用户确认后转入支付路由
                console.log('用户确认交易,即将进入支付路由');
                state.active = 1;
            } else {
                await onCommit({});
            }
        };
        const userCancel = async function () {
            await onCancel();
            state.userCon = false;
            onRefresh();
            // 用户取消刷新数据
            console.log('用户未确认交易,交易即将回滚');

        };
        const onCommit = async function (payorder: any) {
            state.payOrder = payorder;
            state.hisOrder.payinfo = state.payOrder;
            let commitOrder = null as any;

            commitOrder = await deposit$commit(state.hisOrder);

            console.dir(commitOrder);
            if (commitOrder) {
                state.isSuccess = true;
                state.active = 2;
                await print({ context: encode(commitOrder.printContent) });
            } else {
                state.isSuccess = false;
                state.active = 2;
            }
        };
        const onRefresh = function () {
            state.active = 0;
        };
        const onRestar = function () {
            state.hisOrder = null;
            state.payOrder = null;
            state.active = 0;
        };
        return { ...toRefs(state), onBudget, onCommit, userCancel, userConfirm, onRestar, onRefresh };
    },
});
</script>

<style lang="less" scoped>

</style>
