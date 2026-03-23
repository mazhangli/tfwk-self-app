<template>
  <van-dialog  style="width: 50vw; height: 50vh" v-model:show="show" title="" :show-confirm-button="false" :show-cancel-button="false"
  :style="{ color: '#CF8B51'}">
      <div style="width: 50vw; height: 40vh" class="content flex-c">
        <div class="content__pack flex-center" style="justify-content: space-between;padding: 5%">
          <div>
            <span class="content__pack justify-star" :style="{ color: '#CF8B51 !important', 'font-size': '0.33rem'}">请选择您要打印的时间范围:</span>
          </div>
          <div :style="{width: '100%',display: 'grid','grid-template-columns': '1fr 1fr 1fr 1fr', gap: '10px'}">
            <van-button type="primary" color="#3F83CA" round style="width: 100%;height: 2.3rem" square @click="onSelect(7)">近7天内</van-button> 
            <van-button type="primary" color="#3F83CA" round style="width: 100%;height: 2.3rem" square @click="onSelect(30)">近30天内</van-button>
            <van-button type="primary" color="#3F83CA" round style="width: 100%;height: 2.3rem" square @click="onSelect(90)">近90天内</van-button>
            <van-button v-if="from === true" color="#3F83CA" type="primary" round style="width: 100%;height: 2.3rem" square @click="onSelect(365)">近一年内</van-button>
            <van-button v-if="from === false" color="#3F83CA" type="primary" round style="width: 100%;height: 2.3rem" square @click="onSelect(180)">近180天内</van-button>
        </div>
        </div>
        <div class="content__foot flex-center" :style="{'padding-right': '0 !important'}">
          <van-button type="primary" round style="width: 2rem;height: 1.1rem" @click="onQuit">退出</van-button>
        </div>
      </div>
  </van-dialog>
</template>

<script lang="ts">
  import { Open } from '@/utils/loading';
  import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
  export default defineComponent({
    name: 'RangeSelect',
    props: {
      show: false as any,
      from: false as any,
    },
    emits: ['select'],
    components: {},
    setup(props, ctx) {
      const state = reactive({});
      const onQuit = function () {
        onSelect(0);
      };
      const onSelect = function (val: number) {
        Open('');
        if (ctx) {
            ctx.emit('select', val);
        }
      };
      return { ...toRefs(state), onSelect, onQuit };
    },
  });
</script>

<style lang="less" scoped>
/deep/ .van-dialog__header{
  color: #CF8B51 !important;
}
/deep/ .van-button__text {
  font-size: 0.38rem;
}
</style>
