<template>
  <div class="reg-Scheduling">
    <div class="reg-Scheduling-pad flex-r-4">
      <calendar class="scheduling-calendar" :dateRange="days" />
      <div class="scheduling-schedule">
        <div style="width: 100%; height: 100%" v-if="schedule && schedule.length > 0">
          <picker-pack :finished="true">
            <van-cell class="schedule-cell" v-for="(item, index) in schedule" :key="index" :center="true"
              :active="index === active" @click="onChange(index)">
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
                <van-button name="confirm" type="success" class="toregist" @click="register(item.id)">挂号</van-button>
              </template>
            </van-cell>
          </picker-pack>
        </div>
        <van-empty v-if="empty === true" :image="emptyIcon" description="没有查询到出诊医生" image-size="4rem"
          class="center" />
      </div>
    </div>
    <div class="reg-Scheduling-foot flex-r-3">
      <van-button class="btn-size-small font-s margin" type="primary" icon="replay" icon-position="left"
        @click="onRefresh">刷&nbsp;&nbsp;&nbsp;&nbsp;新
      </van-button>
      <van-button class="btn-size-small font-s margin" type="primary" :icon="stepIcon" icon-position="left"
        @click="onReturn">上一步
      </van-button>
      <van-button class="btn-size-small font-s margin" type="primary" icon="wap-home" icon-position="left"
        @click="onCancel()">返回主页
      </van-button>
      <timer-button class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import Calendar from '@/components/Calendar/Calendar.vue';
import PickerCell from '@/components/Picker/Picker.cell.vue';
import PickerPack from '@/components/Picker/Picker.pack.vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { registerSchedule, schedulingToday } from '@/trans/server/index';
import { Open, Close } from '@/utils/loading';
import { pushAppHome } from '@/router/router';
import { forEach } from 'lodash';
export default defineComponent({
  name: 'SchedulingSchedule',
  props: {
    today: {
      type: Boolean,
      default: true,
    },
    branchCode: {
      type: String,
      default: '',
    },
  },
  components: {
    Calendar,
    TimerButton,
    PickerPack,
    PickerCell,
  },
  setup(props, ctx) {
    const state = reactive({
      active: 0,
      branch: null,
      days: [] as any[],
      schedule: [] as any[],
      empty: false,
      stepIcon: null,
      emptyIcon: null,
    });
    onBeforeMount(async () => {
      //
      state.emptyIcon = require('@/assets/svg/empty.3.svg');
      state.stepIcon = require('@/assets/svg/step.prev.svg');
      await onRefresh();
    });
    const onRefresh = async function () {
      Open('');
      if (props.branchCode) state.schedule = await schedulingToday(props.branchCode, '');
      state.active = 0;
      if (state.schedule.length === 0) state.empty = true;
      state.schedule.forEach((item) => {
        let is = state.days.find((s) => {
          return s === item.day;
        });
        if (is) {
        } else {
          state.days.push(item.day);
        }
      });
      Close();
    };
    const onChange = function (index: number) {
      state.active = index;
    };
    const onReturn = function () {
      ctx.emit('onReturn', null);
    };
    const onCancel = function () {
      pushAppHome();
    };
    const register = async function (schedule: string) {
      Open('');
      await registerSchedule(schedule);
      Close();
    };
    return {
      ...props,
      ...toRefs(state),
      onMounted,
      onRefresh,
      onCancel,
      onChange,
      onReturn,
      register,
    };
  },
});
</script>

<style  lang="less" scoped>
.reg-Scheduling {
  position: relative;
  width: 100%;
  height: 100%;

  &-pad {
    width: 100%;
    height: ~'calc(100% - 1.5rem)';
  }

  &-foot {
    width: 100%;
    height: 1.5rem;
  }
}

.margin {
  margin-right: 0.2rem;
}

.scheduling-schedule {
  position: relative;
  width: ~'calc(100% - 7rem)';
  height: 100%;
}

.scheduling-calendar {
  position: relative;
  width: 7rem;
  height: 100%;
}

.schedule-cell {
  // border-radius: 1em;
  background-color: rgba(#fff, 1);
  margin: 2px 0;
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
}

/deep/.van-cell {
  -webkit-box-shadow: 0 0 20px rgba(#333, 0.3) inset;
  -moz-box-shadow: 0 0 20px rgba(#333, 0.3) inset;
  box-shadow: 0 0 20px rgba(#333, 0.3) inset;
  border-top-left-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
}

/deep/.van-cell::after {
  border: none;
}

/deep/.van-cell__title {
  width: ~'calc(100% - 1.5rem)';
}

.positionname {
  color: gray !important;
}

/deep/.van-cell__value {
  height: 1rem;
  line-height: 1rem;
}

/deep/ .van-empty__description {
  font-size: 0.34rem;
}

.toregist {
  border-top-left-radius: 2em;
  border-bottom-left-radius: 2em;
  -webkit-box-shadow: 0 0 10px rgba(#333, 0.2);
  -moz-box-shadow: 0 0 10px rgba(#333, 0.2);
  box-shadow: 0 0 10px rgba(#333, 0.2);
}
</style>
