<template>
  <div class="content flex-c">
    <div class="content__pack flex-center">
      <div class="content__foot">
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
      </div>
      <div class="content__pack">
        <div class="content content__picker" v-if="hasInfo === true">
          <div class="title">检查申请单{{ count__sheet('1') }}份</div>

          <picker-row
            :style="{ height: 'calc( 100% - 1.5rem)' }"
            :finished="true"
            lineHeight="1.3rem"
          >
            <van-cell :center="true" class="van-cell__title">
              <template #default>
                <div class="flex-r-c">
                  <div class="lab lab__name van-multi-ellipsis--l2">检查项目</div>
                  <div class="lab lab__date van-multi-ellipsis--l2">申请时间</div>
                  <div class="lab lab__date van-multi-ellipsis--l2">检查号</div>
                </div>
              </template>
            </van-cell>
            <van-cell
              v-for="(item, index) in sheets"
              :key="index"
              :center="true"
              @click="onClick(item)"
              :class="
                item.auditstatus === '1'
                  ? ['van-cell__mat']
                  : item.auditstatus === '2'
                  ? ['van-cell__mat', 'unfinished']
                  : ['van-cell__mat', 'consult']
              "
            >
              <template #icon>
                <van-image :src="finished" width="1rem" height="1rem" />
              </template>
              <template #default>
                <div class="flex-r-c">
                  <p class="lab__name van-multi-ellipsis--l2">{{ item.project }}</p>
                  <p class="lab lab__date van-multi-ellipsis--l2">{{ item.apptime }}</p>
                  <p class="lab lab__lab van-multi-ellipsis--l2">{{ item.reportNo }}</p>
                </div>
              </template>
              <!-- <template #right-icon>
                            <van-image :src="reader" width="1rem" height="1rem"   />
                        </template> -->
            </van-cell>
          </picker-row>
        </div>
        <div class="content flex-r-c mat-empty__description" v-if="hasInfo === false">
          <van-empty :image="empty" description="暂无可打印报告单" image-size="5rem" />
        </div>
      </div>
    </div>
    <div class="content__foot flex-r-3">
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="replay"
        icon-position="left"
        @click="onPrint"
        v-if="hasInfo === true"
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
      <timer-button :total="300" class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
    </div>
  </div>
  <van-dialog
    v-model:show="show"
    title=" "
    theme="round-button"
    width="12rem"
    overlayClass="van-overlay-white"
  >
    <div :style="{ height: '9rem' }">
      <picker-row :finished="true">
        <van-image v-for="(item, index) in preview" :key="index" :src="item" />
      </picker-row>
    </div>
  </van-dialog>
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
  import PickerRow from '@/components/Picker/Picker.Row.vue';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { pushAppHome } from '@/router/router';
  import { Close, Open } from '@/utils/loading';
  import { report$bw$lis, report$bw$state, report$bw$view } from '@/trans/server/his/report';
  import { Dialog, Toast } from 'vant';
  import { imagePrint, print, pdfPrint } from '@/trans/driver/src/printer';
  import { getStore } from '@/utils/cache/storage';

  export default defineComponent({
    name: 'bUltrasonics',
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
        patient: null as any,
        printing: false,
      });
      onBeforeMount(async () => {
        state.patient = getStore('history');
      });
      onMounted(async () => {
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
        state.sheets = await report$bw$lis();
        Close();
        console.log(JSON.stringify(state.sheets));
        if (!state.sheets || state.sheets.length === 0) {
          state.hasInfo = false;
        } else {
          state.hasInfo = true;
          for (let item of state.sheets) {
            if (item.url && item.url.length > 0) {
              item.images = await report$bw$view(item.reportNo);
            }
          }
        }
        state.printing = false;
        Close();
      };
      const count__sheet = function (st: string) {
        return state.sheets.length;
        // var m = state.sheets.filter(function (item: any) {
        //     return item.state === st;
        // });
        // if (m) {
        //     return m.length;
        // } else {
        //     return 0;
        // }
      };
      const onClick = function (sheet: any) {
        // if (sheet.status === "1" && sheet.images.length > 0) {
        // state.preview = [];
        // for (let item of sheet.images) {
        //     state.preview.push("data:image/gif;base64," + item);
        // }
        // state.show = true;
        // } else {
        //     if (sheet.state === "2") {
        //         Dialog.alert({
        //             title: '无法打印',
        //             message: '此检验单未完成,无法预览;无法打印',
        //             theme: 'round-button',
        //         });
        //     } else {
        //         Dialog.alert({
        //             title: '无法打印',
        //             message: '此检验单无法自助打印,请前往检验科咨询',
        //             theme: 'round-button',
        //         });
        //     }
        // }
      };
      const onPrint = async function () {
        if (state.printing === true) {
          //打印中 防止二次点打印
          Toast({
            message: '正在打印中,请稍后...',
            className: 'mat_vant__toast',
          });
        } else {
          state.printing = true;
          Open('');
          var m = state.sheets;
          // .filter(function (item: any) {
          //     return item.state === '1';
          // });
          var unPrint = 0;
          for (let item of m) {
            if (item.url && item.url.length > 0) {
              if (item.images && item.images.length > 0) {
                var images = [];
                for (let image of item.images) {
                  images.push(image as string);
                }
                var r = await pdfPrint({ Images: item.images, IsUrl: false });
                if (r === null) {
                } else {
                  await report$bw$state(item.reportNo);
                }
              }
            } else {
              unPrint++;
            }
          }
          await onRefresh();
          Close();
          if (unPrint > 0) {
            Toast({
              message: '剩余报告单暂未完成,请耐心等待...',
              className: 'mat_vant__toast',
            });
          }
        }
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
    font-size: 0.34rem;
    font-weight: blod;
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
</style>
