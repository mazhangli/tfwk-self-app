<template>
  <div class="content">
    <div
      class="content__pack flex-r-2"
      :style="{ 'flex-basis': '50%', 'overflow-y': 'scroll' }"
      v-show="empty === false"
    >
      <picker-pack
        style="width: 100%; background: rgba(#f0ecec, 0.7); padding: 1%; border-radius: 1em"
        :finished="true"
        custom-style="content "
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
          shadow="never"
          v-for="(item, index) in info"
          :key="index"
        >
          <template #header>
            <div class="card-header">
              <van-image :src="require('@/assets/svg/appointment.svg')" height="1rem" />
              <p class="daystring item" v-if="item.isToday === 1">今日就诊</p>
              <van-button
                v-preventReClick="2000"
                v-if="item.isToday === 1"
                class="font-s margin button__take"
                type="primary"
                round
                :style="{ height: '1.4rem', width: '3rem' }"
                @click="onbudget(item)"
                icon="arrow"
                icon-position="right"
                >取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号
              </van-button>
              <van-button
                v-preventReClick="2000"
                v-if="item.isToday === 0"
                class="font-s margin button__take"
                type="warning"
                round
                :style="{ height: '1.4rem', width: '3rem' }"
                @click="onSchedulecancel(item.hisOrderno)"
                icon="revoke"
                icon-position="right"
                >取消预约
              </van-button>
            </div>
          </template>

          <van-field v-model="item.branchName" label="就诊科室" :colon="true" :readonly="true" />
          <van-field v-model="item.doctorName" label="就诊医生" :colon="true" :readonly="true" />
          <van-field v-model="item.registDate" label="就诊日期" :colon="true" :readonly="true" />
          <van-field v-model="item.timeSpan" label="预约时段" :colon="true" :readonly="true" />
          <p class="item registcost" :class="item.isToday === 1 ? ['money'] : ['danger']"
            >合计金额: &nbsp;¥{{ item.allCost }}</p
          >
        </el-card>
      </picker-pack>
    </div>
    <van-empty
      v-if="empty === true"
      class="content__pack"
      :image="require('@/assets/svg/empty.3.svg')"
      image-size="4rem"
      description="没有查询到预约记录,或查询失败,可尝试[刷新]"
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
        icon="wap-home"
        icon-position="left"
        @click="onCancel"
        >返回主页
      </van-button>
      <timer-button class="margin" :total="300" ref="RefItimer" size="1.1rem" :finish="onCancel" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import PickerRow from '@/components/Picker/Picker.Row.vue';
import { registReserve } from '@/trans/server';
import { Close, Open } from '@/utils/loading';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { oneOf } from 'vue-types';
import { pushAppHome } from '@/router/router';
import { schedule$cancel } from '@/trans/server/his/register';
import { Dialog } from 'vant';
export default defineComponent({
  name: 'Reserved',
  props: {
    type: oneOf(['预约挂号', '当日挂号']),
  },
  emits: ['budget'],
  components: { PickerRow, TimerButton },
  setup(props, ctx) {
    const state = reactive({
      info: {} as any,
      empty: false,
    });
    onMounted(async () => {
      await onRefresh();
    });
    const onRefresh = async function () {
      Open('');
      state.info = await registReserve();
      if (!state.info || state.info.length === 0) {
        state.empty = true;
      } else {
        state.empty = false;
      }
      console.log(state.empty);
      Close();
    };
    const onCancel = function () {
      pushAppHome();
    };
    const onbudget = async function (Order: any) {
      if (Order.hisOrderno > 0) {
        if (Order.isBreak === 1) {
          Dialog.alert({
            title: '异常',
            message: Order.breakInfo,
            closeOnPopstate: true,
            className: 'mat-vant__dialog',
            theme: 'round-button',
          });
        } else {
          Open('请耐心等待...');
          await ctx.emit('budget', {}, Order.hisOrderno);
        }
      }
      //await onRefresh();
    };
    const onSchedulecancel = async function (scheduleOrderno: number) {
      Dialog.confirm({
        title: '请选择',
        message: '确认取消预约?',
        closeOnPopstate: true,
        className: 'mat-vant__dialog',
        theme: 'round-button',
      })
        .then(async () => {
          Open('');
          if (scheduleOrderno > 0) {
            await schedule$cancel(scheduleOrderno);
          }
          await onRefresh();
          Close();
        })
        .catch(() => {
          return;
        });
    };
    return {
      ...toRefs(props),
      ...toRefs(state),
      onCancel,
      onMounted,
      onRefresh,
      onbudget,
      onSchedulecancel,
    };
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
  background-position: 95% 95% !important;
  background-size: auto 40% !important;
  background-repeat: no-repeat !important;
}

.item {
  padding: 0 0.2rem;
  line-height: 0.6rem;
}

.daystring {
  // color: #fff;
  color: #707070;
  font-weight: bold;
  font-size: 0.35rem;
}

.doctorname {
  color: #707070;
  // color: #fff;
  font-weight: bold;
  font-size: 0.35rem;
}

.doctortitle {
  color: #707070;
  // color: #fff;
}

.registcost {
  font-weight: bold;
}

.danger {
  color: #ff976a;
}

.foot {
  bottom: 0;
  line-height: rem;
  height: 1rem;
  vertical-align: middle;
  text-align: center;
  width: 100%;
}

.button__take {
  height: 0.9rem;
  // border-radius: 1em;
}

.reserved__active {
  height: 2.5rem;
  padding: 3%;
  border-radius: 0.5em;
  background-color: rgba(#fbfbfb);
  -webkit-box-shadow: 0 0 10px rgba(#333, 0.2);
  -moz-box-shadow: 0 0 10px rgba(#333, 0.2);
  box-shadow: 0 0 10px rgba(#333, 0.2);
}

// .reserved__active::after {
//     position: absolute;
//     box-sizing: border-box;
//     content: ' ';
//     pointer-events: none;
//     right: 0;
//     bottom: 0;
//     left: 0;
//     height: 1rem;
//     background-color: rgba(#4F71B0, 0.05);
//     border-radius: 0 0 0.5em 0.5em;
// }

.reserved__inactive {
  height: 2.5rem;
  border-radius: 0.5em;
  padding: 2%;
  background-color: rgba(#4f71b0, 0.1);
  -webkit-box-shadow: 0 0 10px rgba(#333, 0.2);
  -moz-box-shadow: 0 0 10px rgba(#333, 0.2);
  box-shadow: 0 0 10px rgba(#333, 0.2);
}

.reserved__inactive::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1rem;
  background-color: rgba(#4f71b0, 0.1);
  border-radius: 0 0 0.5em 0.5em;
}

.van-graid-content-self /deep/ .van-grid-item__content {
  background-color: transparent;
  padding: 10px 8px;
}

.inactive {
  color: #707070 !important;
}

.lock {
  filter: progid:DXImageTransform.Microsoft.BasicImage(graysale=1);
  -webkit-filter: grayscale(100%);
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
