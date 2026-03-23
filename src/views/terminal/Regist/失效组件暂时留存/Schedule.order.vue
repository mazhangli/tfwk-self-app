<template>
<div class="content flex-c">
    <div class="content__pack flex-r">
        <!-- 科室表 -->
        <div v-if="step === 0" class="content__fit flex-r">
            <div class="screen">
                <picker-pack :finished="false">
                    <van-cell v-for="(item, index) in filter" :key="index" :value="item" :center="true" :clickable="true" :inset="true" :class="is('filter', index) ? ['cell__active'] : ['cell__unactive']" @click="onScreen(index, item)" />
                </picker-pack>
            </div>
            <div class="branch">
                <picker-pack :finished="true">
                    <van-grid :column-num="3" :center="false" :gutter="10">
                        <van-grid-item v-for="(item, index) in branch" :key="index" direction="horizontal" :clickable="true" @click="onNext(index, item)">
                            <van-cell :center="true" :clickable="true" :inset="true" :class="
                    is('branch', index) ? ['cell__active', 'flex-r'] : ['cell__unactive', 'flex-r']
                  ">
                                <template #title>
                                    <div class="flex-r">
                                        <van-image :src="index === active2 ? icon3 : icon1" height="1rem" width="1rem" style="padding: 0.2rem" />
                                        <p class="van-multi-ellipsis--l2" style="line-height: 0.5rem; width: 2rem">{{
                        item.branchName
                      }}</p>
                                    </div>
                                </template>
                            </van-cell>
                        </van-grid-item>
                    </van-grid>
                </picker-pack>
            </div>
        </div>
        <!-- 号源表 -->
        <div v-if="step === 1" class="content__fit flex-r-2">
            <div class="calendar">
                <calendar :dateRange="days" @onChange="onSelectDate" />
            </div>

            <div class="max">
                <picker-pack :finished="true">
                    <van-cell class="schedule-cell" v-for="(item, index) in schedule" :key="index" :center="true">
                        <template #default>
                            <div class="flex-r-2 schedule-context">
                                <div class="doctor" style="widht: 50%">
                                    <span class="schedule blod font">{{ item.doctorName }}</span>
                                    <span class="schedule positionname font">{{ item.positionName }}</span>
                                </div>
                                <div class="timeflag">
                                    <span class="schedule blod font">{{ item.timeFlag }}</span>
                                </div>
                                <div class="cost">
                                    <span class="schedule blod font money">¥{{ item.registCost }}</span>
                                </div>
                            </div>
                        </template>

                        <template #right-icon style="width: 1.5rem">
                            <van-button name="confirm" type="success" class="toregist" v-preventReClick="2000" @click="onRegist(item)">挂号</van-button>
                        </template>
                    </van-cell>
                </picker-pack>
            </div>
        </div>
    </div>
    <div class="content__foot flex-r-3">
        <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" icon="replay" icon-position="left" @click="onRefresh">刷&nbsp;&nbsp;&nbsp;&nbsp;新
        </van-button>
        <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" icon="wap-home" icon-position="left" @click="onCancel">返回主页
        </van-button>
        <timer-button class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
    </div>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import PickerPack from '@/components/Picker/Picker.pack.vue';
