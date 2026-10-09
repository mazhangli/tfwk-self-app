<template>
  <div class="content flex-c">
    <div class="content__pack flex-center">
      <div class="content content__picker" v-if="hasInfo === true">
        <div class="title font-l blod"
          >可打印报告单<span class="font-xl bloder">{{ count__sheet('1') }}</span
          >份 /
          <span class="font-m"
            >未完成报告单<span class="font-l blod">{{ count__sheet('2') }}</span
            >份</span
          >
          /
          <span class="font-m"
            >请前往检验科咨询打印<span class="font-l blod">{{ count__sheet('3') }}</span
            >份</span
          >></div
        >

        <picker-row
          :style="{ height: 'calc( 100% - 1.3rem)' }"
          :finished="true"
          lineHeight="1.3rem"
        >
          <van-cell :center="true" class="van-cell__title">
            <template #default>
              <div class="flex-r-c">
                <div class="lab lab__name van-multi-ellipsis--l2">检验项目</div>
                <div class="lab lab__date van-multi-ellipsis--l2">标本时间</div>
                <div class="lab lab__lab van-multi-ellipsis--l2">检验室</div>
                <div class="lab lab__date van-multi-ellipsis--l2">报告完成时间</div>
              </div>
            </template>
          </van-cell>
          <van-cell
            v-for="(item, index) in sheets"
            :key="index"
            :center="true"
            @click="onClick(item)"
            :class="
              item.state === '1'
                ? ['van-cell__mat']
                : item.state === '2'
                ? ['van-cell__mat', 'unfinished']
                : ['van-cell__mat', 'consult']
            "
          >
            <template #icon>
              <van-image :src="finished" width="1rem" height="1rem" v-if="item.state === '1'" />
              <van-image :src="unfinished" width="1rem" height="1rem" v-if="item.state === '2'" />
              <van-image :src="consult" width="1rem" height="1rem" v-if="item.state === '3'" />
            </template>
            <template #default>
              <div class="flex-r-c">
                <p class="lab__name van-multi-ellipsis--l2">{{ item.itemName }}</p>
                <p class="lab lab__date van-multi-ellipsis--l2">{{ item.samplingDate }}</p>
                <p class="lab lab__lab van-multi-ellipsis--l2">{{ item.laboratoryName }}</p>
                <p class="lab lab__date van-multi-ellipsis--l2" v-if="item.commitDate">{{
                  item.commitDate
                }}</p>
                <p
                  class="lab lab__date van-multi-ellipsis--l2 font-m"
                  v-if="!item.commitDate"
                  style="color: red !important"
                  >未完成</p
                >
              </div>
            </template>
            <!-- <template #right-icon>
                        <van-image :src="reader" width="1rem" height="1rem"   />
                    </template> -->
          </van-cell>
        </picker-row>
      </div>
      <div class="content flex-r-c mat-empty__description" v-if="hasInfo === false">
        <van-empty :image="empty" description="暂无可打印化验单" image-size="5rem" />
      </div>
    </div>
    <div class="content__foot flex-r-3">
      <van-button
        v-if="hospital != 'bjftyy' && unprint === false"
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
        >主&nbsp;&nbsp;&nbsp;&nbsp;页
      </van-button>
      <timer-button :total="60" class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
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
  import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import { useRoute } from 'vue-router';
  import PickerRow from '@/components/Picker/Picker.Row.vue';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { appRouteEnum, pushAppHome, pushRouteWithParam } from '@/router/router';
  import { Close, Open } from '@/utils/loading';
  import { report$lis, report$lis$state, report$lis$view } from '@/trans/server/his/report';
  import { Dialog } from 'vant';
  import { imagePrint, print } from '@/trans/driver/src/printer';
  import { getStore } from '@/utils/cache/storage';
  import { speak } from '@/trans/driver/src/speech';

  export default defineComponent({
    name: 'LisReport',
    props: {},
    emits: [],
    components: { TimerButton, PickerRow },
    setup(props, ctx) {
      const state = reactive({
        hasInfo: false,
        empty: null as any,
        finished: null as any,
        unfinished: null as any,
        consult: null as any,
        reader: null as any,
        sheets: null as any,
        show: false,
        preview: [] as any[],
        hospital: '',
        range: 0,
        unprint: false,
      });

      onMounted(async () => {
        const route = useRoute();
        state.unprint = route.query.unprint === '1';
        state.hospital = getStore('machine').hospitalcode;
        state.hasInfo = false;
        state.empty = require('@/assets/svg/report.none.svg');
        state.finished = require('@/assets/svg/report.lis.finished.svg');
        state.unfinished = require('@/assets/svg/report.lis.unfinished.svg');
        state.consult = require('@/assets/svg/report.lis.consult.svg');
        state.reader = require('@/assets/svg/report.read.svg');
        await onRefresh();
      });
      const onCancel = async function () {
        await pushAppHome();
      };
      const onRefresh = async function () {
        Open('');
        state.sheets = [];
        state.sheets = await report$lis();
        if (!state.sheets || state.sheets.length === 0) {
          state.hasInfo = false;
        } else {
          state.hasInfo = true;
        }

        for (let item of state.sheets) {
          if (item.state === '1') item.images = await report$lis$view(item.id);
          else item.images = [];
        }
        Close();
      };
      const count__sheet = function (st: string) {
        var m = state.sheets.filter(function (item: any) {
          return item.state === st;
        });
        if (m) {
          return m.length;
        } else {
          return 0;
        }
      };
      const onClick = function (sheet: any) {
        if (sheet.state === '1' && sheet.images.length > 0) {
          state.preview = [];
          for (let item of sheet.images) {
            state.preview.push('data:image/gif;base64,' + item);
          }
          state.show = true;
        } else {
          if (sheet.state === '2') {
            Dialog.alert({
              title: '无法打印',
              message: '此检验单未完成,无法预览;无法打印',
              theme: 'round-button',
              closeOnPopstate: true,
              className: 'mat-vant__dialog',
            });
          } else {
            Dialog.alert({
              title: '无法打印',
              message: '此检验单无法自助打印,请前往检验科咨询',
              theme: 'round-button',
              closeOnPopstate: true,
              className: 'mat-vant__dialog',
            });
          }
        }
      };
      const onPrint = async function () {
        Open('');
        var m = state.sheets.filter(function (item: any) {
          return item.state === '1';
        });
        for (let item of m) {
          if (item.images && item.images.length > 0) {
            var images = [];
            for (let image of item.images) {
              images.push(image as string);
            }
            var r = await imagePrint({ Images: item.images, IsUrl: false });
            if (r === null) {
            } else {
              await report$lis$state(item.id);
            }
          }
        }
        // await onRefresh();
        speak('打印完成,请取走报告单,并核对数量');
        await pushRouteWithParam(appRouteEnum.CompleteS, {
          state: 'success',
          description: ['打印已完成,请取走报告单'],
        });
        Close();
      };
      return { ...toRefs(state), onCancel, onRefresh, count__sheet, onClick, onPrint };
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
    // font-size: 0.34rem;
    // font-weight: blod;
  }

  .unfinished {
    -webkit-box-shadow: 5px 5px 10px 0px #c90808 !important;
    -moz-box-shadow: 5px 5px 10px 0px #c90808 !important;
    box-shadow: 5px 5px 10px 0px #c90808 !important;
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
