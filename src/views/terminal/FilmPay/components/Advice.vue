<!-- 第一步：选择可补收胶片医嘱 -->

<template>
  <div class="content">
    <div
      class="content__pack flex-r-2"
      :style="{ 'flex-basis': '50%', 'overflow-y': 'scroll' }"
      v-show="empty === false"
    >
      <el-card
        style="
          height: max-content;
          background: #fff;
          margin-bottom: 1%;
          border-radius: 1em;
          flex-basis: 49%;
          margin-right: 1%;
        "
        class="box-card"
        :class="selectedId === `${item.adviceId}_${item.itemId}` ? ['card__active'] : []"
        shadow="never"
        v-for="(item, index) in adviceList"
        :key="`${item.adviceId}_${item.itemId}`"
        @click="onSelect(item)"
      >
        <template #header>
          <div class="card-header">
            <van-image :src="require('@/assets/svg/appointment.svg')" height="1rem" />
            <p class="itemname item">{{ item.itemName || '检查医嘱' }}</p>
            <van-icon
              v-if="selectedId === `${item.adviceId}_${item.itemId}`"
              name="checked"
              color="#1989fa"
              size="0.7rem"
            />
          </div>
        </template>

        <van-field :model-value="item.xxTc" label="检查号" :colon="true" :readonly="true" />
        <van-field :model-value="item.doctorName" label="开单医生" :colon="true" :readonly="true" />
        <van-field
          :model-value="item.workBranchName"
          label="开单科室"
          :colon="true"
          :readonly="true"
        />
      </el-card>
    </div>

    <van-empty
      v-if="empty === true"
      class="content__pack"
      :image="require('@/assets/svg/empty.3.svg')"
      image-size="4rem"
      description="没有查询到可补收胶片的医嘱,可尝试[刷新]"
    />

    <div class="content__foot flex-r-3">
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="replay"
        icon-position="left"
        @click="onRefresh"
        >刷&nbsp;&nbsp;&nbsp;&nbsp;新
      </van-button>
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="arrow"
        icon-position="right"
        :disabled="!selectedAdvice"
        @click="handleNext"
        >下一步
      </van-button>
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="wap-home"
        icon-position="left"
        @click="onReturn"
        >返回主页
      </van-button>
      <timer-button class="margin" :total="300" ref="RefItimer" size="1.1rem" :finish="onReturn" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import { Toast } from 'vant';
  import { queryAdviceList } from '@/trans/server/his/film';
  import { getStore } from '@/utils/cache/storage';
  import { Close, Open } from '@/utils/loading';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { pushAppHome } from '@/router/router';
  export default defineComponent({
    name: 'FilmAdvice',
    emits: ['select-advice', 'next'],
    components: { TimerButton },
    setup(props, ctx) {
      const state = reactive({
        adviceList: [] as any[],
        empty: false,
        selectedAdvice: null as any,
        selectedId: '' as any,
      });

      // 查询医嘱列表
      const onRefresh = async function () {
        const patientId = getStore('history')?.patientid || '';
        if (!patientId) {
          Toast('请先选择患者');
          return;
        }
        Open('');
        try {
          const result: any = await queryAdviceList(patientId);
          state.adviceList = result?.data || result?.info || result || [];
          console.log(state.adviceList);
          state.empty = !state.adviceList || state.adviceList.length === 0;
        } catch (error) {
          state.empty = true;
          Toast.fail('获取医嘱列表失败');
        } finally {
          Close();
        }
      };

      // 选中医嘱
      const onSelect = function (item: any) {
        state.selectedAdvice = item;
        state.selectedId = `${item.adviceId}_${item.itemId}`;
        console.log('onSelect',item)
        ctx.emit('select-advice', item);
      };

      // 下一步
      const handleNext = function () {
        if (!state.selectedAdvice) {
          Toast('请先选择医嘱');
          return;
        }
        ctx.emit('next');
      };

      const onReturn = function () {
        pushAppHome();
      };

      onMounted(async () => {
        await onRefresh();
      });

      return { ...toRefs(state), onRefresh, onSelect, handleNext, onReturn };
    },
  });
</script>

<style lang="less" scoped>
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
  }

  .box-card {
    border: none;
    cursor: pointer;
  }

  .card__active {
    box-shadow: 0 0 10px rgba(#1989fa, 0.5) !important;
    border: 1px solid #1989fa !important;
  }

  .item {
    padding: 0 0.2rem;
    line-height: 0.6rem;
  }

  .itemname {
    color: #707070;
    font-weight: bold;
    font-size: 0.35rem;
  }

  .margin {
    margin-left: 0.2rem;
  }

  /deep/ .el-card__header {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  /deep/ .van-cell .van-field {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
  }
</style>