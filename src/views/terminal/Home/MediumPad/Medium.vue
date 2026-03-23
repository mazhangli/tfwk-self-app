<template>
  <div>
    <van-button
      type="primary"
      v-preventReClick="2000"
      class="app__medium"
      :style="Resize"
      @click="onClicked"
      style="border: none; border-radius: 1em; overflow: hidden"
    >
      <template #default>
        <div class="ground">
          <van-image width="100%" height="100%" :src="image" />
        </div>
        <div class="contenor">
          <div class="contenor-null"></div>
          <div class="contenor-mask">
            <div
              v-if="medium.mediumcode === 'MEDICARE.BARCODE' && hospital === 'bjjcpfyy'"
              class="contenor-tip"
            ></div>
            <p class="font-m blod chinese">{{ medium.mediumname }}</p>
            <p class="font english">{{ medium.english }}</p>
          </div>
        </div>
      </template>
    </van-button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, toRefs, ref, onMounted } from 'vue';
  import { oneOf } from 'vue-types';
  import { getStore } from '@/utils/cache/storage';
  import { eject, inject as Inscard } from '@/trans/driver/src/inscard';
  import { inject as Patcard } from '@/trans/driver/src/patcard';

  export default defineComponent({
    name: 'Medium',
    components: {},

    props: {
      size: oneOf(['large', 'small', 'mini']),
      menucode: String,
      medium: {} as any,
    },
    emits: ['onCallBack', 'PopupClose', 'push', 'call'],
    setup(props, ctx) {
      const state = reactive({
        token: 0,
        show: false,
        hospital: '',
      });
      const mediumpadfef = ref(null as any);
      const Resize = computed(() => {
        if (props.size === 'large') {
          return ['width: 4.5rem', 'height: 4.5rem'];
        }
        if (props.size === 'small') {
          return ['width: 3rem', 'height: 3rem'];
        }
        if (props.size === 'mini') {
          return ['width: 2.5rem', 'height: 2.5rem'];
        }
      });
      const image = computed(() => {
        return require('@/assets/img/button/' + props.medium.mediumimg);
      });
      const captiongif = computed(() => {
        return require('@/assets/img/gif/' + props.medium.caption);
      });

      onMounted(() => {
        state.hospital = getStore('machine').hospitalcode;
      });
      const onClicked = async function () {
        state.token++;
        state.show = false;
        props.medium.menucode = props.menucode;
        if (props.medium.children && props.medium.children.length > 0) {
          if (ctx) ctx.emit('onCallBack', props.medium.mediumcode);
          return;
        }
        if (ctx) ctx.emit('PopupClose', {}); //关闭一级弹窗
        switch (props.medium.mediumcode) {
          case 'IDENTITY':
            break;
          case 'MEDICARE':
          case 'MEDICARE.CARD':
            if ((await Inscard()) === false) return;
            break;
          case 'MEDICARE.BARCODE':
            try {
              eject();
            } catch (e) {
              console.log(e);
            }
            break;
          case 'SCANNING':
            break;
          case 'MEDICAL':
            if ((await Patcard()) === false) return;
            break;
        }
        if (ctx) ctx.emit('call', props.medium);
        state.show = true;
      };

      return {
        ...toRefs(state),
        image,
        captiongif,
        Resize,
        onClicked,
        mediumpadfef,
      };
    },
  });
</script>

<style lang="less" scoped>
  .app__medium {
    position: relative;
    box-shadow: 0 20px 25px -15px rgba(#252627, 0.2), 0 10px 10px -15px rgba(#252627, 0.1);
    margin-right: 0.2rem;
    // border: rgba(#394664, 0.2) solid 1px;
  }
  .app__medium_popup {
    width: 100vw;
    height: 50vh;
  }
  .ground {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(#252627, 0.2);
    top: 0;
    left: 0;

    img {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }

  .contenor {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    &-null {
      width: 100%;
      height: 75%;
    }

    &-mask {
      background: rgba(#252627, 0.6);
      border-top: rgb(#252627) solid 5px;
      width: 100%;
      height: 25%;
    }

    &-tip {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    &-tip::after {
      content: '支付宝刷医保码';
      position: absolute;
      color: #fff;
      text-align: center;
      justify-content: center;
      font-size: 0.25rem;
      padding: 0.1rem;
      height: 0.3rem;
      line-height: 0.3rem;
      border-radius: 2%;
      top: -0.4rem;
      right: 5px;
      box-shadow: 0px 0px 3px 0px;
      background-color: red;
    }
  }

  .chinese {
    color: #fff;
    vertical-align: middle;
    width: 100%;
    padding: 5px;
    line-height: 0.5rem;
  }

  .english {
    color: #fff;
    vertical-align: middle;
    width: 100%;
    line-height: 0.3rem;
  }

  .bg {
    background-color: #ebeef5 !important;
    border: #ebeef5 solid 1px;
  }

  /deep/.van-button--default {
    background-color: transparent !important;
  }

  /deep/.van-field--min-height .van-field__control {
    min-height: 0 !important;
  }
</style>
