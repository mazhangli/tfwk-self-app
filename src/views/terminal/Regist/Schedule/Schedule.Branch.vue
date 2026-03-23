<template>
  <div class="content">
   

    <van-empty v-if="empty" class="content__pack" image-size="4rem" description="暂无科室信息" />

    <van-grid v-else :border="false" :column-num="4" :gutter="10" class="content__grid">
      <van-grid-item
        v-for="(item, index) in branchList"
        :key="index"
        :class="{ grid__active: activeIndex === index, grid__inactive: activeIndex !== index }"
        @click="onSelect(item, index)"
      >
        <div class="grid-item__content">
          {{ item.branchName }}
        </div>
      </van-grid-item>
    </van-grid>

   
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { pushAppHome } from '@/router/router';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';

  export default defineComponent({
    name: 'ScheduleBranch',
    components: {
      TimerButton,
    },
    setup() {
      const empty = ref(false);
      const loading = ref(false);
      const finished = ref(false);
      const activeIndex = ref(-1);
      const branchList = ref<any[]>([]);

      // 模拟数据 - 实际应从API获取
      const fetchBranchList = () => {
        loading.value = true;
        // 这里替换为实际的API调用
        setTimeout(() => {
          branchList.value = [
            { branchCode: '00001', branchName: '内科' },
            { branchCode: '00002', branchName: '外科' },
            { branchCode: '00003', branchName: '儿科' },
            { branchCode: '00004', branchName: '妇产科' },
            { branchCode: '00005', branchName: '眼科' },
          ];
          empty.value = branchList.value.length === 0;
          loading.value = false;
          finished.value = true;
        }, 500);
      };

      const onSelect = (item: any, index: number) => {
        activeIndex.value = index;
        // 这里处理选择科室后的逻辑，如跳转到排班页面
        console.log('Selected branch:', item);
      };

      const onCancel = () => {
        pushAppHome();
      };

      onMounted(() => {
        fetchBranchList();
      });

      return {
        empty,
        loading,
        finished,
        activeIndex,
        branchList,
        onSelect,
        onCancel,
      };
    },
  });
</script>

<style lang="less" scoped>
  .content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    &__head {
      width: 100%;
    }

    &__pack {
      height: 100%;
    }

    &__foot {
      padding: 0.5rem;
      background-color: #fff;
    }
    &__grid {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }
  }

  .cell__active {
    color: #fff !important;
    background-color: transparent !important;
  }

  .cell__inactive {
    color: #333 !important;
    background-color: transparent !important;
  }

  .margin {
    margin-left: 0.2rem;
  }

  .grid__active {
    color: #000 !important;
    background-color: transparent !important;
    border-radius: 8px;
  }

  .grid__inactive {
    color: #333 !important;
    background-color: transparent !important;
    border-radius: 8px;
  }

  .grid-item__content {
    padding: 10px 0;
    text-align: center;
    font-size: 0.33rem;
    font-weight: 500;
  }
</style>
