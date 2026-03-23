<template>
  <div class="reg-Scheduling">
    <div id="SchedulingPad" class="reg-Scheduling-pad flex-r-2">
      <div style="width: 100%; height: 100%"> <scheduling-branch @change="SelectBranch" /></div>
      <!-- <div style="height: 100%" class="right"> <scheduling-schedule ref="schedule" /></div> -->
    </div>
    <div class="reg-Scheduling-foot flex-r-3">
      <van-button
        class="btn-size-small font-s margin"
        type="primary"
        icon="wap-home"
        icon-position="left"
        @click="onClick()"
        >上一步
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import Calendar from '@/components/Calendar/Calendar.vue';
import PickerCell from '@/components/Picker/Picker.cell.vue';
import PickerPack from '@/components/Picker/Picker.pack.vue';
import SchedulingBranch from '@/views/terminal/Regist/Scheduling/model/Scheduling.branch.vue';
import SchedulingSchedule from '@/views/terminal/Regist/Scheduling/Schedule.vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
export default defineComponent({
  name: 'SchedulingToday',
  props: {},
  components: {
    Calendar,
    PickerCell,
    PickerPack,
    TimerButton,
    SchedulingBranch,
    SchedulingSchedule,
  },
  setup(props) {
    const state = reactive({
      active: 0,
      branch: '',
    });
    const schedule = ref();

    onMounted(() => {
      //
    });
    const onChange = function (index: number) {
      state.active = index;
    };
    const SelectBranch = function (branch: any) {
      state.branch = branch;
      //schedule.value.onRefresh(branch.branchCode, '');
    };
    return {
      ...props,
      ...toRefs(state),
      onMounted,
      onChange,
      schedule,
      SelectBranch,
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
.enbar {
  width: 100%;
  height: 100%;
}
.reg-branch {
  width: 3rem;
  height: 100%;
}
.right {
  width: ~'calc(100% - 5.6rem)';
}
.reg-calendar {
  width: 7rem;
}
// /deep/.van-sidebar-item {
//   background-color: rgba(#fff, 0.1);
//   border-radius: 2px;
//   border-right: 1px rgba(#333, 0.1) solid;
//   box-shadow: 1px 7px 8px -6px rgba(#333, 0.2);
// }
// /deep/.van-sidebar-item.van-sidebar-item--select {
//   background-color: rgba(#fff, 0.2);
// }

// /deep/.van-badge {
//   width: max-content;
//   background-color: #1989fa;
// }
// /deep/.van-sidebar-item--select::before {
//   background-color: #1989fa;
// }
// /deep/.van-overlay {
//   background-color: rgba(#fff, 0.1);
// }
// /deep/.van-popup--left.van-popup--round {
//   border-radius: 0 3px 3px 0;
// }
</style>
