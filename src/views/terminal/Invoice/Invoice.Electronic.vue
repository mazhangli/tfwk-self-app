<template>
  <div class="content flex-c">
    <div class="content__pack flex-center" v-if="!printing">
      <div class="content content__picker" v-if="hasInfo === true">
        <div class="content__nav flex-r-s">
          <van-button type="primary" color="#1BBC9B" size="large" round :plain="range === '0' ? false : true"
            @click="onRefresh('0')">未打印</van-button>
          <van-button type="primary" color="#1396D6" size="large" round :plain="range === '3' ? false : true"
            @click="onRefresh('3')">3天内</van-button>
          <van-button type="primary" color="#1396D6" size="large" round :plain="range === '7' ? false : true"
            @click="onRefresh('7')">7天内</van-button>
          <van-button type="primary" color="#1396D6" size="large" round :plain="range === '30' ? false : true"
            @click="onRefresh('30')">30天内</van-button>
        </div>
        <div class="title font-l blod">
          未打印发票<span class="font-xl bloder">{{ count__sheet('1') }}</span>张 /
          <span class="font-m">共<span class="font-l blod">{{ count__sheet('2') }}</span>张</span>
        </div>

        <picker-row :style="{ height: 'calc( 100% - 2.3rem)' }" :finished="true" lineHeight="1.3rem">
          <van-cell :center="true" class="van-cell__title">
            <template #default>
              <div class="flex-r-c">
                <div class="lab lab__type van-multi-ellipsis--l2">业务类别</div>
                <div class="lab lab__time van-multi-ellipsis--l2">交易时间</div>
                <div class="lab lab__cost van-multi-ellipsis--l2">支付金额</div>
                <div class="lab lab__cost van-multi-ellipsis--l2">基金支付</div>
                <div class="lab lab__cost van-multi-ellipsis--l2">现金支付</div>
                <div class="lab lab__cost van-multi-ellipsis--l2">账户支付</div>
                <div class="lab lab__ins van-multi-ellipsis--l2">医保结算</div>
                <div class="lab lab__time van-multi-ellipsis--l2">打印时间</div>
              </div>
            </template>
          </van-cell>
          <van-cell v-for="(item, index) in sheets" :key="index" :center="true"
            :class="item.printTime ? ['van-cell__mat'] : ['van-cell__mat', 'unfinished']">
            <template #icon>
              <span style="width: 2rem; height: 100%" class="flex-c-c">
                <van-checkbox v-model="item.checked" shape="square" @click="beforeChange(item)" />
              </span>
            </template>
            <template #default>
              <van-cell :key="index" :center="true">
                <template #icon>
                  <!-- <van-image :src="finished" width="1rem" height="1rem" v-if="item.printTime" />
                  <van-image :src="unfinished" width="1rem" height="1rem" v-if="!item.printTime" /> -->
                  <van-image :src="regist" width="1rem" height="1rem" v-if="item.type === '00'" />

                  <van-image :src="payment" width="1rem" height="1rem" v-if="item.type === '10'" />
                  <p class="lab__name van-multi-ellipsis--l2">{{
                    item.type === '00' ? '挂号' : '缴费'
                    }}</p>
                </template>
                <template #default>
                  <div class="flex-r-c">
                    <p class="lab lab__time van-multi-ellipsis--l2">
                      {{ item.payTime }}
                    </p>
                    <p class="lab lab__cost van-multi-ellipsis--l2"> ¥{{ item.payCost }} </p>
                    <p class="lab lab__cost van-multi-ellipsis--l2"> ¥{{ item.allCost }} </p>
                    <p class="lab lab__cost van-multi-ellipsis--l2"> ¥{{ item.pubCost }} </p>
                    <p class="lab lab__cost van-multi-ellipsis--l2"> ¥{{ item.cardCost }} </p>
                    <p class="lab lab__ins van-multi-ellipsis--l2" style="color: red">
                      {{ item.insState }}
                    </p>
                    <p class="lab lab__time van-multi-ellipsis--l2" v-if="item.printTime">
                      {{ item.printTime }}
                    </p>
                    <p class="lab lab__time van-multi-ellipsis--l2 bloder"
                      style="font-style: italic; color: rgb(63, 63, 63)" v-if="!item.printTime">
                      未打印
                    </p>
                  </div>
                </template>
              </van-cell>
            </template>
          </van-cell>
        </picker-row>
      </div>
      <div class="content flex-r-c mat-empty__description" v-if="hasInfo === false">
        <van-empty :image="empty" description="暂无可打印发票" image-size="5rem" />
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
          <van-circle v-model:current-rate="currentRate" :stroke-width="60" :color="{
              '0%': '#3fecff',
              '100%': '#6149f6',
            }" :clockwise="false" size="4rem" layer-color="#ebedf0" stroke-linecap="butt">
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
            <i class="footer">份发票,共需打印</i>
            <p class="count">{{ papers }}</p>
            <i class="footer">页</i>
          </div>
        </div>
        <div :style="{ width: '0.4rem', height: '100%' }" class="flex-r-c">
          <el-divider direction="vertical"></el-divider>
        </div>
        <div :style="{ width: 'calc(50% - 0.2rem)', height: '100%' }" class="flex-c-c">
          <van-image width="60%" :src="require('@/assets/img/gif/report.gif')" fit="contain" />
        </div>
      </div>
    </div>
    <div class="content__foot flex-r-3" v-if="!printing">
      <van-button v-if="hospital != 'bjftyy'" v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin"
        type="primary" icon="printer" icon-position="left" @click="onPrint">打&nbsp;&nbsp;&nbsp;&nbsp;印
      </van-button>
      <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" icon="replay"
        icon-position="left" @click="onRefresh('');">刷&nbsp;&nbsp;&nbsp;&nbsp;新
      </van-button>
      <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" icon="wap-home"
        icon-position="left" @click="onCancel">主&nbsp;&nbsp;&nbsp;&nbsp;页
      </van-button>
      <timer-button :total="timer" class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
    </div>
  </div>
  <van-dialog v-model:show="show" title=" " theme="round-button" width="50vw" overlayClass="van-overlay-white">
    <div :style="{ height: '12rem' }">
      <picker-row :finished="true">
        <p-d-f :src="dySrc" style="background: transparent"></p-d-f>
      </picker-row>
    </div>
  </van-dialog>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref, toRaw, toRefs } from 'vue';
  import PickerRow from '@/components/Picker/Picker.Row.vue';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { appRouteEnum, pushAppHome, pushRouteWithParam } from '@/router/router';
  import { Close, Open } from '@/utils/loading';
  import { Dialog } from 'vant';
  import { pdfPrint } from '@/trans/driver/src/printer';
  import { getStore } from '@/utils/cache/storage';
  import { speak } from '@/trans/driver/src/speech';
  import { einvoice$lis$range, invoice$file, invoice$state } from '@/trans/server/his/invoice';
  import PDF from '@/components/PDF.vue';
  import { getFileUri } from '@/trans/server/util';
  export default defineComponent({
    name: 'LisReport',
    props: {},
    emits: [],
    components: { TimerButton, PickerRow, PDF },
    setup(props, ctx) {
      const state = reactive({
        timer: 300,
        hasInfo: false,
        empty: null as any,
        finished: null as any,
        unfinished: null as any,
        regist: null as any,
        payment: null as any,
        reader: null as any,
        sheets: null as any,
        show: false,
        preview: [] as any[],
        hospital: '',
        range: '',
        printing: false,
        patient: null as any,
        currentRate: 0,
        currentPage: 1,
        papers: 0,
        rate: 0,
        images: [] as any[],
        dySrc: '',
        page: null as any,
      });

      onMounted(async () => {
        state.hospital = getStore('machine').hospitalcode;
        state.hasInfo = false;
        state.empty = require('@/assets/svg/report.none.svg');
        state.finished = require('@/assets/svg/invoice.printed.svg');
        state.unfinished = require('@/assets/svg/invoice.unprint.svg');
        state.regist = require('@/assets/svg/invoice.regist.svg');
        state.payment = require('@/assets/svg/invoice.payment.svg');
        state.reader = require('@/assets/svg/report.read.svg');
        state.patient = getStore('history');
        await onRefresh();
      });
      const onCancel = async function () {
        await pushAppHome();
      };
      const onRefresh = async function (range?: string) {
        Open('');
        if (!range) {
          await onRefresh('1');
          range = '0';
        }
        state.range = range;
        if (range === '0') {
          state.sheets = state.sheets.filter(function (item: any) {
            return !item.printTime;
          });
        } else {
          state.sheets = [];
          state.sheets = await einvoice$lis$range(range);
          for (let item of state.sheets) {
            item.checked = item.selected === 1;
          }
        }
        state.hasInfo = true;
        Close();
      };
      const count__sheet = function (st: string) {
        var m = state.sheets.filter(function (item: any) {
          switch (st) {
            case '1':
              return !item.printTime;
            default:
              return true;
          }
        });
        if (m) {
          return m.length;
        } else {
          return 0;
        }
      };
      const onClick = async function (item: any) {
        Open('正在下载电子发票...');
        state.page = await invoice$file(item.type, item.hisOrderno);
        if (state.page) {
          //state.dySrc = 'http://localhost:8889/Invoice/PDF/110601240195600331.pdf#scrollbars=0&toolbar=0&statusbar=0';
          if(state.page.path.indexof("http://") >= 0){
            state.dySrc = state.page.path + '#scrollbars=0&toolbar=0&statusbar=0';
          }else{
            state.dySrc = getFileUri(state.page.path) + '#scrollbars=0&toolbar=0&statusbar=0';
          }
          console.log(state.dySrc);
          state.show = true;
        } else {
          Dialog.alert({
            title: '无法打印',
            message: '发票未归档,无法预览;无法打印',
            theme: 'round-button',
            closeOnPopstate: true,
            className: 'mat-vant__dialog',
          });
        }
        Close();
      };
      const onPrint = async function () {
        state.timer = 300;
        var m = state.sheets.filter(function (item: any) {
          return item.checked;
        });
        if (m && m.length > 0) {
        } else {
          Dialog.alert({
            title: '无法打印',
            message: '请先选择希望打印的发票',
            theme: 'round-button',
            closeOnPopstate: true,
            className: 'mat-vant__dialog',
          });
          return;
        }
        Open('正在下载电子发票...');
        state.papers = 0;
        state.rate = 0;

        for (let item of m) {
          state.rate++;
          var base64 = await invoice$file(item.type, item.hisOrderno);
          item.images = [base64.path];
          state.papers += item.images.length;
        }
        Close();

        state.printing = true;
        state.currentPage = 0;
        for (let item of m) {
          speak('正在打印,请勿离开');
          state.currentRate = ((state.papers - state.currentPage) / state.rate) * 100;
          console.log(state.currentRate, state.rate, state.currentPage);
          state.currentPage += item.images.length;
          var r = await pdfPrint({ Images: item.images, IsUrl: true });
          if (r === null) {
          } else {
            await invoice$state(item.hisOrderno, item.type);
          }
        }
        state.timer = 10;
        state.printing = false;
        speak('打印完成,请取走发票,并核对数量');
        await pushRouteWithParam(appRouteEnum.CompleteS, {
          state: 'success',
          description: ['打印已完成,请取走发票'],
        });
        // setTimeout(async () => {
        //   await onRefresh();
        // }, 2000);
      };

      const beforeChange = function (sheet: any) {
        // if (sheet.state === "未完成") {
        //   speak("未完成报告单不允许打印!");
        //   Toast.loading({
        //     forbidClick: true,
        //     message: "未完成报告单不允许打印!",
        //     className: "mat_vant__toast",
        //     icon: require("@/assets/toast.mat.svg"),
        //     duration: 2500,
        //     overlay: true,
        //   });
        // }
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

  &__type {
    flex-basis: 5%;
  }

  &__time {
    flex-basis: 17%;
  }

  &__cost {
    flex-basis: 8%;
  }

  &__ins {
    flex-basis: 10%;
  }
}

.margin {
  margin-left: 0.2rem;
}

/deep/ .van-checkbox__icon {
  font-size: 0.7rem;
}
</style>
