<template>
  <van-button type="primary" size="large">
      <template #default>
        <slot></slot>
        <van-count-down :time="time">
          <template #default="timeData">
            <span style="font-size: 0.6rem; font-weight: 500;">{{ Math.ceiling(timeData.total /1000) }}</span>
          </template>
        </van-count-down>       
       <template>
  </van-button>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';
export default defineComponent({
  name: 'TimerButtonCountdown',
  props: { width: Number, height: Number },
  emits: [],
  components: {},
  setup(props, ctx) {
    return {};
  },
});
</script>

<style lang="less" scoped>
.s {
}
</style>
