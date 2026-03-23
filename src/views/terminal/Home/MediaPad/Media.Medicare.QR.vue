<template>
  <div class="content flex-c-c divtip">
    <div class="mat_fill__header font-l blod">
      <van-icon class="iconfont" class-prefix="mat-icon" name="wode-yibaoka" size="0.5rem" /> {{ medium.title }}
    </div>
    <div class="mat_fill__pack">
      <van-image width="90%" height="calc(100% - 2.5rem)" radius="1em" fit="contain" position="center" :src="caption" />
      <div class="flex-c-c" style="width: 100%; padding-left: 10%; padding-right: 10%">
        <span style="width: 100%;">
          <van-form ref="formidcard">
            <van-field id="scannerfield" v-model="idnum" format-trigger="onBlur" :center="true" placeholder="请扫描二维码"
              :maxlength="28" :rules="[{ required: true, message: '请扫描二维码' }]" class="field" ref="Container"
              :autofocus="true" @keyup.enter="onLoading">
              <template #left-icon>
                <van-icon name="idcard" size="0.5rem" />
              </template>
            </van-field>
          </van-form>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Close, Open } from '@/utils/loading';
import { defineComponent, nextTick, onMounted, reactive, ref, watch, toRefs, onActivated, onDeactivated, onBeforeMount, onBeforeUnmount, onUnmounted, } from 'vue';
import NumberKeyboard from '@/components/Keyboard/NumberKeyboard/src/index.vue';
import { setStore } from '@/utils/cache/storage';
import { isIdCard } from '@/utils/is';
import { useEventListener } from '@vant/use';
export default defineComponent({
  name: 'MediaMedicareBarcode',
  props: {
    medium: null as any,
  },
  emits: ['onCallend'],
  components: { NumberKeyboard },
  setup(props, ctx) {
    const state = reactive({
      caption: null as any,
      longined: false,
      live: false,
      idnum: '',
      hide: false,
      keyicon: null as any,
      context: '',
    });

    const Container = ref(null as any);
    onMounted(() => {
      console.log('onMounted');
      state.keyicon = require('@/assets/svg/keyboard.svg');
      state.caption = require('@/assets/img/gif/' + props.medium.caption);
      console.log(props.medium.caption);
      console.dir(Container.value);
      state.live = true;
      Container.value.focus();
    });

    onUnmounted(async () => {
      console.log('onUnmounted');
      //await calldrive(DeviceEnum.SPEAKER, 'speak', [props.medium.title], 0);
    });

    onBeforeMount(() => {
      console.log('onBeforeMount');
    });

    onBeforeUnmount(() => {
      console.log('onBeforeUnmount');
      state.live = false;
    });
    const formidcard = ref(null) as any;
    const onLoading = async function () {
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
    const onChange = function (val: any) {
      console.log(val);
      state.idnum = val;
    };
    //   // 校验函数可以返回 Promise，实现异步校验
    //   const asyncValidator = (code: string) =>
    //     new Promise((resolve) => {
    //       console.log(code);
    //       resolve(isIdCard(code));
    //     });
    return { ...toRefs(state), ...props, onLoading, onChange, formidcard, Container };
  },
});
</script>

<style lang="less" scoped>
// .divtip {
//   background-color: white !important;
// }

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
