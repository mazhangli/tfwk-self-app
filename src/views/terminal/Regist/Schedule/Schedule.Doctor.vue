<template>
  <div class="content">
    <div class="content__head">
      <van-nav-bar :title="`${branchName} - 选择医生`" left-arrow @click-left="onBack" />
    </div>

    <van-empty
      v-if="empty"
      class="content__pack"
      image-size="4rem"
      description="暂无医生排班信息"
    />

    <van-list
      v-else
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      class="content__list"
    >
      <van-cell
        v-for="(item, index) in doctorList"
        :key="index"
        :title="item.doctorName"
        :label="`${item.positionName} | ${item.specialty}`"
        :class="{ cell__active: activeIndex === index, cell__inactive: activeIndex !== index }"
        @click="onSelect(item, index)"
      >
        <template #right-icon>
          <van-tag :type="getTagType(item.waitPern)" plain>
            {{ getWaitText(item.waitPern) }}
          </van-tag>
        </template>
      </van-cell>
    </van-list>

    <div class="content__foot flex-r-3">
      <van-button
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="arrow-left"
        icon-position="left"
        @click="onBack"
      >
        返回科室
      </van-button>
      <van-button
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="wap-home"
        icon-position="left"
        @click="onCancel"
      >
        返回主页
      </van-button>
      <timer-button :total="300" class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { pushAppHome } from '@/router/router';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { schedulingSchedule } from '@/trans/server';
  import { Close, Open } from '@/utils/loading';
  import { scheduling$schedule } from '@/trans/server/his/register';

  export default defineComponent({
    name: 'ScheduleDoctor',
    props: {
      branchCode: {
        type: String,
        required: true,
      },
      branchName: {
        type: String,
        default: '',
      },
      day: {
        type: String,
        required: true,
      },
    },
    components: {
      TimerButton,
    },
    setup(props) {
      const route = useRoute();
      const router = useRouter();
      const empty = ref(false);
      const loading = ref(false);
      const finished = ref(false);
      const activeIndex = ref(-1);
      const doctorList = ref<any[]>([]);
      const branchName = ref('');
      const doctorId = ref('');

      // 获取医生列表
      const fetchDoctorList = async () => {
        Open();
        loading.value = true;
        try {
          const branchCode = route.query.branchCode as string;
          branchName.value = (route.query.branchName as string) || '';

          // 这里替换为实际的API调用
          const res = await scheduling$schedule(props.branchCode, props.day, doctorId.value);

          doctorList.value = res.data?.schedule || [];
          empty.value = doctorList.value.length === 0;
        } finally {
          loading.value = false;
          finished.value = true;
          Close();
        }
      };

      const getTagType = (waitPern: number) => {
        if (waitPern < 10) return 'success';
        if (waitPern < 30) return 'warning';
        return 'danger';
      };

      const getWaitText = (waitPern: number) => {
        if (waitPern < 0) return '已满';
        if (waitPern >= 999) return '不限';
        return `等候 ${waitPern} 人`;
      };

      const onSelect = (item: any, index: number) => {
        activeIndex.value = index;
        // 这里处理选择医生后的逻辑，如跳转到挂号确认页面
        console.log('Selected doctor:', item);
        router.push({
          path: '/regist/confirm',
          query: {
            doctorId: item.doctorId,
            doctorName: item.doctorName,
            // 其他需要传递的参数
          },
        });
      };

      const onBack = () => {
        router.go(-1);
      };

      const onCancel = () => {
        pushAppHome();
      };

      onMounted(() => {
        fetchDoctorList();
      });

      return {
        empty,
        loading,
        finished,
        activeIndex,
        doctorList,
        branchName,
        getTagType,
        getWaitText,
        onSelect,
        onBack,
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

    &__list {
      flex: 1;
      overflow-y: auto;
    }

    &__foot {
      padding: 0.5rem;
      background-color: #fff;
    }
  }

  .cell__active {
    color: #fff !important;
    background-color: #1989fa !important;
  }

  .cell__inactive {
    color: #333 !important;
    background-color: #fff !important;
  }

  .margin {
    margin-left: 0.2rem;
  }
</style>
