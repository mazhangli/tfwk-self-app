<!-- 第二步：选择胶片收费项目 -->

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
        :class="selectedId === (item.id ?? index) ? ['card__active'] : []"
        shadow="never"
        v-for="(item, index) in filmItems"
        :key="item.id ?? index"
        @click="onSelect(item, index)"
      >
        <template #header>
          <div class="card-header">
            <van-image :src="require('@/assets/svg/appointment.svg')" height="1rem" />
            <p class="itemname item">{{ item.itemFilmName || '胶片项目' }}</p>
            <van-icon
              v-if="selectedId === (item.id ?? index)"
              name="checked"
              color="#1989fa"
              size="0.7rem"
            />
          </div>
        </template>

        <van-field :model-value="item.itemName" label="原项目" :colon="true" :readonly="true" />
        <van-field
          :model-value="String(item.itemFilmQuantity ?? 0)"
          label="数量"
          :colon="true"
          :readonly="true"
        />
        <van-field
          :model-value="item.itemPositionId"
          label="部位"
          :colon="true"
          :readonly="true"
        />
        <p class="item registcost money">单价: &nbsp;{{ formatPrice(item.priceCommon) }}</p>
      </el-card>
    </div>

    <van-empty
      v-if="empty === true"
      class="content__pack"
      :image="require('@/assets/svg/empty.3.svg')"
      image-size="4rem"
      description="该医嘱暂无可用胶片项目"
    />

    <div class="content__foot flex-r-3">
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="arrow-left"
        icon-position="left"
        @click="handlePrev"
        >上一步
      </van-button>
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="arrow"
        icon-position="right"
        :disabled="!selectedItem"
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
  import { defineComponent, reactive, toRefs, watch } from 'vue';
  import { Toast } from 'vant';
  import { queryFilmItems } from '@/trans/server/his/film';
  import { Close, Open } from '@/utils/loading';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { pushAppHome } from '@/router/router';
  export default defineComponent({
    name: 'FilmItem',
    props: {
      adviceId: {
        type: String,
        default: '',
      },
      adviceInfo: {
        type: Object,
        default: null,
      },
    },
    emits: ['select-item', 'prev', 'next'],
    components: { TimerButton },
    setup(props, ctx) {
      const state = reactive({
        filmItems: [] as any[],
        empty: false,
        selectedItem: null as any,
        selectedId: null as any,
      });

      const formatPrice = function (value: any) {
        if (!value) return '¥0.00';
        return `¥${Number(value).toFixed(2)}`;
      };

      const fetchFilmItems = async function () {
        if (!props.adviceId) {
          Toast('请先选择医嘱');
          return;
        }
        Open('');
        try {
          const result: any = await queryFilmItems(props.adviceId);
          state.filmItems = result?.data || result?.info || result || [];
          state.selectedItem = null;
          state.selectedId = null;
          state.empty = !state.filmItems || state.filmItems.length === 0;
        } catch (error) {
          state.empty = true;
          Toast.fail('获取胶片项目失败');
        } finally {
          Close();
        }
      };

      // 选中胶片项目
      const onSelect = function (item: any, index: number) {
        state.selectedItem = item;
        state.selectedId = item.id ?? index;
        ctx.emit('select-item', item);
      };

      const handlePrev = function () {
        ctx.emit('prev');
      };

      const handleNext = function () {
        if (!state.selectedItem) {
          Toast('请先选择胶片项目');
          return;
        }
        ctx.emit('next');
      };

      const onReturn = function () {
        pushAppHome();
      };

      // 医嘱变化时重新查询
      watch(
        () => props.adviceId,
        (val) => {
          if (val) fetchFilmItems();
        },
        { immediate: true }
      );

      return { ...toRefs(state), formatPrice, onSelect, handlePrev, handleNext, onReturn };
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

  .registcost {
    font-weight: bold;
  }

  .money {
    color: #ee0a24;
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