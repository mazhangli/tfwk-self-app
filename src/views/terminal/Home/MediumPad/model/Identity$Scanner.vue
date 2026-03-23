<template>
  <div class="content flex-c divtip">
    <span class="mat_fill__header font-l blod">{{ identity.title }} 或者 {{ scanner.title }}</span>
    <el-input
      id="inputfield"
      ref="Container"
      input-style="font-size: 0.4rem;font-weight:bloder"
      style="height: 1rem"
      placeholder="请扫描条码 / 输入条码内容"
      :rows="1"
      suffix-icon="el-icon-full-screen"
      v-model="value"
      :autofocus="true"
      :clearable="true"
      :disabled="disabled"
      class="field"
      @keyup.enter="onClose"
    />
    <div style="width: 100%; height: calc(100% - 4rem)" class="flex-r-c">
      <div style="height: 60%; width: 100%" class="flex-c-c">
        <van-number-keyboard
          :show="true"
          theme="custom"
          :extra-key="['X']"
          close-button-text="完成"
          class="van-number-keyboard"
          @input="onInput"
          @close="onClose"
          @delete="onDelete"
        />
      </div>
      <div style="height: 40%; width: 100%; overflow: hidden" class="flex-c-c">
        <van-image
          width="90%"
          height="90%"
          radius="1em"
          fit="contain"
          position="center"
          :src="caption"
        />
        <van-button
          class="btn-size-normal btn__foot font-s"
          type="primary"
          icon="wap-home"
          @click="onIdcard"
          v-preventReClick="1000"
          >读身份证</van-button
        >
      </div>
    </div>
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
    onUpdated,
  } from 'vue';
  import { useRoute } from 'vue-router';
  import { usePageVisibility } from '@vant/use';
  import { useEventListener } from '@vant/use';
  import { read as idcard } from '@/trans/driver/src/idcard';
  import { find } from '@/trans/driver/src/other';
  import { DeviceEnum, MethodEnum } from '@/trans/driver';
  import { getStore } from '@/utils/cache/storage';
  import { getPeronInfoObject } from '@/trans/driver/src/insapi/capinfo';
  import { callinsapi } from '@/trans/driver/src/insapi/index';
  import { find as findIdcard } from '@/trans/driver/src/idcard';
  export default defineComponent({
    name: 'MediumIdentityScanner',
    props: {
      identity: null as any,
      scanner: null as any,
      token: Number,
    },
    emits: ['onCallend'],
    components: {},
    setup(props, ctx) {
      const state = reactive({
        caption: null as any,
        longined: false,
        live: false,
        value: '',
        disabled: false,
      });
      const Container = ref(null as any);
      onMounted(() => {
        state.caption = require('@/assets/img/gif/' + props.identity.caption);
        console.dir(Container.value);
        state.live = true;
      });

      onUpdated(() => {
        console.log('onUpdated');
        // onLodding();
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

      useEventListener(
        'click',
        () => {
          Container.value.focus();
        },
        { target: document.body }
      );

      const onInput = function (key: string) {
        state.value += key;
      };

      const onClose = async function () {
        state.disabled = true;
        var faild = false;
        const context = state.value.replace(/\n|\r/g, '');
        console.log(context);
        if (context) {
          Open('');
          if (context.length > 19) {
            //医保组件读取医保卡号
            var r = await callinsapi(MethodEnum.READ, context);
            console.log('r:' + r);
            if (r === true) {
              var medicare = getPeronInfoObject();
              console.log(medicare);
              if (state.live === true && medicare) {
                console.log('当前患者登录成功', '登录方式', medicare.ic.ic_no);
                if (ctx) ctx.emit('onCallend', true, medicare.ic.ic_no);
              } else {
                faild = true;
              }
            } else {
              faild = true;
            }
          } else {
            if (state.live === true) {
              console.log('当前患者登录成功', '登录方式', context);
              if (ctx) ctx.emit('onCallend', true, context);
            } else {
              faild = true;
            }
          }
        } else {
          faild = true;
        }
        state.value = '';
        if (faild === true) {
          Close();
          if (ctx) ctx.emit('onCallend', false, null);
        }
      };

      const onDelete = function () {
        if (state.value) {
          state.value = state.value.substring(0, state.value.length - 1);
        }
      };
      const onLodding = async function () {
        if (
          (await find(DeviceEnum.IDCARD, () => {
            return state.live;
          })) === false
        ) {
          if (ctx) ctx.emit('onCallend', false);
        } else {
          state.disabled = true;
          var id = await idcard();
          if (id === true) {
            console.log('当前患者登录成功', '登录方式', props.identity.mediumcode);
            if (ctx) ctx.emit('onCallend', state.live);
          }
        }
      };
      const onIdcard = async function () {
        if ((await findIdcard()) === true) {
          var id = await idcard();
          if (id === true) {
            console.log('当前患者登录成功', '登录方式', props.identity.mediumcode);
            if (ctx) ctx.emit('onCallend', true);
          }
        }
      };

      const onReset = function () {
        console.log('重置输入框');
        state.disabled = false;
        Container.value.focus();
      };
      return {
        ...toRefs(state),
        ...props,
        Container,
        onInput,
        onClose,
        onDelete,
        onLodding,
        onReset,
        onIdcard,
      };
    },
  });
</script>

<style lang="less" scoped>
  .divtip {
    background-color: white !important;
    // padding-left: 2%;
    // padding-right: 2%;
  }

  .field {
    z-index: 2022;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12) !important;
    border-radius: 0.5em;
    width: 96%;
    margin: 2%;
    font-size: 0.35rem;
  }

  /deep/.van-number-keyboard {
    position: relative;
    background-color: rgba(#ebeef5, 0.5);
    border-radius: 1em;
    z-index: 100;
  }

  /deep/ .van-icon {
    font-size: 0.5rem !important;
  }

  // /deep/.el-input__inner{
  //     font-size: 0.35rem !important;
  // }
  /deep/.van-number-keyboard {
    background-color: rgba(235, 238, 245, 0.7);
    padding: 3%;
  }

  /deep/ .van-key__wrapper {
    // transform: scale(1.5, 1.5);
  }
  /deep/ .van-key {
    font-size: 0.66rem;
  }
</style>
