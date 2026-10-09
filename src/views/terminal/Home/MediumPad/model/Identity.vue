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

// ============================================================
// 图标/动画解析（与 AppMenu、Medium 保持一致）
// 支持三种来源：
//   1. 远程 URL：http://、https://、//
//   2. 绝对路径：/uploads/xxx.gif（后端返回的地址）
//   3. 本地文件：相对于 baseDir 的本地打包资源
// ============================================================
const resolveIcon = (ic: string | undefined | null, baseDir: string): string => {
  if (!ic) return '';
  if (/^(https?:)?\/\//.test(ic) || ic.startsWith('/')) return ic;
  try {
    return require(baseDir + ic);
  } catch (e) {
    return ic;
  }
};

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
      state.caption = resolveIcon(props.medium.caption, '@/assets/img/gif/');
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