import Calendar from '@/components/Calendar/Calendar.vue';
import { schedulingSchedule } from '@/trans/server/index';
import { Open, Close } from '@/utils/loading';
import { pushAppHome } from '@/router/router';
import moment from 'moment';
export default defineComponent({
    name: 'ScheduleOrder',
    props: {},
    emits: ['onRegist'], //回调函数
    components: { PickerPack, TimerButton, Calendar },
    setup(props, ctx) {
        const state = reactive({
            info: {} as any,
            step: 0,
            active1: 0,
            active2: -1,
            icon1: null,
            icon2: null,
            icon3: null,
            branch: [] as any[],
            branchId: '',
        });

        onMounted(async () => {
            state.icon1 = require('@/assets/svg/branch.svg');
            state.icon2 = require('@/assets/svg/step.prev.svg');
            state.icon3 = require('@/assets/svg/branch.active.svg');
            onRefresh();
        });
        const onRefresh = async function () {
            Open('');
            state.step = 0;
            state.active1 = 0;
            state.active2 = -1;
            state.info = await schedulingSchedule('', '');
            state.branch = state.info.branch;
            Close();
        };
        const filter = computed(() => {
            if (state.info.branch) {
                var newarray = state.info.branch
                    .map((item: { branchSpell: any }) => item.branchSpell)
                    .filter(function (val: string) {
                        return val != '';
                    });
                newarray.sort();
                return ['全部', ...Array.from(new Set(newarray))];
            } else {
                return [];
            }
        });
        const days = computed(() => {
            if (state.info.days) {
                var newarray = state.info.days.map((item: { day: any }) => item.day);
                console.log(newarray);
                return newarray;
            } else {
                return [];
            }
        });
        const schedule = computed(() => {
            if (state.info.schedule) {
                return state.info.schedule;
            } else {
                return [];
            }
        });
        const is = function (type: any, index: any) {
            if (state.active1 === index && type === 'filter') {
                return true;
            } else if (state.active2 === index && type === 'branch') {
                return true;
            } else {
                return false;
            }
        };
        const onScreen = function (index: number, item: string) {
            state.active1 = index;
            if (index === 0) {
                state.branch = state.info.branch;
            } else {
                state.branch = state.info.branch.filter(function (val: any) {
                    return val.branchSpell === item;
                });
            }
        };
        const onSelectDate = async function (day: Date) {
            Open('');
            console.log(day.toLocaleDateString());
            state.info = await schedulingSchedule(state.branchId, moment(day).format('YYYY-MM-DD'));
            Close();
        };
        const onNext = async function (index: number, item: any) {
            Open('');
            state.active2 = index;
            state.branchId = item.branchCode;
            state.info = await schedulingSchedule(item.branchCode, '');
            state.step = 1;
            Close();
        };
        const onReturn = function () {
            onRefresh();
        };

        const onCancel = async function () {
            pushAppHome();
        };
        const onRegist = function (schedule: any) {
            if (schedule) {
                Open('');
                ctx.emit('onRegist', schedule);
            }
        };
        return {
            ...props,
            ...toRefs(state),
            is,
            onCancel,
            onRefresh,
            onScreen,
            onNext,
            onSelectDate,
            onReturn,
            onRegist,
            filter,
            days,
            schedule,
        };
    },
});
</script>

<style lang="less" scoped>
.margin {
    margin-right: 0.2rem;
}

.screen {
    flex-basis: 10%;
    height: 100%;
}

.branch {
    flex-basis: 90%;
    height: 100%;
}

.branch__item {
    width: ~'calc(100% - 0.8rem)';
    padding-left: 0.2rem;
    overflow: hidden;
}

.cell__active {
    color: #fff !important;
    background-color: #1989fa !important;
}

.cell__unactive {
    color: #333 !important;
    background-color: #fcfcfc !important;
}

.grid__active {
    color: #fff !important;
    background-color: #1989fa !important;
}

.grid__unactive {
    color: #333 !important;
    background-color: #fcfcfc !important;
}

.schedule-cell {
    // border-radius: 1em;
    background-color: rgba(#fff, 1);
    margin: 2px 0;
    -webkit-box-shadow: 0 0 20px rgba(#333, 0.3) inset;
    -moz-box-shadow: 0 0 20px rgba(#333, 0.3) inset;
    box-shadow: 0 0 20px rgba(#333, 0.3) inset;
    // border-top-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
}

.calendar {
    width: 7rem;
    height: 100%;
}

.max {
    width: ~'calc(100% - 7rem)';
    height: 100%;
}

.schedule {
    padding: 0 5px;
}

.schedule-context {
    width: 100%;

    .doctor {
        padding-left: 0.2rem;
        width: 55%;
    }

    .timeflag {
        width: 25%;
    }

    .cost {
        width: 20%;
    }

    .positionname {
        color: gray !important;
    }
}

.toregist {
    border-top-left-radius: 2em;
    border-bottom-left-radius: 2em;
    -webkit-box-shadow: 0 0 10px rgba(#333, 0.2);
    -moz-box-shadow: 0 0 10px rgba(#333, 0.2);
    box-shadow: 0 0 10px rgba(#333, 0.2);
}

/deep/ .van-empty__description {
    font-size: 0.34rem;
}

/deep/.van-cell__value--alone {
    color: inherit;
}

/deep/.van-cell {
    -webkit-box-shadow: 10px 10px 10px rgba(#333, 0.2);
    -moz-box-shadow: 10px 10px 10px rgba(#333, 0.2);
    box-shadow: 10px 10px 10px rgba(#333, 0.2);
}

/deep/.van-cell::after {
    border: none;
}

/deep/.van-cell__value {
    line-height: 0.8rem;
    height: 0.8rem;
}

/deep/.van-grid-item {
    padding: 0;
}

/deep/.van-grid-item__content {
    padding: 0;
}
</style>
