<template>
  <div class="content flex-c divtip">
    <p class="title__sub font-m blod">{{ medium.title }}</p>
    <van-image width="90%" height="calc(100% - 4rem)" radius="1em" fit="contain" position="center" :src="caption" />
    <div class="flex-c-c" style="width: 100%; padding-left: 10%; padding-right: 10%">
      <span style="width: 100%; padding-bottom: 0.3rem; padding-top: 0.3rem">
        <van-form ref="formidcard">
          <van-field id="scannerfield" v-model="idnum" format-trigger="onBlur" :center="true" placeholder="请扫描二维码"
            :rules="[{ required: true, message: '请扫描二维码' }]" class="field" :autofocus="true" :maxlength="28"
            @keyup.enter="onLoading">
            <template #left-icon>
              <van-icon name="idcard" size="0.5rem" />
            </template>
          </van-field>
        </van-form>
      </span>
    </div>
    <!-- <van-image
      width="90%"
      height="calc(100% - 1rem)"
      radius="1em"
      fit="contain"
      position="center"
      :src="caption"
    /> -->
    <!-- <van-count-down :time="time" @finish="onCancel">
      <template #default="timeData"> -->
    <span class="block font-m">{{ current.seconds }}</span>
    <!-- </template>
    </van-count-down> -->
  </div>
</template>

<script lang="ts">
import { Close, Open } from '@/utils/loading';
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
  computed,
} from 'vue';
import { getStore, setStore } from '@/utils/cache/storage';
import { useEventListener } from '@vant/use';
import { useCountDown } from '@vant/use';
import { Image as VantImage, Form, Field, Icon, CountDown } from 'vant';
import { callinsapi } from '@/trans/driver/src/insapi/index';
import { MethodEnum } from '@/trans/driver';

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
  name: 'CapinfoBarcode',
  props: {
    onConfirm: {
      type: Function,
      default: () => { },
    },
    onCancel: {
      type: Function,
      default: () => { },
    },
  },
  components: {
    'van-image': VantImage,
    'van-form': Form,
    'van-field': Field,
    'van-icon': Icon,
    'van-count-down': CountDown,
  },
  setup(props, ctx) {
    const state = reactive({
      medium: null as any,
      caption: null as any,
      longined: false,
      live: false,
      idnum: '',
      hide: false,
      keyicon: null as any,
      context: '',
    });
    const countDown = useCountDown({
      time: 60 * 1000,
      millisecond: true,
      onFinish: (() => { props.onCancel(); }),
    });
    countDown.start();

    const Container = computed(() => document.getElementById('scannerfield'));
    onMounted(async () => {
      console.log('onMounted');
    });

    onBeforeMount(() => {
      console.log('onBeforeMount');
      state.medium = getStore('medias').find((value: any, index: any) => {
        return value.mediacode === 'MEDICARE.BARCODE';
      });
      console.log(state.medium);
      state.keyicon = require('@/assets/svg/keyboard.svg');
      state.caption = resolveIcon(state.medium.caption, '@/assets/img/gif/');
      state.live = true;
    });

    onBeforeUnmount(() => {
      console.log('onBeforeUnmount');
      state.live = false;
    });
    const formidcard = ref(null) as any;
    const onLoading = async function () {
      formidcard.value.validate();
      if (state.context === state.idnum.replace(/\n|\r/g, '')) {
        state.context = '';
      } else {
        state.context = state.idnum.replace(/\n|\r/g, '');
      }
      console.log(state.context);
      if (state.context) {
        Open('');
        var readed = await callinsapi(MethodEnum.READ, state.context);
        if (readed === true) {
          console.log('当前患者登录成功', '登录方式', state.medium.mediacode);
          props.onConfirm();
        } else {

        }
      }
      state.idnum = '';
      Close();
    };
    useEventListener(
      'click',
      () => {
        console.log('click');
        if (Container && Container.value) Container.value.focus();
      },
      { target: document.body }
    );
    const onChange = function (val: any) {
      console.log(val);
      state.idnum = val;
    };
    return {
      ...toRefs(state),
      ...props,
      onLoading,
      onChange,
      formidcard,
      Container,
      current: countDown.current,
    };
  },
});
</script>

<style lang="less" scoped>
.divtip {
  background-color: white !important;
  padding: 2%;
}

.field {
  z-index: 20222;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 20%);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 20%);
  border-radius: 0.5em;
  width: 96%;
  margin: 2%;
  font-weight: bold;
  height: auto;
}

/deep/.el-input {
  padding-left: 5%;
  border: none !important;
  border-radius: 8px;
  //box-shadow: 0px 0px 12px rgba(0, 0, 0, .12) !important;
  border: 1px solid #e4e7ed;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 10%);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 10%);
}

/deep/.el-input__inner {
  border: none !important;
  box-shadow: none !important;
  font-size: 0.33rem;
}
</style>
