<template>
  <div class="reg-Scheduling">
    <div id="SchedulingPad" class="reg-Scheduling-pad flex-r-4">
      <calendar
        :dateRange="[
          '2021-06-24',
          '2021-06-25',
          '2021-06-26',
          '2021-06-27',
          '2021-06-28',
          '2021-06-29',
        ]"
      />
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
import TimerButton from '@/components/terminal/button/TimerButton.vue';
export default defineComponent({
  name: 'SchedulingDate',
  props: {},
  components: {
    Calendar,
    TimerButton,
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
      schedule.value.onRefresh(branch.branchCode, '');
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
</style>
