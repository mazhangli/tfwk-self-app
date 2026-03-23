<template>
  <div class="content flex-c">
    <span class="mat_fill__header font-l blod">{{ medium.title }}</span>
    <van-image
      width="90%"
      height="calc(100% - 1.5rem)"
      radius="1em"
      fit="contain"
      position="center"
      :src="caption"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
  toRefs,
  onActivated,
  onDeactivated,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
} from 'vue';
import { find } from '@/trans/driver/src/other';
import { DeviceEnum } from '@/trans/driver';
import { speak } from '@/trans/driver/src/speech';
export default defineComponent({
  name: 'MediumIdentity',
  props: {
    medium: null as any,
  },
  emits: ['onCallend', 'cancel'],
  components: {},
  setup(props, ctx) {
    const state = reactive({
      caption: null as any,
      longined: false,
      live: true,
    });

    onMounted(() => {
      speak(props.medium.title);
      console.log('onMounted');
      state.caption = require('@/assets/img/gif/' + props.medium.caption);
      onLodding();
    });

    onUnmounted(() => {
      console.log('onUnmounted');
    });

    onBeforeMount(() => {
      console.log('onBeforeMount');
    });

    onBeforeUnmount(() => {
      console.log('onBeforeUnmount');
      state.live = false;
    });

    const onLodding = async function () {
      if (
        (await find(DeviceEnum.IDCARD, () => {
          return state.live;
        })) === false
      ) {
        if (ctx) ctx.emit('onCallend', false);
      } else {
        if (ctx) ctx.emit('onCallend', state.live);
      }
    };
    const onCancel = function () {
      state.live = false;
      if (ctx) ctx.emit('cancel');
    };
    return { ...toRefs(state), ...props, onLodding, onCancel };
  },
});
</script>

<style lang="less" scoped>
.divtip {
  background-color: white !important;
}
</style>
