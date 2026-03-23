<template>
  <div class="content flex-c">
    <div class="content__pack flex-r-c margin-rl" v-if="hasPrint === true" id="nucleicinvoking" name="nucleicinvoking">
      <div :style="{ width: 'calc(100% - 0.2rem)', height: '100%' }" class="flex-c-c">
        <div class="content__nav flex-r-s">
          <div class="flex-r">
            <van-icon name="contact" color="#1989fa" size="0.7rem" />
            <p class="font-l"> {{ patient.patname }}</p>
          </div>
          <div class="flex-r">
            <van-icon name="idcard" color="#1989fa" size="0.7rem" />
            <p class="font-l" :style="{ float: 'right' }"> 证件号:{{ patient.idcard }}</p>
          </div>
        </div>
        <div class="content__pack flex-c-c">
          <p class="header">请勿离开,正在处理业务...</p>
          <van-image width="80%" height="calc(100% - 1rem)" :src="invoking" fit="contain" />
        </div>
      </div>
    </div>
    <div class="content__pack flex-r-c mat-empty__description" v-if="hasPrint === false">
      <van-empty :image="empty" description="业务无法继续处理" image-size="5rem" />
    </div>
    <div class="content__foot flex-r-3" v-if="hasPrint === true">
      <!-- <van-button v-preventReClick="2000" class="btn-size-small font-s margin" type="primary" icon="replay" icon-position="left" @click="onRefresh">刷&nbsp;&nbsp;&nbsp;&nbsp;新
        </van-button> -->
      <van-button v-preventReClick="2000" class="btn-size-normal btn__foot font-s margin" type="primary" icon="wap-home"
        icon-position="left" @click="onQuit">返回主页
      </van-button>
      <timer-button :total="300" class="margin" ref="RefItimer" size="1.1rem" :finish="onQuit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import PickerRow from '@/components/Picker/Picker.Row.vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import CapinfoBarcode from '@/views/terminal/Home/MediaPad/Capinfo/Capinfo.QR.vue';
import { appRouteEnum, pushAppHome, pushRouteWithParam } from '@/router/router';
import { Close } from '@/utils/loading';
import { getStore } from '@/utils/cache/storage';

import { using$1 } from '@/trans/using';
import { speak } from '@/trans/driver/src/speech';

export default defineComponent({
  name: 'Automaton',
  props: {},
  emits: [],
  components: { TimerButton, PickerRow, CapinfoBarcode },
  setup(props, ctx) {
    const state = reactive({
      rate: 0,
      currentRate: 0,
      currentPage: 1,
      papers: 0,
      icon: null as any,
      icon_r: null as any,
      icon_p: null as any,
      patient: null as any,
      hasInfo: false,
      hasPrint: true,
      empty: null as any,
      finished: null as any,
      unfinished: null as any,
      consult: null as any,
      reader: null as any,
      sheets: null as any,
      show: false,
      preview: [] as any[],
      invoking: null as any,
      menuCode: '',
    });
    const gradientColor = {
      '0%': '#3fecff',
      '100%': '#6149f6',
    };
    onBeforeMount(async () => {
      state.patient = getStore('history'); //{ patname: '马*涛', idcard: '130184***2252' }; //
      console.log(JSON.stringify(state.patient));
    });
    onMounted(async () => {
      state.hasInfo = false;
      state.icon = require('@/assets/svg/lab.report.svg');
      state.icon_p = require('@/assets/svg/patient.svg');
      state.icon_r = require('@/assets/img/gif/report.gif');
      state.empty = require('@/assets/svg/report.none.svg');
      state.finished = require('@/assets/svg/report.lis.finished.svg');
      state.unfinished = require('@/assets/svg/report.lis.unfinished.svg');
      state.consult = require('@/assets/svg/report.lis.consult.svg');
      state.reader = require('@/assets/svg/report.read.svg');
      state.invoking = require('@/assets/video/handling.gif');
      Close();
      await onDone();
    });
    const onDone = async function () {
      state.menuCode = getStore('last').menuCode;

      var res = await using$1(state.menuCode);
      if (res === true) onCancel(true);
      else onCancel(false);
    };

    const onCancel = async function (state: boolean) {
      //await pushAppHome();
      if (state === true) {
        await speak('请取走单据,并核对数量');
        await pushRouteWithParam(appRouteEnum.CompleteS, {
          state: 'success',
          description: ['打印已完成,请取走单据'],
        });
      } else {
        await speak('打印失败,即将返回首页');
        await pushRouteWithParam(appRouteEnum.CompleteS, {
          state: 'faild',
          description: ['打印失败,即将返回首页', '可前往其他设备打印', '或联系现场工作人员协助'],
        });
      }
    };
    const onQuit = async function () {
      await pushAppHome();
    };

    return {
      ...toRefs(state),
      gradientColor,
      onCancel,
      onDone,
      onQuit,
    };
  },
});
</script>

<style lang="less" scoped>
.mat-empty__description /deep/ .van-empty__description {
  font-size: 0.34rem;
}

.content__picker {
  padding-right: 10%;
  padding-left: 10%;
}

.van-cell__title {
  margin-bottom: 0.1rem;
  //padding-right: 1.5rem;
  padding-left: 1.5rem;
}

.van-cell__mat {
  margin-bottom: 0.2rem;
}

.margin-rl {
  padding-left: 5%;
  padding-right: 5%;
}

.line {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
}

.title {
  width: 100%;
  height: 1.3rem;
  line-height: 1.3rem;
  vertical-align: middle;
  text-align: center;
  font-size: 0.34rem;
  font-weight: blod;
}

.unfinished {
  -webkit-box-shadow: 5px 5px 10px 0px #f2990d !important;
  -moz-box-shadow: 5px 5px 10px 0px #f2990d !important;
  box-shadow: 5px 5px 10px 0px #f2990d !important;
}

.header {
  color: coral;
  font-size: 0.4rem;
  font-weight: bolder;
  line-height: 2rem;
  height: 2rem;
  vertical-align: middle;
}

.footer {
  color: coral;
  font-size: 0.4rem;
  font-weight: bolder;
  line-height: 1rem;
  height: 1rem;
  vertical-align: middle;
}

.count {
  color: #05afc8;
  font-size: 0.4rem;
}

.consult {
  -webkit-box-shadow: 5px 5px 10px 0px rgb(26, 158, 182) !important;
  -moz-box-shadow: 5px 5px 10px 0px rgb(26, 158, 182) !important;
  box-shadow: 5px 5px 10px 0px rgb(26, 158, 182) !important;
}

.lab {
  text-align: center;

  p {
    text-align: center;
  }

  &__name {
    flex-basis: 40%;
  }

  &__date {
    flex-basis: 20%;
  }

  &__lab {
    flex-basis: 20%;
  }
}

.margin {
  margin-left: 0.2rem;
}

.content__pad {
  width: 100%;
  height: max-content;
  background: #ffffff;
}
</style>
