<template>
  <van-dialog
    v-model:show="show"
    title="请核对信息"
    theme="round-button"
    confirmButtonColor="linear-gradient(to right,#1989fa,#63AEF9)"
    :overlay="true"
    cancelButtonColor="linear-gradient(to right,#B3BBB7,gray)"
    showCancelButton
    width="8rem"
    overlayClass="van-overlay-white"
  >
    <div class="flex-c">
      <div class="info__context">
        <van-cell-group inset class="title__sub">
          <van-cell
            title-class="cell__title doctortitle"
            value-class="cell__value doctor"
            :title="model.doctorTitle"
            :value="model.doctorName"
          />
          <van-cell
            title-class="cell__title"
            value-class="cell__value"
            title="科室"
            :value="model.branchName"
          />
          <van-cell
            title-class="cell__title"
            value-class="cell__value"
            title="就诊时间"
            :value="model.registDate + model.timeSpan"
          />
          <!-- <van-cell title-class="cell__title" value-class="cell__value" title="就诊人:" :value="model.patientName" /> -->
          <van-cell
            title-class="cell__title"
            value-class="cell__value"
            title="总费用"
            :value="model.allCost"
          />
          <van-cell
            title-class="cell__title"
            value-class="cell__value"
            title="实时报销"
            :value="model.pubCost"
          />
          <van-cell
            title-class="cell__title"
            value-class="cell__value discount"
            title="减免金额"
            :value="model.disCost"
          />
          <van-cell
            title-class="cell__title topay"
            value-class="cell__value paycost"
            title="支付金额"
            :value="model.payCost"
          />
        </van-cell-group>
      </div>
    </div>
  </van-dialog>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
  import { oneOf } from 'vue-types';
  import Payoff from '@/views/terminal/Interface/Payoff/Payoff.vue';
  export default defineComponent({
    name: 'RegistInfo',
    props: {
      type: oneOf(['当日挂号', '预约挂号', '预约取号']),
      show: Boolean,
      info: {} as any,
    },
    components: { Payoff },
    setup(props) {
      const state = {
        model: {
          hisOrderno: '431501',
          historyId: '010000175',
          patientName: '王洪卫',
          doctorName: '普通号',
          branchName: '咳嗽门诊',
          branchSite: '四层',
          doctorTitle: '医生',
          registClass: '',
          registDate: '2021-06-30',
          timeSpan: '上午',
          theOrder: '10',
          allCost: '0.00',
          pubCost: '0.00',
          disCost: '0.00',
          payCost: '0.00',
          registId: '',
          insInner: '',
          thirdOrderNo: '',
          printContent: '',
        },
      };
      return { ...toRefs(state) };
    },
  });
</script>

<style lang="less" scoped>
  .info__context {
    padding: 5%;
    width: 8rem;
    height: 6rem;
  }

  .register__payoff {
    width: 100%;
    height: 1.2rem;
  }

  /deep/.cell__title {
      width: 1rem;
      text-align-last: justify;
    text-align: left;
    color: #333;
  }

  /deep/.cell__value {
    text-align: right;

    span {
      color: #1989fa;
    }
  }

  /deep/.van-cell-group__title {
    font-size: 0.35rem;
    font-weight: bold;
    line-height: 0.7rem;
    padding: 16px 16px 16px;
    color: #333 !important;
    text-align: center;
    vertical-align: middle;
  }

  /deep/ .van-cell {
    background-color: transparent;
    font-size: 0.3rem;
    padding: 2% 1%;
  }

  /deep/.van-cell-group {
    background-color: rgba(#fcfcfc, 0.4);
  }

  /deep/.doctortitle span {
    font-size: 0.45rem !important;
    font-weight: bold;
  }

  /deep/.doctor span {
    font-size: 0.45rem !important;
    color: #1989fa;
    font-weight: bold;
  }

  /deep/ .discount span {
    opacity: 0.7;
    //color: gray;
    text-decoration: line-through;
  }

  /deep/ .paycost span {
    //font-size: 0.35rem !important;
    font-weight: bolder;
    color: orangered !important;
  }

  /deep/ .topay span {
    //font-size: 0.35rem !important;
    color: orangered !important;
  }
  /deep/.van-cell::after{
      border:none;
  }
  /deep/[class*='van-hairline']::after{
      border:none;
  }
  /deep/.van-cell__title span{
width: 1rem;
  }
</style>
