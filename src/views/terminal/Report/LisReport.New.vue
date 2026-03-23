<template>
  <div class="content flex-c">
    <div class="content__pack flex-center" v-if="!printing">
      <div class="content content__picker" v-if="hasInfo === true">
        <div class="content__nav flex-r-s">
          <van-button
            type="primary"
            size="large"
            round
            :plain="range === 0 ? false : true"
            @click="onRefresh('unfinish')"
            >未完成</van-button
          >
          <van-button
            type="primary"
            size="large"
            round
            :plain="range === 1 ? false : true"
            @click="onRefresh('week')"
            >7天内</van-button
          >
          <van-button
            type="primary"
            size="large"
            round
            :plain="range === 2 ? false : true"
            @click="onRefresh('onemonth')"
            >一个月</van-button
          >
          <van-button
            type="primary"
            size="large"
            round
            :plain="range === 3 ? false : true"
            @click="onRefresh('threemonth')"
            >三个月</van-button
          >
        </div>
        <div class="title font-l blod">
          可打印报告单<span class="font-xl bloder">{{ count__sheet("1") }}</span
          >份 /
          <span class="font-m"
            >未完成报告单<span class="font-l blod">{{ count__sheet("2") }}</span
            >份</span
          >
          /
          <span class="font-m"
            >请前往检验科咨询打印<span class="font-l blod">{{ count__sheet("3") }}</span
            >份</span
          >>
        </div>

        <picker-row
          :style="{ height: 'calc( 100% - 2.3rem)' }"
          :finished="true"
          lineHeight="1.3rem"
        >
          <van-cell :center="true" class="van-cell__title">
            <template #default>
              <div class="flex-r-c">
                <div class="lab lab__name van-multi-ellipsis--l2">检验项目</div>
                <div class="lab lab__date van-multi-ellipsis--l2">标本时间</div>
                <!-- <div class="lab lab__lab van-multi-ellipsis--l2">检验室</div> -->
                <div class="lab lab__date van-multi-ellipsis--l2">报告完成时间</div>
              </div>
            </template>
          </van-cell>
          <van-cell
            v-for="(item, index) in sheets"
            :key="index"
            :center="true"
            :class="
              item.state === '已打印'
                ? ['van-cell__mat']
                : item.state === '未完成'
                ? ['van-cell__mat', 'unfinished']
                : ['van-cell__mat', 'consult']
            "
          >
            <template #icon>
              <span style="width: 2rem; height: 100%" class="flex-c-c">
                <van-checkbox
                  v-model="item.checked"
                  shape="square"
                  @click="beforeChange(item)"
                  :disabled="item.state === '未完成'"
                />
              </span>
            </template>
            <template #default>
              <van-cell @click="onClick(item)" :key="index" :center="true">
                <template #icon>
                  <van-image
                    :src="finished"
                    width="1rem"
                    height="1rem"
                    v-if="item.state === '已打印'"
                  />
                  
                  <van-image
                    :src="unfinished"
                    width="1rem"
                    height="1rem"
                    v-if="item.state === '未打印'"
                  />

                  <van-image 
                    :src="consult" 
                    width="1rem" 
                    height="1rem" 
                    v-if="item.state === '未完成'" />
                </template>
                <template #default>
                  <div class="flex-r-c">
                    <p class="lab__name van-multi-ellipsis--l2">{{ item.itemName }}</p>
                    <p class="lab lab__date van-multi-ellipsis--l2">
                      {{ item.samplingDate }}
                    </p>
                    <p
                      class="lab lab__date van-multi-ellipsis--l2"
                      v-if="item.commitDate"
                    >
                      {{ item.commitDate }}
                    </p>
                    <p
                      class="lab lab__date van-multi-ellipsis--l2 bloder"
                      style="font-style: italic; color: rgb(63, 63, 63)"
                      v-if="!item.commitDate"
                    >
                      未完成
                    </p>
                  </div>
                </template>
              </van-cell>
            </template>
          </van-cell>
        </picker-row>
      </div>
      <div class="content flex-r-c mat-empty__description" v-if="hasInfo === false">
        <van-empty :image="empty" description="暂无可打印化验单" image-size="5rem" />
      </div>
    </div>
    <div class="content__pack flex_center" v-if="printing">
      <div class="content flex-r-c margin-rl">
        <div :style="{ width: 'calc(50% - 0.2rem)', height: '100%' }" class="flex-c-c">
          <div class="line flex-r">
            <van-image :src="require('@/assets/svg/patient.svg')" width="2rem" />
            <p class="font-xl bloder">{{ patient.patname }}</p>
          </div>
          <p class="header">请勿离开,正在打印...</p>
          <van-circle
            v-model:current-rate="currentRate"
            :stroke-width="60"
            :color="{
              '0%': '#3fecff',
              '100%': '#6149f6',
            }"
            :clockwise="false"
            size="4rem"
            layer-color="#ebedf0"
            stroke-linecap="butt"
          >
            <template #default>
              <div class="content flex-c-c">
                <van-image :src="require('@/assets/svg/lab.report.svg')" width="2rem" />
                <p class="count">{{ currentPage }} / {{ papers }}</p>
              </div>
            </template>
          </van-circle>
          <div class="flex-r-c">
            <i class="footer">共</i>
            <p class="count">{{ rate }}</p>
            <i class="footer">份报告,共需打印</i>
            <p class="count">{{ papers }}</p>
            <i class="footer">页</i>
          </div>
        </div>
        <div :style="{ width: '0.4rem', height: '100%' }" class="flex-r-c">
          <el-divider direction="vertical"></el-divider>
        </div>
        <div :style="{ width: 'calc(50% - 0.2rem)', height: '100%' }" class="flex-c-c">
          <van-image
            width="60%"
            :src="require('@/assets/img/gif/report.gif')"
            fit="contain"
          />
        </div>
      </div>
    </div>
    <div class="content__foot flex-r-3" v-if="!printing">
      <van-button
        v-if="hospital != 'bjftyy'"
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="replay"
        icon-position="left"
        @click="onPrint"
        >打&nbsp;&nbsp;&nbsp;&nbsp;印
      </van-button>
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="replay"
        icon-position="left"
        @click="onRefresh('week')"
        >刷&nbsp;&nbsp;&nbsp;&nbsp;新
      </van-button>
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="wap-home"
        icon-position="left"
        @click="onCancel"
        >主&nbsp;&nbsp;&nbsp;&nbsp;页
      </van-button>
      <timer-button
        :total="timer"
        class="margin"
        ref="RefItimer"
        size="1.1rem"
        :finish="onCancel"
      />
    </div>
  </div>
  <van-dialog
    v-model:show="show"
    title=" "
    theme="round-button"
    width="50vw"
    overlayClass="van-overlay-white"
  >
    <div :style="{ height: '12rem' }">
      <picker-row :finished="true">
        <van-image v-for="(item, index) in preview" :key="index" :src="item" />
      </picker-row>
    </div>
  </van-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRaw, toRefs } from "vue";
