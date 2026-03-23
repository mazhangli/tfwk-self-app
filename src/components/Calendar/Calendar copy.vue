<template>
  <div class="calendar">
    <van-tabs
      :v-model:active="0"
      :swipeable="true"
      :scrollspy="true"
      :animated="true"
      :ellipsis="true"
    >
      <van-tab
        v-for="(item, index) in months"
        :key="index"
        :name="index"
        :disabled="item.disable"
        :title="`${item.month}月`"
      >
        <calendar-model :key="item.month" :minDate="item.start" :maxDate="item.end" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import moment from 'moment';
import CalendarModel from '@/components/Calendar/Calendar.model.vue';

export default defineComponent({
  name: 'Calendar',
  props: {
    dateRange: Array,
  },
  components: { CalendarModel },
  setup(props) {
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
        // var len = state.months[0].children.length;
        // state.start = state.months[0].children[0];
        // state.end = state.months[0].children[len - 1];
      }
    });

    const onChange = function (name: string | number, title: string) {
      //console.log(name);
      //console.log(title);
      // var len = state.months[name as number].children.length;
      // if (len > 0) {
      //   state.start = state.months[name as number].children[0];
      //   state.end = state.months[name as number].children[len - 1];
      // }
      // console.log(state.start);
      // console.log(state.end);
    };
    return {
      ...props,
      onMounted,
      onChange,
      ...toRefs(state),
    };
  },
});
</script>

<style  lang="less" scoped>
.calendar {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2%;
}
/deep/ .van-calendar {
  width: 100%;
  //background-color: rgba(#fff, 0.5) !important;
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
// /deep/.van-calendar__header-subtitle {
//   height: 1.2rem;
//   font-size: 0.34rem;
//   line-height: 1.2rem;
//   vertical-align: middle;
// }
/deep/ .van-calendar__weekday {
  font-size: 0.33rem;
}

// /deep/.van-tab {
//   width: 33.33333%;
// }
/deep/.van-tab--active {
  -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 40px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 40px rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 40px rgba(0, 0, 0, 0.1);
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
  //  width: 1.5rem;
  background-color: #1989fa;
}
</style>
