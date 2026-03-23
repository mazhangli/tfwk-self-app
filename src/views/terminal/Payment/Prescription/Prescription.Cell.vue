<template>
    <div class="prescriptionCell flexbox flexbox-row flexbox-center"
        :style="{ 'justify-content': 'space-between', 'flex-wrap': 'nowrap' }">
        <van-card style="width: 100%;background: #fff;margin-bottom: 3px;border-radius: 0.5em;">
            <template #thumb>
                <van-image v-if="info.advicetype === '药品'" :src="require('@/assets/svg/medicine.svg')" />
                <van-image v-if="info.advicetype === '诊疗'" :src="require('@/assets/svg/treatment.svg')" />
                <div style="width: 100%;text-align: center;">
                    {{info.advicetype === '药品'?"药品处方":"诊疗申请"}}
                </div>
            </template>
            <template #title>
                <div class="flex direction_row wrap_no justify_between" style="line-height:  0.5rem;height:  0.5rem">
                    <span style="font-weight: bloder;">处方流水:{{ info.adviceid }}</span>
                    <span>{{ info.moment }}</span>
                </div>
            </template>
            <template #desc>
                <div class="flex direction_row wrap_no justify_between" style="line-height:  0.8rem;height:  0.8rem">
                    <span style="font-weight: blod;">
                        {{ info.branchname }}
                    </span>
                    <span>
                        <span style="font-weight: blod;">{{ info.doctorname }}</span> <span style="color:#969799">{{
                                info.doctortitle
                        }}</span>
                    </span>
                </div>
            </template>
            <template #price>
                <div class="flex direction_row wrap_no justify_between" style="line-height: 0.8rem;height: 0.8rem">
                    <span class="money">
                        ¥ {{ info.sumcost }}
                    </span>
                </div>
            </template>
            <template #footer>
                <van-button plain round class="font-s margin" type="primary" :icon="require('@/assets/svg/detail.svg')"
                    icon-position="left" height="0.9rem" @click="selection">详 情 </van-button>
            </template>
        </van-card>
        <!-- <span class="flex-r">
            <van-image width="0.5rem" height="0.8rem" :src="icon" class="icon" />&nbsp;&nbsp;
            <p class="item van-ellipsis">{{ info.moment }}</p>
        </span>
        <p class="item van-ellipsis">{{ info.advicetype }}</p>
        <p class="item van-ellipsis">{{ info.branchname }}</p>
        <span class="flex-r">
            <p class="item van-ellipsis">{{ info.doctorname }}</p>&nbsp;&nbsp;&nbsp;&nbsp;
            <p class="item van-ellipsis font-s" :style="{ color: '#969799' }"> {{ info.doctortitle }}</p>
        </span>
        <p class="item van-ellipsis blod" :style="{ color: 'red', 'font-size': '0.32rem' }">¥{{ info.sumcost }}</p>
        <span class="flex-r">
            <van-button plain round class="font-s margin" type="primary" :icon="icon2" icon-position="left"
                height="0.9rem" @click="selection">详 情 </van-button>&nbsp;
            <van-button plain round class="font-s margin" type="primary" :icon="payicon" icon-position="left"
                height="0.9rem" @click="onBudget(info.adviceid)">支 付
            </van-button>
        </span> -->
    </div>
    <van-dialog v-model:show="show" theme="round-button" :closeOnClickOverlay="true" width="50vw"
        overlayClass="van-overlay-white">
        <div class="dialog" style="padding-left: 0.5rem">
            <van-list finished-text="已经到底了哦~~" :finished="true" >
                <van-cell v-for="(item, index) in view" :key="index" center :title="item.itemname"
                    :label="item.itemspec" :value="'¥' + item.sumcost" value-class="money"
                    :title-class="{ 'line-height': '0.3rem' }" :icon="require('@/assets/svg/item.svg')" style="width: 100%;" />
            </van-list>
        </div>
    </van-dialog>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted, reactive, Ref, ref, toRefs } from 'vue';
import moment from 'moment';
import { serverPayview } from '@/trans/server';
import { Close, Open } from '@/utils/loading';

export default defineComponent({
    name: 'PaymentPrescriptionCell',
    props: {
        advice: null as any,
    },
    components: {},
    emits: ['onebudget'],
    setup(props, ctx) {
        let state = reactive({
            info: null as any,
            payicon: null,
            show: false,
            icon: null,
            view: [] as any[],
        });
        onBeforeMount(() => {
            state.info = props.advice;
            console.log(state.info);
            state.info.moment = getLastTime(props.advice.thedate);
            state.icon = require('@/assets/svg/icon-prescription.svg');
            state.payicon = require('@/assets/svg/pay.small.svg');
        });
        const getLastTime = function (targetTime: moment.MomentInput) {
            var result = '';
            targetTime = targetTime;
            // 今天开始时间
            var today = moment().format('YYYY-MM-DD');
            // 昨天开始时间
            var yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            // 目标日期
            var targetDate = moment(targetTime).format('YYYY-MM-DD');

            // 目标日期与当前日期是否同一天
            var isToday = moment(targetDate).isSame(today, 'day');
            // 目标日期是否是昨天日期
            var isYesterday = moment(targetDate).isSame(yesterday, 'day');
            if (isToday) {
                result = '今天 ' + moment(targetTime).format('HH:mm');
            } else if (isYesterday) {
                result = '昨天 ' + moment(targetTime).format('HH:mm');
            } else {
                result = moment(targetTime).fromNow();
            }
            return result;
        };

        const selection = async function () {
            if (state.info && state.info.adviceid) {
                Open('');
                state.view = await serverPayview(state.info.adviceid);
                Close();
                state.show = true;
            }
        };

        const onBudget = function (advice: string) {
            ctx.emit('onebudget', [advice]);
        };

        return { ...props, selection, ...toRefs(state), getLastTime, onBudget };
    },
});
</script>

<style lang="less" scoped>
.prescriptionCell {
    width: 100%;
    padding: 0 1% 0 1%;
    display: inline-flex;
    vertical-align: middle;
    height: fit-content;

    //border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    .icon {
        width: 0.5rem;
    }

    .item {
        //padding-right: 0.2rem;
        width: fit-content;
        display: inline;
        // align-self: baseline;
    }

    .view {
        //color: #3a97f7;
        text-decoration: blink;
    }
}

.dialog {
    overflow-y: scroll;
    // -webkit-overflow-scrolling: touch;
    // padding-top: 3%;
    // padding-bottom: 3%;
    width: 100% !important;
    height: 100% !important;
}

/deep/.van-cell {
    background-color: transparent;
    font-size: 0.33rem;
    padding: 0;
    line-height: 1rem;
}

/deep/.van-card__title {
    font-weight: bloder;
}
</style>
