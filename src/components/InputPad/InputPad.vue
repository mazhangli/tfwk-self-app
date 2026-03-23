<template>
  <div id="InputPad" class="flexbox flexbox-center flexbox-row">
    <!-- <van-field
      id="inputfield"
      v-model="inputfieldtext"
      rows="1"
      :autosize="false"
      :type="password === true ? 'textarea' : 'password'"
      :placeholder="placeholder"
      :autofocus="true"
      clear-trigger="always"
      right-icon="scan"
      :clearable="true"
      :border="true"
      :center="true"
      class="field"
      ref="inputfield"
      @blur="refocus"
      @keyup.enter="close"
    /> -->
    <el-input id="inputfield" ref="Container" :placeholder="placeholder" :rows="1" suffix-icon="el-icon-full-screen"
      v-model="inputfieldtext" :autofocus="true" :clearable="true" class="field" @blur="refocus" @keyup.enter="close" />

    <van-number-keyboard :show="true" theme="custom" extra-key="." close-button-text="完成"
      :get-container="field" class="van-number-keyboard" @input="input" @close="close" @delete="del" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  toRefs,
} from 'vue';
import { useEventListener } from '@vant/use';
export default defineComponent({
  name: 'InputPad',
  props: {
    placeholder: String,
    password: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['callback'], //回调函数
  components: {},
  setup(props, ctx) {
    let field = window.document.getElementById('inputfield');

    const state = reactive({
      inputfieldtext: '',
    });
    const Container = ref(null as any);
    onMounted(() => {
      //Container.value = document.getElementById('inputfield');
      //console.dir(Container.value);
    });

    useEventListener(
      'click',
      () => {
        Container.value.focus();
      },
      { target: document.body }
    );

    // onMounted(() => {
    //     document.addEventListener('keydown', keybarddown);
    //     refocus();
    // });

    const input = function (key: string) {
      state.inputfieldtext += key;
    };
    const close = function () {
      const context = state.inputfieldtext.replace(/\n|\r/g, '');
      console.log(context);
      if (context) ctx.emit('callback', context);
      state.inputfieldtext = '';
    };
    const del = function () {
      if (state.inputfieldtext) {
        state.inputfieldtext = state.inputfieldtext.substring(0, state.inputfieldtext.length - 1);
      }
    };

    const refocus = function () {
      // const inputfield = ref(null as any);
      // console.dir(inputfield.value);
      // inputfield.value.focus();
    };
    const keybarddown = function () {
      refocus();
    };
    return { ...props, ...toRefs(state), field, input, close, del, refocus, Container };
  },
});
</script>

<style lang="less" scoped>
#InputPad {
  width: 100%;
  height: 100%;
  z-index: 2021;
}

.field {
  z-index: 2022;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 0.5em;
  width: 96%;
  margin: 2%;
}

/deep/.van-number-keyboard {
  position: relative;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  background-color: #ebeef5;
  border-radius: 1em;
  z-index: 100;
}

/deep/ .van-icon {
  font-size: 0.5rem !important;
}
</style>
