<template>
  <div id="AlienButton" ref="AlienButton" class="content" v-preventReClick="2000" @click="onClick">
    <div :style="{ width: '100%', height: '25%' }"> </div>
    <div
      class="mybtn"
      :style="{
        width: '100%',
        height: '75%',
        background: '#fff',
        padding: '20px',
        'border-radius': '0.5rem',
        'box-shadow': '0px 0px 6px rgba(0,0,0,0.12)',
      }"
    >
      <van-button round type="warning" :style="resize" class="transact" icon="signin"><slot></slot></van-button>
      <van-divider
        :style="{
          color: '#1989fa',
          borderColor: '#1989fa',
          padding: '0 16px',
          transform: 'translate(0%, -300%)',
          'font-size': '0.5rem',
        }"
        >{{ remark }}</van-divider
      >
    </div>
  </div>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    nextTick,
    onBeforeMount,
    onMounted,
    reactive,
    ref,
    toRefs,
  } from 'vue';
  import { useRect } from '@vant/use';
  export default defineComponent({
    name: 'AlienButton',
    props: { remark: String },
    emits: ['click'],
    components: {},
    setup(props, ctx) {
      const state = reactive({});
      const AlienButton = ref();
      const width = ref(0);
      onMounted(() => {
        const rect = useRect(AlienButton);
        console.log(rect); // -> 元素的大小及其相对于视口的位置
        width.value = rect.width / 2.5;
      });
      const onClick = function () {
        if (ctx) {
          ctx.emit('click');
        }
      };
      const resize = computed(() => {
        console.log(width.value.toString());
        return {
          width: width.value.toString() + 'px',
          height: width.value.toString() + 'px',
          left: '50%',
          border: '0.3rem solid #fff',
          'font-size': '0.5rem',
        };
      });
      return { ...toRefs(state), onClick, AlienButton, resize };
    },
  });
</script>
<style lang="less" scoped>
  .transact {
    transform: translate(-50%, -40%);
  }
  .mybtn:active {
    opacity: 0.6;
  }
  /deep/ .van-button__text{
    font-size: 0.5rem;
  }
</style>
