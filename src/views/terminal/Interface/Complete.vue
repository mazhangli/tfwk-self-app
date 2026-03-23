<template>
  <div id="nucleicinvoking" class="content flex-c-c">
    <van-image :src="image" width="5rem" :style="{ margin: '0.5rem' }" />
    <p class="title font-l blod">{{ title }}</p>
    <p class="交易结束,请返回首页或继续操作"></p>
    <van-divider :style="{ width: '70%' }"></van-divider>
    <span class="description flex-r" v-for="(item, index) in description" :key="index">
      <van-icon name="wap-nav" color="#1989fa" size="0.5rem" />
      <p> :{{ item }}</p>
    </span>
    <div class="control flex-r-c">
      <span :style="{ width: '3rem', margin: '0.1rem' }">
        <van-button plain type="primary" block @click="onFinish">返回首页</van-button>
      </span>
      <span :style="{ width: '3rem' }">
        <!-- <van-button type="primary" block @click="onReturn">继续交易</van-button> -->
      </span>
    </div>
    <timer-button class="margin" ref="RefItimer" size="1.1rem" :total="10" :finish="onFinish" />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { pushAppHome } from '@/router/router';
  import { oneOf } from 'vue-types';
  import { callinsapi } from '@/trans/driver/src/insapi/index';
  import { MethodEnum } from '@/trans/driver';
  import { getStore } from '@/utils/cache/storage';
  import Confirm from '../Home/MediaPad/Capinfo';
  import { Close, Open } from '@/utils/loading';
  export default defineComponent({
    name: 'Complete',
    props: {
      type: oneOf(['success', 'faild']),
      // 描述
      description: [] as any,
    },
    emits: ['CallBack'],
    components: { TimerButton },
    setup(props, ctx) {
      const state = reactive({
        title: '交易成功!',
        subtitle: '',
      });
      const image = ref();
      onMounted(() => {
        if (props.type === 'success') {
          image.value = require('@/assets/svg/complete.svg');
          state.title = '交易成功!';
        } else {
          image.value = require('@/assets/svg/faild.svg');
          state.title = '交易失败!';
        }
      });
      const onFinish = function () {
        pushAppHome();
      };
      const RefItimer = ref(null) as any;
      const onReturn = async function () {
        try {
         if (getStore('media').type === '医保卡') {
            RefItimer.value.pause();
            if (getStore('media').cardno) {
              // var read = await calldrive(DeviceEnum.INSAPI, 'person', ['redone'], 0);
              //针对电子凭证二次读卡
              await Confirm({})
                .then(() => {
                  console.log('二次读卡成功结束');
                })
                .catch(() => {
                  throw new Error('二次读卡失败结束');
                });
            } else {
              Open('正在连接医保重新读卡,请稍等');
              var read = await callinsapi(MethodEnum.READ);
              if (!read) {
                Close();
                throw new Error('医保卡读卡失败');
              }
              Close();
            }
          }
          ctx.emit('CallBack');
        } catch (e) {
          console.log(e);
          onFinish();
        }
      };
      return {
        ...toRefs(state),
        image,
        onFinish,
        onReturn,
        RefItimer,
      };
    },
  });
</script>

<style lang="less" scoped>
  .title {
    color: #75ac64;
    line-height: 1rem;
  }

  .description {
    line-height: 0.5rem;
    height: 0.5rem;
    vertical-align: middle;
    text-align: center;
  }

  .control {
    height: 2rem;
    width: 100%;
  }
</style>
