<template>
  <div class="content">
    <div class="content__pack flex-r" v-show="empty === false">
      <div class="schedule__filter">
        <picker-row :list="filters" @select="onFilter" lineHeight="1.3rem" />
      </div>
      <div class="schedule__branch">
        <picker-row :finished="true" lineHeight="1.3rem">
          <van-cell
            v-for="(item, index) in branchs"
            :key="index"
            @click="onBranch(index, item)"
            :class="bactive === index ? ['cell__active'] : ['cell__inactive']"
          >
            <template #title>
              <div class="content flex-r">
                <van-image
                  :src="bicon"
                  width="0.6rem"
                  height="0.6rem"
                  :style="{ 'margin-right': '0.2rem' }"
                />
                <span
                  class="van-multi-ellipsis--l2"
                  :style="{ lineHeight: '0.5rem', fontWeight: 'bold' }"
                  >{{ item.branchName }}</span
                >
              </div>
            </template>
          </van-cell>
        </picker-row>
      </div>
      <div class="schedule__info flex-c">
        <div class="schedule__days" v-show="type === '预约挂号'">
          <picker-column :locked="true">
            <div class="flex-r">
              <div v-for="(item, index) in days" :key="index" style="width: 2rem; height: 1.3rem">
                <van-cell @click="onDay(index, item)" :center="true">
                  <template #title>
                    <div
                      :style="{ width: '1.6rem', height: '1.3rem', 'text-align': 'center' }"
                      :class="
                        dactive === index
                          ? ['day__active', 'flex-c']
                          : ['day__inactive', 'flex-c-c']
                      "
                    >
                      <p class="van-multi-ellipsis bloder">{{ getweek(item) }}</p>
                      <p class="van-multi-ellipsis">{{ formatday(item) }}</p>
                    </div>
                  </template>
                </van-cell>
              </div>
            </div>
          </picker-column>
        </div>
        <div
          :class="
            type === '预约挂号'
              ? ['schedule__schedling', 'flex-c']
              : ['schedule__schedling__full', 'flex-c']
          "
        >
          <picker-row :finished="true" lineHeight="1.3rem">
            <van-cell
              v-for="(item, index) in schedules"
              :key="index"
              :center="true"
              class="schedule_cell_bg"
            >
              <template #default>
                <div class="flex-r-3 schedule-context">
                  <van-image :src="doctor" width="0.7rem" height="0.7rem" />
                  <div class="flex-r-3 schedule-context-info">
                    <div class="doctor" style="width: 45%">
                      <span class="schedule van-ellipsis blod font">{{ item.doctorName }}</span>
                      <span class="schedule van-ellipsis positionname font">{{
                        item.positionName
                      }}</span>
                    </div>
                    <div class="timeflag">
                      <span class="schedule van-ellipsis blod font">{{ item.timeFlag }}</span>
                    </div>
                    <div class="cost flex-r-c">
                      <span class="schedule van-ellipsis blod font money"
                        >¥{{ item.registCost }}</span
                      >
                    </div>
                  </div>
                </div>
              </template>
              <template #right-icon style="width: 1.5rem">
                <van-button
                  name="confirm"
                  type="success"
                  class="toregist"
                  v-preventReClick="2000"
                  loading-type="spinner"
                  :loading="isLoading"
                  @click="onRegist(item)"
                  >挂号</van-button
                >
              </template>
            </van-cell>
          </picker-row>
        </div>
      </div>
    </div>
    <van-empty
      v-if="empty === true"
      class="content__pack"
      :image="emptyimg"
      image-size="4rem"
      description="没有出诊排班信息,或查询失败,可尝试[刷新]"
    />
    <div class="content__foot flex-r-3">
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="replay"
        icon-position="left"
        @click="onRefresh"
        >刷&nbsp;&nbsp;&nbsp;&nbsp;新
      </van-button>
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="wap-home"
        icon-position="left"
        @click="onCancel"
        >返回主页
      </van-button>
      <timer-button :total="300" class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
  import PickerRow from '@/components/Picker/Picker.Row.vue';
  import PickerColumn from '@/components/Picker/Picker.Column.vue';
  import ScheduleBranch from './Schedule.Branch.vue';
  import { schedulingSchedule, schedulingToday } from '@/trans/server';
  import { Close, Open } from '@/utils/loading';
  import moment from '@/utils/moment';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { oneOf } from 'vue-types';
  import { pushAppHome } from '@/router/router';
  import { Dialog } from 'vant';
  import { getStore } from '@/utils/cache/storage';

  export default defineComponent({
    name: 'Schedule',
    props: {
      type: oneOf(['预约挂号', '当日挂号']),
    },
    emits: ['budget'],
    components: { PickerRow, PickerColumn, TimerButton, ScheduleBranch },
    setup(props, ctx) {
      const state = reactive({
        info: {} as any,
        empty: false,
        filters: [] as any[],
        thefilter: '',
        branchs: [] as any[],
        thebranch: null as any,
        days: [] as any[],
        theday: null as any,
        schedules: [] as any[],
        theschedule: null as any,

        doctor: null as any,
        emptyimg: null as any,
        bicon: null as any,
        min: null as any,
        bactive: 0,
        dactive: 0,
        isLoading: true,
      });

      onMounted(() => {
        state.doctor = require('@/assets/svg/doctor.svg');
        state.emptyimg = require('@/assets/svg/empty.3.svg');
        state.bicon = require('@/assets/svg/branch.svg');
        onRefresh();
      });
      const onRefresh = async function () {
        Open('');
        console.log(props.type);
        if (props.type === '当日挂号') {
          state.info = await schedulingToday('', '');
        } else {
          state.info = await schedulingSchedule('', '');
        }
        if (!state.info) {
          state.empty = true;
        } else {
          state.empty = false;
          state.thefilter = '';
          state.bactive = 0;
          state.dactive = 0;
          state.filters = computfilter();
          state.branchs = computbranch();
          state.days = computday();
          state.thebranch = state.branchs[0] || {};
          state.theday = state.days[0] || {};
          state.theschedule = null;
          onFilter(0, state.thefilter);
        }
        console.log(state.empty);
        Close();
      };
      const computfilter = function () {
        if (state.info && state.info.branch) {
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
      };
      const computbranch = function () {
        if (state.info && state.info.branch) {
          var newarray;
          if (state.thefilter) {
            newarray = state.info.branch.filter(function (val: any) {
              return val.branchSpell === state.thefilter;
            });
          } else {
            newarray = state.info.branch;
          }
          return newarray;
        } else {
          return [];
        }
      };
      const computday = function () {
        if (state.info && state.info.days) {
          var newarray = state.info.days.map((item: { dayString: any }) => item.dayString);
          return newarray;
        } else {
          return [];
        }
      };
      const onFilter = function (index: number, item: string) {
        state.isLoading = true;
        if (!item || item === '全部') state.thefilter = '';
        else state.thefilter = item;
        console.log('患者选择科室简码' + state.thefilter);
        state.theschedule = null;
        state.branchs = computbranch();
        if (state.branchs && state.branchs.length > 0) {
          onBranch(0, state.branchs[0] ?? { branchCode: '', branchName: '' });
        }
      };
      const onBranch = async function (index: number, val: any) {
        if (val) {
          console.log('患者选择科室' + val.branchName);
          Open('');
          var newinfo = await schedulingSchedule(val.branchCode, '');
          state.info.days = newinfo?.days;
          state.bactive = index;
          state.thebranch = val;
          if (state.info.days && state.info.days.length > 0) {
            await onDay(0, state.info.days[0].dayString ?? '');
            Close();
          }else{
            Close();
          }
        }
      };
      const onDay = async function (index: number, val: any) {
        state.isLoading = true;
        Open('');
        if (val) {
          console.log('患者选择就诊日期' + val + state.thebranch.branchCode);
          delay(); //延时启动
          var newinfo = await schedulingSchedule(state.thebranch.branchCode, val);
          if (newinfo && newinfo.schedule && newinfo.schedule.length > 0) {
            state.empty = false;
          } else {
            state.empty = true;
            Close();
            return;
          }

          state.info.schedule = newinfo?.schedule;
          state.schedules = state.info.schedule;
          state.dactive = index;
          state.theday = val;
          if (
            getStore('machine').hospitalcode === 'bwjysq' &&
            state.thebranch.branchCode === '00007'
          ) {
            state.min = state.info.schedule.reduce((prev: any, curr: any) => {
              return prev.waitPern < curr.waitPern ? prev : curr;
            });
            var find = state.info.schedule.filter((s: any, index: any) => {
              return s.id === state.min.id && s.waitPern < 999 && s.waitPern >= 0;
            });
            if (find && find.length > 0) {
              Dialog.confirm({
                title: '请选择',
                message: '为减少排队等候时间，是否选择推荐医生[' + find[0].doctorName + ']',
                closeOnPopstate: true,
                className: 'mat-vant__dialog',
                theme: 'round-button',
              })
                .then(() => {
                  onRegist(find[0]);
                })
                .catch(() => {
                  //return null;
                });
            }
          }
          Close();
        }
      };

      const delay = async () => {
        setTimeout(() => {
          state.isLoading = false;
        }, 500);
      };

      const formatday = function (day: string) {
        return moment(day).format('MM月DD日');
      };
      const getweek = function (day: string) {
        // 参数时间戳
        const week = moment(day).day();
        switch (week) {
          case 1:
            return '周一';
          case 2:
            return '周二';
          case 3:
            return '周三';
          case 4:
            return '周四';
          case 5:
            return '周五';
          case 6:
            return '周六';
          case 0:
            return '周日';
        }
      };
      const onRegist = function (schedule: any) {
        if (schedule) {
          console.log('用户已选择号源，即将转入挂号过程');
          ctx.emit('budget', schedule);
        }
      };
      const onCancel = function () {
        pushAppHome();
      };
      return {
        ...toRefs(props),
        ...toRefs(state),
        onCancel,
        onRegist,
        onMounted,
        onRefresh,
        computfilter,
        computbranch,
        computday,
        formatday,
        getweek,
        onFilter,
        onBranch,
        onDay,
        delay,
      };
    },
  });
</script>

<style lang="less" scoped>
  .schedule {
    position: relative;

    &__filter {
      width: 1.5rem;
      height: 100%;
    }

    &__branch {
      width: 4rem;
      height: 100%;
    }

    &__info {
      width: ~'calc(100% -  5.5rem)';
      height: 100%;
    }

    &__days {
      height: 1.3rem;
      width: 100%;
      // box-shadow: 0.1rem 0.1rem 0.1rem rgb(173 173 173 / 20%);
      box-shadow: 0 0 20px -5px rgba(rgb(150, 149, 149), 0.4);
      border-radius: 1em;
      background-color: #fff;
      //padding: 0 2%;
      margin-bottom: 0.1rem;
    }

    &__schedling {
      padding-top: 0.1rem;
      height: ~'calc(100% - 1.5rem)';
      width: 100%;
    }

    &__schedling__full {
      height: 100%;
      width: 100%;
    }

    &__doctor {
      width: ~'calc(100% - 3rem)';
      height: 100%;
    }
  }

  .schedule_cell_bg {
    border-radius: 16px;
  }

  .schedule-context {
    width: 100%;

    .schedule-context-info {
      width: ~'calc(100% - 0.7rem)';
      height: 50%;
      vertical-align: middle;

      .doctor {
        padding-left: 0.2rem;
        width: 50%;
      }

      .timeflag {
        width: 25%;
      }

      .cost {
        width: 25%;
        right: 0;
        float: right;
      }

      .positionname {
        color: gray !important;
      }
    }
  }

  .schedule {
    padding: 0 5px;
  }

  .toregist {
    border-top-left-radius: 2em;
    border-bottom-left-radius: 2em;
    -webkit-box-shadow: 0 0 10px rgba(#333, 0.2);
    -moz-box-shadow: 0 0 10px rgba(#333, 0.2);
    box-shadow: 0 0 10px rgba(#333, 0.2);
  }

  /deep/ .van-cell {
    padding: 0.2rem 0 0.2rem 0.2rem;
  }

  /deep/.van-cell::after {
    border-bottom: 1px solid rgba(#7e7e7e, 0.5);
  }

  .cell__active {
    color: #fff !important;
    // background-color: #4EA8EC !important;
    background-color: #1989fa !important;
  }

  .cell__inactive {
    color: #333 !important;
    background-color: #fff !important;
  }

  .day__active::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 30%;
    bottom: 0.2rem;
    left: 30%;
    border-bottom: 0.15rem solid #ee0a24;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .day__inactive::after {
    background-color: #fff;
  }

  .margin {
    margin-left: 0.2rem;
  }
</style>
