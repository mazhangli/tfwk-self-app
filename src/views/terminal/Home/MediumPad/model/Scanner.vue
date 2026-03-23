<template>
  <div class="content flex-c">
    <span class="mat_fill__header font-l blod">{{ medium.title }}</span>
    <el-input id="inputfield" ref="Container" input-style="font-size: 0.4rem;font-weight:bloder" style="height: 1rem"
      placeholder="请扫描条码 / 输入条码内容" :rows="1" suffix-icon="el-icon-full-screen" v-model="value" :autofocus="true"
      :clearable="true" :disabled="false" class="field" @keyup.enter="onClose" />
    
      <div class="keyboard-container">
            <van-number-keyboard :show="true" theme="custom" extra-key="." close-button-text="完成"
                class="van-number-keyboard" @input="onInput" @close="onClose" @delete="onDelete" />
        </div>
    <!-- <van-image width="90%" height="calc(100% - 1rem)" radius="1em" fit="contain" position="center" :src="caption" /> -->
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
  } from 'vue';
  import { useRoute } from 'vue-router';
  import { usePageVisibility } from '@vant/use';
  import { useEventListener } from '@vant/use';
  import { sleep } from '@/utils/utils';
  export default defineComponent({
    name: 'MediumScanner',
    props: {
      medium: null as any,
    },
    emits: ['onCallend', 'cancel'],
    components: {},
    setup(props, ctx) {
      const state = reactive({
        caption: null as any,
        longined: false,
        live: false,
        value: '',
        lock: false,
      });
      const Container = ref(null as any);
      onMounted(() => {
        state.caption = require('@/assets/img/gif/' + props.medium.caption);
        console.dir(Container.value);
        state.live = true;
      });

      onUnmounted(() => {
        console.log('onUnmounted');
      });

      onBeforeMount(() => {
        console.log('onBeforeMount');
      });

      onBeforeUnmount(() => {
        console.log('onBeforeUnmount');
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
        // const context = state.value.replace(/\n|\r/g, '');
        // console.log(context);
        // if (context) //ctx.emit('onCallend', context);
        // {
        //     state.longined = await login(props.medium.mediumcode as string, 0, context) as boolean;
        //     if (state.longined === true && state.live === true) {
        //         console.log('当前患者登录成功', '登录方式', props.medium.mediumcode);
        //         if (ctx) ctx.emit('onCallend', true);
        //     }
        // }
        // state.value = '';
        state.lock = true;
        var context = state.value.replace(/\n|\r/g, '');
        console.log(context);
        if (context) {
          //ctx.emit('onCallend', context);
          Open('');
          //state.longined = await login(props.medium.mediumcode as string, 0, context) as boolean;
          if (state.live === true) {
            console.log('当前患者登录成功', '登录方式', props.medium.mediumcode);
            if (ctx) ctx.emit('onCallend', true, context);
          }
        }
        await sleep(1500);
        state.lock = false;
        state.value = '';
      };
      const onDelete = function () {
        if (state.value) {
          state.value = state.value.substring(0, state.value.length - 1);
        }
      };
      const onCancel = function () {
        state.live = false;
        if (ctx) ctx.emit('cancel');
      };
      return { ...toRefs(state), ...props, Container, onInput, onClose, onDelete, onCancel };
    },
  });
</script>

<style lang="less" scoped>
.divtip {
  background-color: white !important;
}

.field {
  z-index: 2022;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12) !important;
  border-radius: 0.5em;
  width: 96%;
  margin-top: 2%;
  margin-bottom: 2%;
  font-size: 0.35rem;
}
/* 外层容器（可选，用于限制键盘最大宽度） */
.keyboard-container {
    width: 100%;
    height: calc(100% - 4rem);
    margin: 0 auto;
}
/deep/.van-number-keyboard {
  position: relative;
  background-color: rgba(#ebeef5, 0.5);
  border-radius: 1em;
  z-index: 100;
  font-size: 0.3rem !important;
}
/* 按键样式：调整大小、间距 */
/deep/.van-number-keyboard__key {
  height: 40px !important; /* 按键高度（默认约48px） */
  margin: 4px !important; /* 按键间距（默认2px） */
  border-radius: 8px !important; /* 按键圆角（可选） */
}

/deep/ .van-icon {
  font-size: 0.5rem !important;
}

// /deep/.el-input__inner{
//     font-size: 0.35rem !important;
// }
// /deep/.van-number-keyboard {
//   background-color: rgba(235, 238, 245, 0.7);
//   padding: 3%;
// }
/deep/.van-number-keyboard {
  position: relative;
  background-color: #ebeef5;
  border-radius: 1em;
  z-index: 100;
}
</style>