import PickerRow from "@/components/Picker/Picker.Row.vue";
import TimerButton from "@/components/terminal/button/TimerButton.vue";
import { appRouteEnum, pushAppHome, pushRouteWithParam } from "@/router/router";
import { Close, Open } from "@/utils/loading";
import {
  report$lis,
  report$lis$range,
  report$lis$state,
  report$lis$view,
} from "@/trans/server/his/report";
import { Dialog, Toast } from "vant";
import { imagePrint, print } from "@/trans/driver/src/printer";
import { getStore } from "@/utils/cache/storage";
import { AnyColumn } from "element-plus/es/components/table-v2/src/common";
import { speak } from "@/trans/driver/src/speech";

export default defineComponent({
  name: "LisReport",
  props: {},
  emits: [],
  components: { TimerButton, PickerRow },
  setup(props, ctx) {
    const state = reactive({
      timer: 300,
      hasInfo: false,
      empty: null as any,
      finished: null as any,
      unfinished: null as any,
      consult: null as any,
      reader: null as any,
      sheets: null as any,
      show: false,
      preview: [] as any[],
      hospital: "",
      range: 1,
      printing: false,
      patient: null as any,
      currentRate: 0,
      currentPage: 1,
      papers: 0,
      rate: 0,
      images: [] as any[],
    });

    onMounted(async () => {
      state.hospital = getStore("machine").hospitalcode;
      state.hasInfo = false;
      state.empty = require("@/assets/svg/report.none.svg");
      state.finished = require("@/assets/svg/report.lis.finished.svg");
      state.unfinished = require("@/assets/svg/report.lis.unfinished.svg");
      state.consult = require("@/assets/svg/report.lis.consult.svg");
      state.reader = require("@/assets/svg/report.read.svg");
      state.patient = getStore("history");
      await onRefresh();
    });
    const onCancel = async function () {
      await pushAppHome();
    };
    const onRefresh = async function (range?: string) {
      Open("");
      if (!range) range = "week";
      state.range =
        range === "unfinish" ? 0 : range === "week" ? 1 : range === "onemonth" ? 2 : 3;
      if (range === "unfinish") {
        state.sheets = state.sheets.filter(function (item: any) {
          return item.state === "未完成";
        });
      } else {
        state.sheets = [];
        state.sheets = await report$lis$range(range);
        for (let item of state.sheets) {
          item.checked = item.state === "未打印";
        }
      }
      state.hasInfo = true;
      Close();
    };
    const count__sheet = function (st: string) {
      var m = state.sheets.filter(function (item: any) {
        switch (st) {
          case "1":
            return item.state != "未完成";
          case "2":
            return item.state === "未完成";
        }
      });
      if (m) {
        return m.length;
      } else {
        return 0;
      }
    };
    const onClick = async function (sheet: any) {
      Open("正在下载报告单...");
      if (sheet.state != "未完成") sheet.images = await report$lis$view(sheet.id);
      if (sheet.images.length > 0) {
        state.preview = [];
        for (let item of sheet.images) {
          state.preview.push("data:image/gif;base64," + item);
        }
        state.show = true;
      } else {
        Dialog.alert({
          title: "无法打印",
          message: "此检验单未完成,无法预览;无法打印",
          theme: "round-button",
          closeOnPopstate: true,
          className: "mat-vant__dialog",
        });
      }
      Close();
    };
    const onPrint = async function () {
      state.timer = 300;
      Open("正在下载图片...");
      state.papers = 0;
      state.rate = 0;
      var m = state.sheets.filter(function (item: any) {
        return item.checked;
      });

      for (let item of m) {
        state.rate++;
        item.images = await report$lis$view(item.id);
        state.papers += item.images.length;
      }
      Close();
      state.printing = true;
      state.currentPage = 0;
      for (let item of m) {
        speak("正在打印,请勿离开");
        state.currentRate = ((state.papers - state.currentPage) / state.rate) * 100;
        console.log(state.currentRate, state.rate, state.currentPage);
        state.currentPage += item.images.length;
        var r = await imagePrint({ Images: item.images, IsUrl: false });
        if (r === null) {
        } else {
          await report$lis$state(item.id);
        }
      }
      state.timer = 10;
      state.printing = false;
      //speak("打印完成,请取走报告单,并核对数量");
      await pushRouteWithParam(appRouteEnum.CompleteS, {
        state: "success",
        description: ["打印已完成,请取走报告单"],
      });
      // setTimeout(async () => {
      //   await onRefresh();
      // }, 2000);
    };

    const beforeChange = function (sheet: any) {
      if (sheet.state === "未完成") {
        speak("未完成报告单不允许打印!");

        Toast.loading({
          forbidClick: true,
          message: "未完成报告单不允许打印!",
          className: "mat_vant__toast",
          icon: require("@/assets/toast.mat.svg"),
          duration: 2500,
          overlay: true,
        });
      }
    };
    return {
      ...toRefs(state),
      onCancel,
      onRefresh,
      count__sheet,
      onClick,
      onPrint,
      beforeChange,
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

.title {
  width: 100%;
  height: 1.3rem;
  line-height: 1.3rem;
  vertical-align: middle;
  text-align: center;
}
.header {
  color: coral;
  font-size: 0.5rem;
  line-height: 2rem;
  height: 2rem;
  vertical-align: middle;
}

.footer {
  color: coral;
  font-size: 0.5rem;
  line-height: 1rem;
  height: 1rem;
  vertical-align: middle;
}

.count {
  color: #05afc8;
  font-size: 0.7rem;
}

.unfinished {
  -webkit-box-shadow: 5px 5px 10px 0px #f2990d !important;
  -moz-box-shadow: 5px 5px 10px 0px #f2990d !important;
  box-shadow: 5px 5px 10px 0px #f2990d !important;
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

/deep/ .van-checkbox__icon {
  font-size: 0.7rem;
}
</style>
