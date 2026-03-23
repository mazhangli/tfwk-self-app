<template>
  <div class="calendar">
    <van-tabs
      :v-model:active="0"
      :swipeable="true"
      :scrollspy="false"
      :animated="false"
      :ellipsis="true"
      :sticky="false"
    >
      <van-tab
        v-for="(item, index) in months"
        :key="index"
        :name="index"
        :disabled="item.disable"
        :title="`${item.month}月`"
      >
        <calendar-model
          :key="item.month"
          :minDate="item.start"
          :maxDate="item.end"
          :Default="index === 0 ? item.start : null"
          @onSelect="onSelect"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import moment from 'moment';
import CalendarModel from '@/components/Calendar/Calendar.model.vue';

export default defineComponent({
  name: 'Calendar',
  emit: ['onChange'],
  props: {
    dateRange: Array,
  },
  components: { CalendarModel },
  setup(props, ctx) {
    const state = reactive({
      active: 0,
      months: [
        { month: 1, disable: false, start: null as any, end: null as any, children: [] as any[] },
      ],
      start: null as any,
      end: null as any,
    });
    onMounted(() => {
      //初始化
      state.months = [];
      //遍历
      if (props.dateRange) {
        var tmp = -1;
        props.dateRange.forEach((day, index) => {
          var month = moment(day as string).month() + 1;
          if (month != tmp) {
            state.months.push({
              month: month,
              disable: false,
              start: new Date(day as string),
              end: new Date(day as string),
              children: [new Date(day as string)],
            });
          } else {
            var max = state.months.length;
            state.months[max - 1].children.push(new Date(day as string));
            state.months[max - 1].end = new Date(day as string);
          }
          tmp = month;
        });
      }
    });
    const onSelect = function (day: Date) {
      //console.log(day);
      ctx.emit('onChange', day);
    };

    return {
      ...props,
      onMounted,
      onSelect,
      ...toRefs(state),
    };
  },
});
</script>

<style  lang="less" scoped>
.calendar {
  position: relative;
  padding: 2%;
  width: 100%;
  height: 100%;
}
/deep/.van-tab--active {
  // border-left: 1px rgba(#333, 0.2) solid;
  // border-right: 1px rgba(#333, 0.2) solid;
  opacity: 0.8;
}
/deep/.van-tabs__wrap {
  margin-bottom: 0.1rem;
}
/deep/ .van-tabs__nav {
  background-color: transparent;
}
/deep/.van-tab__text {
  font-size: 0.34rem;
}
/deep/.van-tabs__line {
  background-color: #1989fa;
}
</style>
