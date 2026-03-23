<template>
    <div class="content">
        <div class="content__pack">
            <!-- <scroll-pad> -->
            <picker-row :finished="true" lineHeight="1.3rem" v-if="hasInfo === true">
                <!-- <van-list finished-text="已经到底了哦~~" @onLoad="refresh" :finished="true" >
                <span> -->
                <!-- <van-cell v-for="(item,index) in adviceList" :key="index"> -->
                    <payment-prescription-cell v-for="(item,index) in adviceList" :key="index" :advice="item" @onebudget="onBudget$One" />
                <!-- </van-cell> -->
                <!-- </span>
            </van-list> -->

            </picker-row>
            <!-- </scroll-pad> -->
            <van-empty v-if="hasInfo === false" class="content" :image="require('@/assets/svg/empty.3.svg')" image-size="4rem" description="没有待缴费处方" />
        </div>
        <div class="content__foot flex-r-3">
            <van-button class="btn-size-small font-s btn__foot margin" type="primary" icon="replay" icon-position="left"
                @click="refresh">刷&nbsp;&nbsp;&nbsp;&nbsp;新
            </van-button>
            <van-button class="btn-size-small font-s btn__foot margin" type="primary" :icon="require('@/assets/svg/pay.svg')" icon-position="left"
                @click="onBudget">全部支付
            </van-button>
            <van-button class="btn-size-small font-s btn__foot margin" type="primary" icon="wap-home" icon-position="left"
                @click="onCancel">返回主页
            </van-button>
            <timer-button class="margin" :total="300" ref="RefItimer" size="1.1rem" :finish="onCancel" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, Ref, ref, toRefs } from 'vue';
import { serverPaylist, serverPayview } from '@/trans/server/index';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { appRouteEnum, pushAppHome, pushRouteWithoutParam } from '@/router/router';
import PickerRow from '@/components/Picker/Picker.Row.vue';
import ScrollPad from '@/components/Form/ScrollPad.vue';
import paymentPrescriptionCell from '@/views/terminal/Payment/Prescription/Prescription.Cell.vue';
import { Close, Open } from '@/utils/loading';
import { Toast } from 'vant';
export default defineComponent({
    name: 'PaymentPrescription',
    props: {},
    emits: ['budget'],
    components: { TimerButton, paymentPrescriptionCell, PickerRow },
    setup(props, ctx) {
        let state = reactive({
            hasInfo: null as any,
            expands: 0,
            adviceList: [] as any[],
            emptyimg: null,
            payicon: null,
            currentPage: 0,
            indexList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            active: 0,
        });
        const onCancel = function () {
            pushAppHome();
        };
        const selection = function (row: any, index: any, e: any) {
            state.expands = row.adviceid;
        };
        onMounted(() => {
            state.emptyimg = require('@/assets/svg/empty.3.svg');
            state.payicon = require('@/assets/svg/pay.svg');
            refresh();
        });
        const refresh = async function () {
            Open('');
            state.active = 0;
            state.hasInfo = null;
            state.adviceList = await serverPaylist();
            if (state.adviceList && state.adviceList.length > 0) {
                state.hasInfo = true;
            } else {
                state.hasInfo = false;
            }
            Close();
        };
        const onSuspended = function () {
            state.adviceList.forEach(advi => {
                if (advi.suspended && advi.suspended != 'false') {
                    Toast({
                        message: advi.suspendedReason,
                        className: 'mat_vant__toast',
                    });
                    Close();
                    return;
                }
            });
        };
        const onBudget = function () {
            if (state.hasInfo === true) {
                Open();
                onSuspended();
                ctx.emit('budget', state.adviceList.map(item => item.adviceid));
            }
        };
        const onBudget$One = function (advice: Array<string>) {
            onSuspended();
            ctx.emit('budget', advice);
        };
        return { ...props, onCancel, refresh, ...toRefs(state), onSuspended, onBudget, onBudget$One };
    },
});
</script>

<style lang="less" scoped>
.prescription {
    width: 100%;
    height: 100%;
    //padding: 2% 0 2% 0;

    &-foot {
        align-items: center;
        height: 1.4rem;
    }

    &-empty {
        width: 100%;
        height: 100%;
    }
}

.prescription-pad {
    position: relative;
    height: ~'calc(100% - 1.5rem)';
    width: 100%;
    //padding-top: 0.2rem;
    //padding-bottom: 0.2rem;
    //margin-bottom: 0.2rem;
    //overflow-y: auto;
    //-webkit-overflow-scrolling: touch;
    // box-shadow: 0 0 0 palegoldenrod, 0 0 0 palegreen, 0 -50px 60px paleturquoise inset,
    //   0 0 0 peachpuff;
}

.margin {
    margin-left: 0.2rem;
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 1.5rem;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 45%;
}

/deep/ .van-empty__description {
    font-size: 0.34rem;
}


// /deep/.van-cell {
//     background-color: transparent;
//     font-size: 0.33rem;
//     padding: 0;
//     line-height: 1.3rem;
//     height: 1.3rem;
// }

/deep/ .van-list__finished-text {
    font-size: 0.3rem !important;
    line-height: 1.2rem;
}
</style>
