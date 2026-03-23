<template>
  <div class="content flex-c-c">
    <span v-if="unload === false" class="flex-c-c" style="width: 50%">
      <span class="item">
        <van-button type="primary" size="large" round @click="onQuit">退出自助系统</van-button>
      </span>
      <span class="item">
        <van-button type="success" size="large" round @click="reStart">操作系统重启</van-button>
      </span>
      <span class="item">
        <van-button type="warning" size="large" round @click="onClose">操作系统关机</van-button>
      </span>

      <van-checkbox label-position="left" @click="onChange">开启管理员设置模式</van-checkbox>
    </span>
  </div>
  <van-dialog
    v-model:show="unload"
    :closeOnPopstate="true"
    title="请输入管理密码"
    className="bg"
    :show-cancel-button="true"
    :show-confirm-button="false"
    width="8rem"
    :overlay="true"
    overlayClass="van-overlay-white"
    theme="round-button"
    cancel-button-text="取消"
    message-align="center"
    :teleport="Container"
    @cancel="onCancel"
  >
    <div class="content flex-c" style="{ 'padding-bottom': '0.3rem' }">
      <input-pad @callback="onInput" placeholder="管理密码" />
    </div>
  </van-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { Dialog } from 'vant';
import InputPad from '@/components/InputPad/InputPad.vue';
import { appRouteEnum, pushAppHome, pushRouteWithoutParam } from '@/router/router';
import { quit, reboot, shutdown } from '@/trans/driver/src/system';
import { eject, close } from '@/trans/driver/src/other';
import { setStore } from '@/utils/cache/storage';
export default defineComponent({
  name: 'Manager',
  props: {},
  components: { InputPad },
  setup() {
    const state = reactive({
      unload: true,
    });
    const Container = ref(null as any);
    onMounted(() => {
      Container.value = document.getElementById('Home');
    });
    const onCancel = function () {
      console.log('pushAppHome');
      state.unload = true;
      pushAppHome();
    };
    const onInput = async function (input: string) {
      console.log('onInput', input);
      if (input && input === '147580') {
        state.unload = false;
        console.log(state.unload);
      }
    };
    const onQuit = async function () {
      await eject();
      await close();
      await quit();
    };
    const reStart = async function () {
      Dialog.confirm({
        message: '是否需要重启操作系统?',
        closeOnPopstate: true,
        className: 'mat-vant__dialog',
        theme: 'round-button',
      })
        .then(() => {
          reboot();
        })
        .catch(() => {});
    };
    const onClose = async function () {
      Dialog.confirm({
        message: '是否需要关闭操作系统?',
        closeOnPopstate: true,
        className: 'mat-vant__dialog',
        theme: 'round-button',
      })
        .then(() => {
          shutdown();
        })
        .catch(() => {});
    };
    const onChange = async function () {
      await Dialog.confirm({
        message: '是否需要启动管理员模式?',
        closeOnPopstate: true,
        className: 'mat-vant__dialog',
        theme: 'round-button',
      })
        .then(() => {
          setStore('manager', '1');
          pushRouteWithoutParam(appRouteEnum.appHome);
        })
        .catch(() => {
          setStore('manager', '0');
        });
    };
    return {
      ...toRefs(state),
      Container,
      onClose,
      onCancel,
      onInput,
      reStart,
      onQuit,
      onChange,
    };
  },
});
</script>

<style lang="less">
.menupad {
  width: 100%;
  height: 100%;
  position: relative;
}

.item {
  width: 100%;
  margin-bottom: 0.3rem;
}
</style>
