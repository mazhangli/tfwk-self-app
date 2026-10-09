<template>
  <div class="content divtip flex direction_column wrap_no">
    <div class="content flex direction_column wrap_no align-content_between">
      <div class="mat_fill__header font-l blod">
        <van-icon class="iconfont" class-prefix="mat-icon" name="wode-yibaoka" size="0.5rem" /> {{ medium.title }}
      </div>
      <div class="mat_fill__pack">
        <div class="mat_fill__pack flex direction_row wrap_no align-content_between align-items_center">
          <van-image width="50%" height="calc(100% - 1.5rem)" radius="1em" fit="contain" position="center"
            :src="caption1" />
          <van-image width="50%" height="calc(100% - 1.5rem)" radius="1em" fit="contain" position="center"
            :src="caption0" />
        </div>
        <div class="mat_fill__foot flex direction_row wrap_no align-content_center"
          style="padding-left: 10%; padding-right: 10%">
          <span style="width: 100%;">
            <van-form ref="formidcard">
              <van-field id="scannerfield" v-model="idnum" format-trigger="onBlur" :center="true" placeholder="请扫描二维码"
                :maxlength="28" :rules="[{ required: true, message: '请扫描二维码' }]" class="field" ref="Container"
                :autofocus="true" @keyup.enter="onBarcode">
                <template #left-icon>
                  <van-icon name="idcard" size="0.5rem" />
                </template>
              </van-field>
            </van-form>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DeviceEnum } from '@/trans/driver';
import { find } from '@/trans/driver/src/other';
import { Open } from '@/utils/loading';
import { useEventListener } from '@vant/use';
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
  name: 'MediaMedicare',
  props: {
    medium: null as any,
  },
  emits: ['onCallend'],
  components: {},
  setup(props, ctx) {
    const state = reactive({
      caption0: null as any,
      caption1: null as any,
      longined: null as any,
      live: false,
      idnum: null as any,
      context: '',
    });

    onMounted(async () => {
      console.log('onMounted');
      state.caption0 = resolveIcon(props.medium.children[0].caption, '@/assets/img/gif/');
      state.caption1 = resolveIcon(props.medium.children[1].caption, '@/assets/img/gif/');
      state.live = true;
      console.dir(Container.value);
      Container.value.focus();
      // onLodding();
    });

    onUnmounted(async () => {
      console.log('onUnmounted');
      //await calldrive(DeviceEnum.SPEAKER, 'speak', [props.medium.title], 0);
    });

    onBeforeMount(async () => {
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
      //await calldrive(DeviceEnum.INSCARD, 'enter', [], 0);
      while (state.live === true) {
        if ((await find(DeviceEnum.INSCARD, () => { return state.live; })) === false) {
          console.log(false);
          if (ctx) ctx.emit('onCallend', false);
        } else {
          console.log(true);
          if (ctx) ctx.emit('onCallend', state.live);
        }
      }

    };
    const Container = ref(null as any);
    const formidcard = ref(null) as any;
    const onBarcode = async function (card?: any) {
      formidcard.value.validate();
      if (state.context === state.idnum.replace(/\n|\r/g, '')) {
      } else {
        state.context = state.idnum.replace(/\n|\r/g, '');
        console.log(state.context);
        if (state.context) {
          Open('');
          if (state.context) {
            Open('');
            if (ctx) ctx.emit('onCallend', true, state.context);
          }
          state.idnum = '';
        }
      }
    };
    useEventListener(
      'click',
      () => {
        Container.value.focus();
      },
      { target: document.body }
    );
    return { ...toRefs(state), ...props, onLodding, onBarcode,formidcard, Container };
  },
});
</script>

<style lang="less" scoped>
.head {
  background: rgba(#428df5);
  color: white;
  width: 100%;
  height: 1.5rem;
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;

  p {
    line-height: 1.5rem;
    text-align: center;
    vertical-align: bottom;
  }
}
.field {
    z-index: 2022;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 20%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 20%);
    border-radius: 0.5em;
    width: 96%;
    margin: 2%;
    font-weight: bold;
    height: auto;
}
</style>
