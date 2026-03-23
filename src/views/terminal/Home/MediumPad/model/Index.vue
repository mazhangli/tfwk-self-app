<template>
  <div class="content flex-c divtip">
    <div class="content__pack">
      <medium-identity
        :medium="medium"
        v-if="medium.mediumcode === 'IDENTITY'"
        @onCallend="oneOff"
      />
      <medium-medicareQR
        :medium="medium"
        v-if="medium.mediumcode === 'MEDICARE.BARCODE'"
        @onCallend="oneOff"
      />
      <medium-scanner
        :medium="medium"
        v-if="medium.mediumcode === 'SCANNING'"
        @onCallend="oneOff"
      />
      <medium-medical :medium="medium" v-if="medium.mediumcode === 'MEDICAL'" @onCallend="oneOff" />
      <medium-medicare-card
        :medium="medium"
        v-if="medium.mediumcode === 'MEDICARE.CARD'"
        @onCallend="oneOff"
      />
    </div>
    <div class="content__nav flex-r-c">
      <van-button
        class="content__fit"
        type="primary"
        size="large"
        icon="revoke"
        block
        round
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        @click="onCancel"
        >取消</van-button
      >
    </div>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    nextTick,
    onMounted,
    reactive,
    ref,
    toRefs,
    onActivated,
    onDeactivated,
    onBeforeMount,
    onBeforeUnmount,
    onUnmounted,
  } from 'vue';
  import MediumIdentity from './Identity.vue';
  import MediumMedicareQR from './Medicare.QR.vue';
  import MediumScanner from './Scanner.vue';
  import MediumMedical from './Medical.vue';
  import MediumMedicareCard from './Medicare.Card.vue';
  import { read as idcard } from '@/trans/driver/src/idcard';
  import { read as patcard } from '@/trans/driver/src/patcard';
  import { callinsapi } from '@/trans/driver/src/insapi/index';
  import { getStore } from '@/utils/cache/storage';
  import { MethodEnum } from '@/trans/driver';
  import { Close, Open } from '@/utils/loading';
  import { patient$confined } from '@/trans/server/his/inhospital';
  import { history$confined } from '@/trans/server/his/patient';
  export default defineComponent({
    name: 'MediumIndex',
    props: {
      menucode: String,
      medium: null as any,
      token: null as any,
    },
    emits: ['called', 'cancel'],
    components: {
      MediumIdentity,
      MediumMedicareQR,
      MediumScanner,
      MediumMedical,
      MediumMedicareCard,
    },
    setup(props, ctx) {
      const state = reactive({
        captiongif: null as any,
      });
      onMounted(() => {
        state.captiongif = require('@/assets/img/gif/identity.gif');
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
      const onCalled = function () {
        ctx.emit('called');
      };
      const onCancel = function () {
        if (ctx) ctx.emit('cancel');
      };
      const oneOff = async function (success: boolean, ...args: any[]) {
        var type = '';
        var card = '';
        var capinfo = {};
        var readed = false;
        if (success === true) {
          switch (props.medium.mediumcode) {
            case 'IDENTITY':
              readed = await idcard();
              if (readed === true) {
                type = '身份证';
                card = getStore('identity').Code;
              }
              break;
            case 'MEDICARE':
            case 'MEDICARE.CARD':
              readed = await callinsapi(MethodEnum.READ);
              if (readed === true) {
                type = 'capinfo';
                capinfo = getStore('capinfo');
              }
              break;
            case 'MEDICARE.BARCODE':
              if (args) {
                readed = await callinsapi(MethodEnum.READ, args[0]);
                if (readed === true) {
                  type = 'capinfo';
                  card = args[0];
                  capinfo = getStore('capinfo');
                }
              } else readed = false;
              break;
            case 'SCANNING':
              if (args[0]) readed = true;
              if (readed === true) {
                type = '%';
                card = args[0];
              } else readed = false;
              break;
            case 'MEDICAL':
              readed = await patcard();
              if (readed === true) {
                type = '就诊卡';
                card = getStore('patcard').cardno;
              }
              break;
          }
          if (readed === true) {
            Close();
            Open('');
            var server = false;
            if (props.medium.menucode?.toLowerCase().startsWith('inhospital')) {
              server = await patient$confined(type, card, capinfo, props.medium.menucode);
            } else {
              server = await history$confined(type, card, capinfo, props.medium.menucode);
            }
            if (server === true) {
              onCalled();
            } else {
              onCancel();
            }
          }
          Close();
        }
      };
      return { ...toRefs(state), onCalled, oneOff, onCancel };
    },
  });
</script>

<style lang="less" scoped>
  .divtip {
    background-color: rgba(#fff, 0.5) !important;
    border-radius: 0.5rem;
    box-shadow: x-shadow 0 10px 10px rgba(0, 0, 0, 0.5);
    padding-left: 2%;
    padding-right: 2%;
  }
</style>
