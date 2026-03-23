<template>
  <div class="content flex-c">
    <div class="content__pack flex-c-s" :style="{ padding: '0.5rem' }">
      <medium-identity-scanner
        @onCallend="onCall"
        :identity="identity"
        :scanner="scanner"
        :token="token"
        ref="IdentityScanner"
      ></medium-identity-scanner>
    </div>
    <div class="content__foot flex-r-3" v-if="!redirect">
      <van-button
        class="btn-size-small font-s"
        type="primary"
        icon="wap-home"
        v-on:click="onReturn()"
        >返回首页
      </van-button>
      <timer-button ref="RefItimer" :total="180" :finish="onReturn" />
    </div>
  </div>
  <van-popup
    v-model:show="show"
    round
    class="flex-c-c"
    :style="{ width: '50%', height: '50%', padding: '1rem' }"
  >
    <span
      class="blod"
      style="padding: 0.5rem 0; font-size: 1rem; color: #333"
      v-if="reinfo.details"
      >{{ '签到成功' }}</span
    >
    <span
      class="blod"
      style="padding: 0.5rem 0; font-size: 1rem; color: red"
      v-if="!reinfo.details"
      >{{ '签到失败' }}</span
    >
    <span class="flex-r-c"
      >
      <van-image :src="icon" width="2rem" fit="contain" />
      <span class="blod" style="padding: 1rem 0; font-size: 1rem" v-if="reinfo.patiName">{{
        reinfo.patiName
      }}</span></span
    >
    <span v-if="reinfo.details && reinfo.rtnMsgs">
      <div class="font-xl blod" v-for="(item, index) in reinfo.rtnMsgs" :key="index">
        <!-- {{ item }} -->
        <span
          v-for="(s, index) in item"
          :key="index"
          :class="winds.includes(s) ? ['font-xl', 'blod', 'normal__red'] : ['font-xl', 'blod']"
          >{{s}}</span
        >
      </div>
    </span>
    <span v-if="!reinfo.details">
      <div class="font-xl blod">
        {{ reinfo.rtnText }}
      </div>
    </span>
  </van-popup>
</template>

<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref, reactive, toRefs, onBeforeMount } from 'vue';
  import MediumIdentityScanner from '@/views/terminal/Home/MediumPad/model/Identity$Scanner.vue';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { pushAppHome } from '@/router/router';
  import { getStore } from '@/utils/cache/storage';
  import { Toast } from 'vant';
  import { reportingMachine } from '@/trans/server/his/registry';
  import { Close } from '@/utils/loading';
  export default defineComponent({
    name: 'RegistryD',
    props: {},
    emits: [],
    components: { MediumIdentityScanner, TimerButton },
    setup(props, ctx) {
      const state = reactive({
        identity: null as any,
        scanner: null as any,
        token: 0,
        show: false,
        icon: null as any,
        reinfo: null as any,
        redirect: '',
        winds: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫'],
      });
      const IdentityScanner = ref();
      const onCall = async function (live: boolean, context?: string) {
        console.log('context', live, context);
        if (live) {
          state.reinfo = await reportingMachine(context);
          console.log(state.reinfo);
          Close();
          await onPopup();
        }else{
          Close();
        }

        console.log('IdentityScanner.value?.onReset()');
        IdentityScanner.value?.onReset();
        state.token++;
      };
      onBeforeMount(() => {
        state.redirect = getStore('machine').redirect;
        state.icon = require('@/assets/svg/patient.svg');
        var menu = getStore('menu').filter((item: { menucode: string }) => {
          return item.menucode === 'registry.dlyy';
        });
        state.identity = menu[0].mediums.filter((item: { mediumcode: string }) => {
          return item.mediumcode === 'IDENTITY';
        })[0];
        state.scanner = menu[0].mediums.filter((item: { mediumcode: string }) => {
          return item.mediumcode === 'SCANNING';
        })[0];
      });
      const onReturn = function () {
        pushAppHome();
      };

      const onPopup = async function () {
        state.show = true;
        setTimeout(async () => {
          state.show = false;
        }, 5000);
      };
      return { ...toRefs(state), onCall, onReturn, onPopup, IdentityScanner };
    },
  });
</script>

<style lang="less" scoped>
  .normal__red {
    color: red;
    font-size: 1.5rem;
  }
</style>
