<template>
  <div class="patientpad flexbox justify-start flexbox-col">
    <span class="label" :style="{ 'margin-left': '0.4rem' }">
      <van-icon name="user-circle-o" size="1.2rem" color="#5e5f61" />
      <span class="patientName font-xl bloder" v-if="type === 'mz'">{{ info.patname }}</span>
      <span class="patientName font-xl bloder" v-if="type === 'zy'">{{ info.patientName }}</span>
    </span>
    <el-divider
      style="
        background-image: linear-gradient(
          to right,
          rgba(27, 122, 186, 0),
          rgba(27, 122, 186, 1),
          rgba(27, 122, 186, 0)
        );
        height: 2px;
        width: 95%;
      "
      dashed
    ></el-divider>
    <span class="label" v-if="type === 'mz'">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">病历号</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis">{{ info.historyid }}</span>
    </span>
    <span class="label" v-if="type === 'zy'">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">病案号</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis">{{ info.patientid }}</span>
    </span>
    <span class="label">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">性别</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis">{{ info.sex }}</span>
    </span>
    <span class="label">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">出生日期</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis">{{ info.birthday }}</span>
    </span>
    <span class="label">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">身份证</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis">{{ identity }}</span>
    </span>
    <span class="label">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">{{
        info.patcard.length === 12 ? '医保应用' : '登录账号'
      }}</span
      ><i class="label-colon card">:</i>
      <span class="font-m label-item van-ellipsis">{{ info.patcard }}</span>
    </span>
    <span class="label" v-if="type === 'mz'">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">定点医院</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis">是定点医院</span>
    </span>
    <span class="label" v-if="type === 'mz' && isins === true">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">红名单</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis">{{
        isinredList ? '在红名单内' : '不在红名单内,无法实时报销'
      }}</span>
    </span>
    <span class="label" v-if="info.signdoctor && info.signdoctor != ''">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">已签约医生</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis balance">{{ issign }}</span>
    </span>
    <span class="label" v-if="info.signdoctorname && info.signdoctorname != ''">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">签约医生</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis balance">{{ info.signdoctorname }}</span>
    </span>
    <span class="label" v-if="type === 'mz'">
      <van-icon name="balance-pay" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">账户余额</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis balance">¥{{ balance }}</span>
    </span>
    <span class="label" v-if="type === 'zy'">
      <van-icon name="balance-pay" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">押金余额</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis balance">¥{{ balance }}</span>
    </span>
    <span class="label" v-if="type === 'zy'">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">入院日期</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis">{{ info.indate }}</span>
    </span>
    <span class="label" v-if="type === 'zy'">
      <van-icon name="label-o" size="0.5rem" color="#1989fa" :style="{ padding: '0.03rem' }" />
      <span class="label-form van-ellipsis">住院科别</span><i class="label-colon">:</i>
      <span class="font-m label-item van-ellipsis">{{ info.branchName }}</span>
    </span>
  </div>
</template>

<script lang="ts">
  import AppLabel from '@/components/Label/AppLabel.vue';
  import { getStore } from '@/utils/cache/storage';
  import {
    computed,
    defineComponent,
    onBeforeMount,
    onMounted,
    reactive,
    ref,
    toRef,
    toRefs,
  } from 'vue';
  export default defineComponent({
    name: 'AppPatient',
    props: {
      type: {
        type: String,
        default: 'mz',
      },
    },
    components: { AppLabel },
    setup(props) {
      const state = reactive({
        info: null as any,
        identity: '',
        cardno: '',
        balance: '',
        issign: '',
        isins: false,
        isinredList: false,
      });
      onBeforeMount(() => {
        if (props.type === 'zy') state.info = getStore('patient');
        else state.info = getStore('history');
        if (getStore('media').type && getStore('media').type === '医保卡') state.isins = true;
        state.balance = state.info.balance.toFixed(2);
        if (state.info.idcard && state.info.idcard.length > 10) {
          state.identity =
            state.info.idcard.substring(0, 3) +
            '***' +
            state.info.idcard.substring(state.info.idcard.length - 4);
        }
        if (state.info.signdoctor && state.info.signdoctor != '') {
          state.issign = '是';
        } else {
          state.issign = '否';
        }
        state.isinredList = state.info.isinredList === 'true';
      });
      onMounted(() => {});
      return { ...toRefs(state) };
    },
  });
</script>

<style lang="less" scoped>
  .patientpad {
    padding-left: 0.1rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    -webkit-font-smoothing: antialiased;
  }

  .patientName {
    vertical-align: baseline;
    font-style: italic;
    color: #5e5f61;
    -webkit-font-smoothing: antialiased;
  }

  .label {
    width: 100%;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    padding: 0.1rem 0.01rem;

    &-form {
      width: 1.3rem;
      text-align-last: justify;
      text-align: center;
      opacity: 0.8;
      -webkit-font-smoothing: antialiased;
    }

    &-colon {
      -webkit-font-smoothing: antialiased;
      width: 0.2rem;
      text-align: center;
      font-size: 0.37rem;
      opacity: 0.7;
    }

    &-item {
      -webkit-font-smoothing: antialiased;
      font-size: 0.35rem;
      font-weight: 300;
      color: #5e5f61;
      text-shadow: 1px 0px 0px #5e5f61;
    }

    .balance {
      color: red;
    }

    .card {
      font-size: 0.28rem;
    }
  }
</style>
