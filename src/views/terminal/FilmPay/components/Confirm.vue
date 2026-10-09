<!-- 确认信息 -->

<template>
  <div class="content">
    <div
      class="content__pack"
      :style="{ 'flex-basis': '100%', 'overflow-y': 'scroll', display: 'block' }"
    >
      <el-card
        style="background: #fff; margin-bottom: 1%; border-radius: 1em"
        class="box-card"
        shadow="never"
      >
        <van-field
          :model-value="selectedAdvice?.itemName || '-'"
          label="检查项目"
          :colon="true"
          :readonly="true"
        />
        <van-field
          :model-value="selectedAdvice?.xxTc || '-'"
          label="检查号"
          :colon="true"
          :readonly="true"
        />
        <van-field
          :model-value="selectedAdvice?.doctorName || '-'"
          label="开单医生"
          :colon="true"
          :readonly="true"
        />
        <van-field
          :model-value="selectedAdvice?.workBranchName || '-'"
          label="开单科室"
          :colon="true"
          :readonly="true"
        />
      </el-card>

      <el-card
        style="background: #fff; margin-bottom: 1%; border-radius: 1em"
        class="box-card"
        shadow="never"
      >
        <van-field
          :model-value="selectedItem?.itemFilmName || '-'"
          label="胶片项目"
          :colon="true"
          :readonly="true"
        />
        <van-field
          :model-value="selectedItem?.itemName || '-'"
          label="原项目"
          :colon="true"
          :readonly="true"
        />
        <van-field
          :model-value="String(selectedItem?.itemFilmQuantity ?? 0)"
          label="数量"
          :colon="true"
          :readonly="true"
        />
        <van-field
          :model-value="formatPrice(selectedItem?.priceCommon)"
          label="单价"
          :colon="true"
          :readonly="true"
        />
        <van-field
          :model-value="selectedItem?.itemPositionId || '-'"
          label="部位"
          :colon="true"
          :readonly="true"
        />
        <van-field
          :model-value="selectedItem?.itemType || '-'"
          label="项目类型"
          :colon="true"
          :readonly="true"
        />
        <p class="item total-line">
          合计金额: <span class="total-amount">{{ formatPrice(totalPrice) }}</span>
        </p>
      </el-card>

      <van-notice-bar
        left-icon="info-o"
        text="请确认胶片项目和数量无误,确认后点击[确认缴费]生成胶片医嘱"
      />
    </div>

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
        icon="passed"
        icon-position="left"
        :loading="submitting"
        loading-text="提交中..."
        @click="handleSubmit"
        >确认缴费
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

<script setup>
import { computed } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';

// Props
const props = defineProps({
  selectedAdvice: {
    type: Object,
    default: null,
  },
  selectedItem: {
    type: Object,
    default: null,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['prev', 'submit']);

// 计算总价
const totalPrice = computed(() => {
  if (!props.selectedItem) return 0;
  const price = props.selectedItem.priceCommon || 0;
  const quantity = props.selectedItem.itemFilmQuantity || 0;
  return price * quantity;
});

// 格式化价格
const formatPrice = (value) => {
  if (!value && value !== 0) return '¥0.00';
  return `¥${Number(value).toFixed(2)}`;
};

// 上一步
const handlePrev = () => {
  emit('prev');
};

// 提交缴费
const handleSubmit = () => {
  if (!props.selectedAdvice || !props.selectedItem) {
    return;
  }
  emit('submit');
};

const onReturn = () => {
  pushAppHome();
};
</script>

<style lang="less" scoped>
.box-card {
  border: none;
}

.item {
  padding: 0 0.2rem;
  line-height: 0.6rem;
}

.total-line {
  font-weight: bold;
  color: #323233;
  padding: 0.06rem 0.3rem;
}

.total-amount {
  font-size: 0.5rem;
  font-weight: 700;
  color: #ee0a24;
  margin-left: 0.2rem;
}

.margin {
  margin-left: 0.2rem;
}

/deep/ .el-card__body {
  padding: 0.06rem 0.2rem;
}

/deep/ .van-cell {
  padding-top: 0.08rem;
  padding-bottom: 0.08rem;
  line-height: 0.5rem;
}
</style>