<template>
  <div class="reg-calendar flex-c">
    <calendar class="reg-calendar" :dateRange="list3" />
    <picker class="enbar" :list="list"></picker>
    <picker class="branch" :list="list2"></picker>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import Calendar from '@/components/Calendar/Calendar.vue';
import Picker from '@/components/Picker/Picker.vue';
export default defineComponent({
  name: 'RegistCalendar',
  props: {},
  components: { Calendar, Picker },
  setup(props) {
    const state = reactive({
      list: [
        '全部',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'H',
        'I',
        'G',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'T',
        'Z',
      ],
      list2: ['消化内科', '骨外科', '脊柱外科', '妇科', '产科', '儿科'],
      list3: [
        '2021-03-29',
        '2021-03-30',
        '2021-03-31',
        '2021-04-01',
        '2021-04-02',
        '2021-04-03',
        '2021-05-01',
        '2021-05-02',
        '2021-05-03',
      ],
    });
    return { ...props, ...toRefs(state) };
  },
});
</script>

<style  lang="less" scoped>
.reg-calendar {
  position: relative;
  width: 100%;
  height: 100%;
}
.reg-calendar {
  width: 7rem;
  height: 100%;
}
.enbar {
  width: 2rem;
  height: 100%;
}
.branch {
  width: 4rem;
  height: 100%;
}
</style>
