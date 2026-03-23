<template>
  <div class="content flex-c">
    <div class="flex-c-c" :style="{ height: '30%', width: '100%' }">
      <!-- <van-image width="20%" :src="icon" /> -->

      <van-col class="font-s relative text-middle bloder footer-content-hospital">
        <p class="font-xl" :style="{ 'font-family': '华文行楷', 'padding-top': '0.5rem' }">
          体检自助签到机
        </p>
      </van-col>
    </div>
    <div class="flex-c-c" :style="{ height: '70%', width: '100%' }">
      <div class="content__pack flex-c-c" :style="{ padding: '0 1rem 0.5rem' }">
        <identity :medium="medium" :style="{ 'max-width': '60%' }"></identity>
      </div>
      <div class="content__foot flex-r-3">
        <van-button
          v-preventReClick="2000"
          class="btn-size-normal font-s btn__foot margin"
          type="primary"
          icon="wap-home"
          icon-position="left"
          @click="onQuit"
          >返回主页
        </van-button>
        <timer-button :total="300" class="margin" ref="RefItimer" size="1.1rem" :finish="onQuit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    onMounted,
    reactive,
    toRefs,
    onBeforeMount,
    onBeforeUnmount,
    onUnmounted,
  } from 'vue';
  import { find } from '@/trans/driver/src/other';
  import { DeviceEnum } from '@/trans/driver';
  import { read as idcard } from '@/trans/driver/src/idcard';
  import Identity from '@/views/terminal/Home/MediumPad/model/Identity.vue';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import {
    appRouteEnum,
    pushRouteWithoutParam,
    pushRouteWithParam,
    pushAppHome,
  } from '@/router/router';
  export default defineComponent({
    name: 'ExaminationLogin',
    props: {},
    emits: [],
    components: { Identity, TimerButton },
    setup(props, ctx) {
      const state = reactive({
        caption: null as any,
        longined: false,
        live: true,
        medium: {
          caption: 'identity.gif',
          children: [],
          english: 'Identity Card',
          mediumcode: 'IDENTITY',
          mediumimg: 'identity.png',
          mediumname: '身份证',
          sort: 'A',
          title: '请将患者身份证放置在感应区',
        },
        icon: null as any,
      });

      onMounted(() => {
        console.log('onMounted');
        state.icon = require('@/assets/logo/mhzyyhytj.svg');
        state.caption = require('@/assets/img/gif/' + state.medium.caption);
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
        } else {
          var readed = await idcard();
          if (readed === true) {
            console.log('读卡成功');
            pushRouteWithoutParam(appRouteEnum.ExaminationSignin);
          }
        }
      };
      const onQuit = async function () {
        await pushAppHome();
      };
      return { ...toRefs(state), ...props, onLodding, onQuit };
    },
  });
</script>

<style lang="less" scoped>
  /deep/ .divtip {
    background: transparent !important;
  }
</style>
