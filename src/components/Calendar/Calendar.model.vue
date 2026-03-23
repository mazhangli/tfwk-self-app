<template>
  <div class="calendar-model">
    <van-calendar
      :poppable="false"
      :show-confirm="false"
      :show-subtitle="false"
      color="#1989fa"
      :round="true"
      first-day-of-week="1"
      :show-title="false"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="Default"
      row-height="0.8rem"
      @select="onSelect"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
export default defineComponent({
  name: 'CalendarModel',
  props: {
    minDate: Date,
    maxDate: Date,
    Default: null as any,
  },
  components: {},
  setup(props, context) {
    onMounted(() => {});
    const onSelect = function (day: Date) {
      context.emit('onSelect', day);
    };
    return {
      ...props,
      onSelect,
      onMounted,
    };
  },
});
</script>

<style  lang="less" scoped>
.calendar-model {
  position: relative;
  padding: 2%;
}
/deep/ .van-calendar {
  background-color: transparent;
}
/deep/ .van-calendar__day--disabled {
  color: rgba(#333, 0.7);
}
/deep/.van-calendar__header {
  padding-top: 3%;
  background-color: transparent;
  height: 0.8rem;
  line-height: 0.8rem;
  align-items: center;
  box-shadow: none;
}
/deep/.van-calendar__month-mark {
  color: rgba(#333, 0.1);
}
/deep/ .van-calendar__month-title {
  display: none;
}
/deep/ .van-calendar__weekday {
  font-size: 0.33rem;
}
/deep/ .van-calendar__day--disabled {
  color: rgba(51, 51, 51, 0.3) !important;
}
</style>
