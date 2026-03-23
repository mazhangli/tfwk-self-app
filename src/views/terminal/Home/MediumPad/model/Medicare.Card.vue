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
import { useRoute } from 'vue-router';
import { usePageVisibility } from '@vant/use';
import { find } from '@/trans/driver/src/other';
import { DeviceEnum } from '@/trans/driver/index';
import { Open } from '@/utils/loading';
export default defineComponent({
  name: 'MediumMedicareCard',
  props: {
    medium: null as any,
  },
  emits: ['onCallend'],
  components: {},
  setup(props, ctx) {
    const state = reactive({
      caption: null as any,
      longined: false,
      live: false,
    });

    onMounted(() => {
      state.caption = require('@/assets/img/gif/' + props.medium.caption);
      state.live = true;
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
      if (state.live === false) {
        if (ctx) ctx.emit('onCallend', false);
      }
      if (
        (await find(DeviceEnum.INSCARD, () => {
          return state.live;
        })) === false
      ) {
        state.live = false;
        console.log(false);
        if (ctx) ctx.emit('onCallend', false);
      } else {
        state.live = false;
        console.log(true);
        Open('正在从医保中心获取身份信息,请稍等...');
        if (ctx) ctx.emit('onCallend', true);
      }
      // if (state.live === false) {
      //   if (ctx) ctx.emit('onCallend', false);
      // }
      // while (state.live === true) {
      //   var finded = (await find(DeviceEnum.inscard)) as any;
      //   if (finded === true) {
      //     console.log('当前患者登录成功', '登录方式', props.medium.mediumcode);
      //     if (ctx) ctx.emit('onCallend', true);
      //     break;
      //   }
      // }
    };

    return { ...toRefs(state), ...props, onLodding };
  },
});
</script>

<style lang="less" scoped>
.divtip {
  background-color: white !important;
}
</style>
