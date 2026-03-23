<template>
  <div class="content">
    <!-- 加载状态 -->
    <van-skeleton v-if="loading" title row="6" class="content__skeleton" />

    <!-- 空数据状态 -->
    <van-empty
      v-else-if="empty"
      class="content__empty"
      image-size="4rem"
      description="暂无可预约出诊日期"
    />

    <!-- 日期选择网格 -->
    <van-grid v-else :border="false" :column-num="7" :gutter="8" class="content__grid">
      <!-- 星期头部 -->
      <van-grid-item
        v-for="(week, index) in weekDays"
        :key="`week-${index}`"
        class="grid-item grid-week week-header"
      >
        <div class="grid-item__label">{{ week }}</div>
      </van-grid-item>

      <!-- 日期单元格 -->
      <van-grid-item
        v-for="(dateItem, index) in dateList"
        :key="dateItem.dateKey"
        :class="[
          'grid-item date-cell',
          { 'date-cell--active': activeDateKey === dateItem.dateKey },
          { 'date-cell--disabled': !dateItem.available },
          { 'date-cell--today': dateItem.isToday },
        ]"
        @click="handleDateSelect(dateItem)"
        :clickable="dateItem.available"
      >
        <div class="grid-item__day grid-item__day_has flex-r-s">
          <div class="flex-r-c" style="font-size: 0.3rem; width: 0.5rem; height: 100%">
            <span class="grid-item__day_has">有号</span>
            <!-- <span class="grid-item__day_unhas">无号</span> -->
          </div>
          <div class="grid-item__day_content flex-r-c grid-item__day_has">
            <span class="date-month">{{ dateItem.month }}</span>
            <!-- 日期数字 -->
            <span class="date-day">{{ dateItem.day }}</span>
          </div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import { pushAppHome } from '@/router/router';
  import moment from 'moment'; // 替换为moment
  import { speak } from '@/trans/driver/src/speech';

  // 定义日期项类型接口
  interface DateItem {
    dateKey: string; // 日期唯一标识（YYYY-MM-DD）
    day: number; // 日期数字（1-31）
    month: string; // 月份（1-12）
    year: number; // 年份
    available: boolean; // 是否可预约
    isToday: boolean; // 是否是今天
    week: string; // 星期几
  }

  export default defineComponent({
    name: 'ScheduleDays',
    setup() {
      // 响应式数据
      const empty = ref(false);
      const loading = ref(false);
      const activeDateKey = ref(''); // 选中的日期key
      const dateList = ref<DateItem[]>([]);
      const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']; // 星期头部

      // 选中的日期信息
      const selectedDate = computed(() => {
        return dateList.value.find((item) => item.dateKey === activeDateKey.value) || null;
      });

      // 生成近30天的日期列表（模拟出诊日期数据）
      const fetchDateList = async () => {
        try {
          loading.value = true;

          // 模拟API请求延迟
          await new Promise((resolve) => setTimeout(resolve, 500));

          const tempList: DateItem[] = [];
          const today = moment(); // 替换为moment

          // 生成未来30天的日期
          for (let i = 0; i < 30; i++) {
            // moment添加天数的方式：add(i, 'days')
            const currentDate = moment(today).add(i, 'days');
            // moment格式化日期
            const dateKey = currentDate.format('YYYY-MM-DD');
            // moment获取星期（1=周一，7=周日）
            const weekIndex = currentDate.isoWeekday();

            // 模拟可预约状态：周末不可约，部分工作日随机不可约
            const isWeekend = weekIndex === 6 || weekIndex === 7;
            const available = !isWeekend && Math.random() > 0.2; // 80%概率可约

            tempList.push({
              dateKey,
              day: currentDate.date(), // moment获取日期（1-31）
              month: currentDate.month() + 1 + '月', // moment月份是0-11，需+1
              year: currentDate.year(), // moment获取年份
              available,
              isToday: currentDate.isSame(today, 'day'), // moment判断是否是今天
              week: weekDays[weekIndex - 1],
            });
          }

          dateList.value = tempList;
          empty.value = tempList.filter((item) => item.available).length === 0;

          if (empty.value) {
          }
        } catch (error) {
          console.error('获取出诊日期失败:', error);
          empty.value = true;
        } finally {
          loading.value = false;
        }
      };

      // 选择日期处理
      const handleDateSelect = (dateItem: DateItem) => {
        if (!dateItem.available) {
          return;
        }
        activeDateKey.value = dateItem.dateKey;
        console.log('选中出诊日期:', dateItem);
      };

      // 确认选择处理
      const handleConfirm = () => {
        if (!selectedDate.value) {
          return;
        }
        // 这里可添加跳转/提交逻辑
        // router.push({ path: '/schedule-detail', query: { date: selectedDate.value.dateKey } });
      };

      // 取消/返回处理
      const handleCancel = () => {
        pushAppHome();
      };

      // 页面挂载时加载数据
      onMounted(() => {
        fetchDateList();
        speak('请选择就诊日期');
      });

      return {
        empty,
        loading,
        activeDateKey,
        dateList,
        weekDays,
        selectedDate,
        handleDateSelect,
        handleCancel,
        handleConfirm,
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
    // background-color: #f5f5f5;

    // 骨架屏样式
    &__skeleton {
      padding: 10px;
    }

    // 空数据样式
    &__empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    // 日期网格样式
    &__grid {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }

    // 底部操作栏
    &__footer {
      display: flex;
      gap: 10px;
      padding: 15px 10px;
      background-color: #fff;
      border-top: 1px solid #eee;

      .footer__btn {
        flex: 1;
        height: 44px;
        border-radius: 8px;

        &--cancel {
          border: 1px solid #ccc;
          color: #666;
        }

        &--confirm {
          background-color: #1989fa;
          border: none;
        }
      }
    }
  }

  // 网格项通用样式
  .grid-item {
    &.grid-week {
      background: transparent !important;
    }

    &__label {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 0.6rem;
      transition: all 0.2s ease;
      background: transparent;
    }

    &__day {
      width: 100%;
      height: 100%;
      border-radius: 0.3em;
      transition: all 0.2s ease;

      &_has {
        color: #fff;
        font-size: 0.33rem;
        font-weight: 700;
        background: #1989fa;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
      }

      &_unhas {
        color: #333;
        font-size: 0.3rem;
        font-weight: bold;
        background: #eeeff0;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
      }
      &_content {
        background: #fff;
        width: calc(100% -0.5rem);
        border-radius: 1em 0.5em 0.5em 0;
        height: 100%;
      }
    }

    // 星期头部样式
    &.week-header {
      .grid-item__label {
        color: #333;
        background: #eee;
        font-weight: 700;
        font-size: 0.33rem;
      }
    }
  }

  // 日期单元格样式
  .date-cell {
    // 可点击状态
    &__label {
      background-color: #fff;
    }

    // 选中状态
    &--active {
      .grid-item__label {
        background-color: #e8f4ff;
        color: #1989fa;
      }

      .date-num {
        font-weight: bold;
        color: #333;
      }
    }

    // 禁用状态（无号）
    &--disabled {
      .grid-item__label {
        background-color: #f9f9f9;
        color: #ccc;
      }

      .status-tag.unavailable {
        color: #999;
      }
    }

    // 今日标记
    &--today {
      .grid-item__label {
        border: 1px solid #1989fa;
      }
    }
    .date-month {
      width: 100%;
      height: 50%;
      text-align: center;
      font-size: 0.33rem;
      font-weight: bold;
      color: #666;
    }
    // 日期数字
    .date-day {
      width: 100%;
      height: 50%;
      text-align: center;
      font-size: 0.33rem;
      font-weight: bolder;
      color: #333;
    }

    // 状态标签（可约/无号）
    .status-tag {
      font-size: 0.22rem;
      padding: 1px 6px;
      border-radius: 4px;
      line-height: 1.2;

      &.available {
        color: #07c160;
        background-color: #f0f9ff;
      }

      &.unavailable {
        color: #ff4d4f;
        background-color: #fff2f0;
      }
    }

    // 今日标签
    .today-tag {
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 0.2rem;
      color: #1989fa;
      background-color: #fff;
      padding: 0 3px;
      border-radius: 2px;
    }
  }

  /deep/ .van-grid-item__content {
    background: transparent;
    padding: 0.2rem 0;
  }
</style>
