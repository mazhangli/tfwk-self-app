<template>
  <div class="content flex-c divtip">
    <p class="title__sub font-l blod">{{ medium.title }}</p>
    <van-image width="90%" height="calc(100% - 1rem)" radius="1em" fit="contain" position="center" :src="caption" />
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
      state.caption = resolveIcon(props.medium.caption, '@/assets/img/gif/');
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
      if (await find(DeviceEnum.INSCARD, () => { return state.live; }) === false) {
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
