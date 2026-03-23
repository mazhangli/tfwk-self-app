<template>
  <div class="content flex-c">
    <div class="content flex-r-c margin-rl" v-if="hasPrint === true">
      <div :style="{ width: 'calc(50% - 0.2rem)', height: '100%' }" class="flex-c-c">
        <div class="line flex-r">
          <van-image :src="icon_p" width="0.7rem" />
          <p class="font-l"> {{ patient.patname }}</p>
        </div>
        <p class="header">请勿离开,正在打印...</p>
        <van-circle v-model:current-rate="currentRate" :stroke-width="30" color="#05AFC8" :clockwise="false" size="4rem"
          layer-color="#ebedf0" stroke-linecap="butt">
          <template #default>
            <div class="content flex-c-c">
              <van-image :src="icon" width="2rem" />
              <p class="count">{{ currentPage }} / {{ rate }}</p>
            </div>
          </template>
        </van-circle>
        <div class="flex-r-c"><i class="footer">单据</i>
          <p class="count">{{ rate }}</p><i class="footer">份</i>
        </div>
      </div>
      <div :style="{ width: '0.4rem', height: '100%' }" class="flex-r-c">
        <el-divider direction="vertical"></el-divider>
      </div>
      <div :style="{ width: 'calc(50% - 0.2rem)', height: '100%' }" class="flex-c-c">
        <van-image width="80%" :src="icon_r" fit="contain" />
      </div>
    </div>
    <div class="content__pack flex-r-c mat-empty__description" v-if="hasPrint === false">
      <van-empty :image="empty" description="没有可打印的单据" image-size="5rem" />
    </div>
    <div class="content__foot flex-r-3" v-if="hasPrint === false">
      <van-button v-preventReClick="2000" class="btn-size-small font-s margin" type="primary" icon="replay"
        icon-position="left" @click="onRefresh(0)">刷&nbsp;&nbsp;&nbsp;&nbsp;新
      </van-button>
      <van-button v-preventReClick="2000" class="btn-size-small font-s margin" type="primary" icon="wap-home"
        icon-position="left" @click="onQuit">返回主页
      </van-button>
      <timer-button :total="hasPrint === false ? 50 : 30" class="margin" ref="RefItimer" size="1.1rem" :finish="onQuit" />
    </div>
  </div>
  <!-- <van-dialog v-model:show="show" title=" " theme="round-button" width="12rem" overlayClass="van-overlay-white">
    <div :style="{height: '9rem'}">
        <picker-row :finished="true">
            <van-image v-for="(item, index) in preview" :key="index" :src="item" />
        </picker-row>
    </div>
</van-dialog> -->

<range-select :from="true" :show="show" @select="onSelect" />
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
  import PickerRow from '@/components/Picker/Picker.Row.vue';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { appRouteEnum, pushAppHome, pushRouteWithParam } from '@/router/router';
  import { Close, Open } from '@/utils/loading';
  import {
    prescription$list,
    prescription$list$range,
    prescription$state,
  } from '@/trans/server/his/prescription';
  import { Dialog } from 'vant';
  import { callDriver, DeviceEnum, MethodEnum } from '@/trans/driver';
  import { getStore, setStore } from '@/utils/cache/storage';
  import { Info } from '@/trans/server/self/logger';
  import { speak } from '@/trans/driver/src/speech';
  import { imagePrint } from '@/trans/driver/src/printer';
  import RangeSelect from '@/views/terminal/Report/RangeSelect.vue';

  export default defineComponent({
    name: 'MedicalRest',
    props: {},
    emits: [],
    components: { TimerButton, PickerRow, RangeSelect },
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
        hasPrint: false,
        empty: null as any,
        finished: null as any,
        unfinished: null as any,
        consult: null as any,
        reader: null as any,
        sheets: null as any,
        show: false,
        preview: [] as any[],
      });
      const gradientColor = {
        '0%': '#3fecff',
        '100%': '#6149f6',
      };
      onBeforeMount(() => {
        state.patient = getStore('history');
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
        await onRefresh(0);
      });
      const onSelect = async function (range: number) {
        state.show = false;
        console.log('select');
        if (range === 0) {
          onQuit();
          return;
        }
        await onRefresh(range);
      };
      const onRefresh = async function (range: number) {
        Open('');
        state.currentRate = 100;
        state.rate = 0;
        state.papers = 0;
        state.sheets = [];
        state.preview = [];
        var val = await prescription$list$range(range);
        if (val && range === 0 && val.hasMore === true) {
          state.show = true;
          console.log('弹出');
          Close();
          return;
        }
        state.sheets = val.sheets;
        if (!state.sheets || state.sheets.length === 0) {
          speak('没有可打印的单据');
          state.hasInfo = false;
        } else {
          state.hasInfo = true;
          // for (let sheet of state.sheets) {
          // if (sheet.state === "1") {
          //     state.rate++;
          //     state.hasPrint = true;
          //     sheet.images = await report$lis$view(sheet.id);
          //     if (!sheet.images) {
          //         await onCancel(false);
          //         return;
          //     }
          //     for (let item of sheet.images) {
          //         state.preview.push("data:image/gif;base64," + item);
          //         state.papers++;
          //     }
          // } else {
          //     sheet.images = [];
          // }
          // }
          for (let sheet of state.sheets) {
            state.rate++;
            state.hasPrint = true;
          }
          if (state.hasPrint === false) {
            speak('没有可打印的单据');
          } else {
            onPrint();
          }
        }
        Close();
        console.log('state.currentRate:' + state.currentRate);
        console.log('state.papers:' + state.papers);
        console.log('state.rate:' + state.rate);
      };
      const onClick = function (sheet: any) {
        // state.preview = [];
        // for (let item of sheet.images) {
        //     state.preview.push("data:image/gif;base64," + item);
        // }
        // state.show = true;
      };
      const onPrint = async function () {
        try {
          var Count = 0;
          state.currentPage = 1;
          for (let item of state.sheets) {
            Count++;
            if (item.imgUrl && item.imgUrl.length > 0) {
              var images = [];
              images.push(item.imgUrl as string);
              var r = await imagePrint({ Images: images, IsUrl: true });
              if (r === null) {
                await Info('report.print', 'faild', '0');
              } else {
                await prescription$state(item.id, item.type);
                await Info('report.print', 'scucess', String(images.length));
                state.currentPage++;
                state.currentRate = ((state.papers - state.currentPage) / state.papers) * 100;
                //重新判断打印机耗材
                if (Count < state.sheets.length) {
                  let sta = await callDriver(DeviceEnum.PRINTER, MethodEnum.STATE, {});
                  if (!sta) {
                    speak('打印机状态异常,请前往其他设备打印');
                    Close();
                    await onCancel(false);
                    return;
                  } else {
                    setStore('reportPrinter', { state: 'ready', info: '正常状态' });
                  }
                }
              }
            }
          }
          await onCancel(true);
        } catch (error) {
          console.log(error);
          await onCancel(false);
        }
      };

      const onCancel = async function (state: boolean) {
        //await pushAppHome();
        if (state === true) {
          speak('请取走单据,并核对数量');
          await pushRouteWithParam(appRouteEnum.CompleteS, {
            state: 'success',
            description: ['打印已完成,请取走单据'],
          });
        } else {
          speak('打印失败,即将返回首页');
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
        onRefresh,
        onClick,
        onPrint,
        onQuit,
        onSelect,
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

// .margin-rl p {
//     font-size: 0.33rem;
//     font-weight: bold;
// }

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
</style>
