<template>
  <div class="content">
    <div class="content__pack flex-r-2" style="padding: 1%" v-show="empty === false">
      <div class="content__nav flex-r-s">
        <div class="flex-r">
          <van-icon name="contact" color="#1989fa" size="0.7rem" />
          <p class="font-l">{{ patient.patname }}</p>
        </div>

        <div class="flex-r">
          <van-icon name="idcard" color="#1989fa" size="0.7rem" />
          <p class="font-l" :style="{ float: 'right' }">证件号:{{ patient.historyid }}</p>
        </div>
      </div>
      <div style="
          width: 100%;
          height: calc(100% - 1rem);
          background: rgba(#f0ecec, 0.7);
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          grid-gap: 0.2rem;
        ">
        <el-card style="
            background: #fff; 
            margin-bottom: 1%; 
            border-radius': 3em; 
            margin-right: 1%; 
            width: 100%;height: 100%; 
            box-shadow:  0px 0px 12px rgba(0, 0, 0, .12);
          " class="box-card" shadow="never" v-for="(item, index) in info" :key="index" @click="onPrint(item)">
          <template #header>
            <div class="card-header">
              <span class="font-m bloder flex-r-3"><van-icon style="margin-right: 0.2rem" name="underway-o"
                  color="#1989fa" size="0.5rem" />就诊日期：<span class="font-m bloder">{{ item.registDate.substring(0, 5)
                  }}<span class="font-m bloder" style="color: #d1490e">{{
                    item.registDate.substring(5)
                    }}</span></span></span>
              <span class="font-m bloder" style="color: #d1490e">{{ item.apmName }}</span>
            </div>
          </template>

          <van-field label="就诊医生" :colon="true" :readonly="true">
            <template #input>
              <span class="field__doctor">{{ item.doctorName }}</span>
            </template>
          </van-field>
          <van-field label="就诊科室" :colon="true" :readonly="true">
            <template #input>
              <span class="field__dept">{{ item.branchName }}</span>
            </template>
          </van-field>
          <van-field v-model="item.registTypeName" label="挂号类型" :colon="true" :readonly="true" />
          <div class="content__nav" style="padding-top: 0.5rem">
            <van-button type="primary" block>签到</van-button>
          </div>
        </el-card>
      </div>
    </div>
    <van-empty v-if="empty === true" class="content__pack" :image="require('@/assets/svg/empty.3.svg')" image-size="4rem"
      description="没有查询到预约记录,或查询失败,可尝试[刷新]" />
    <van-popup v-model:show="show" round class="flex-c-c" :style="{ width: '50%', height: '50%' }">
      <span class="blod" style="padding: 1rem 0; font-size: 0.7rem">{{
        success ? '签到成功' : '签到失败'
        }}</span>
      <!-- <van-image :src="icon" width="3rem" fit="contain" /> -->
      <p class="blod" style="font-size: 0.7rem;white-space: pre-wrap;">{{ messageTip }}</p>
    </van-popup>
    <div class="content__foot flex-r-3">
      <van-button v-preventReClick="500" class="btn-size-normal font-s btn__foot margin" type="primary" plain
        icon-position="left" @click="onPrevious" :disabled="page <= 0">上一页
      </van-button>
      <van-button v-preventReClick="500" class="btn-size-normal font-s btn__foot margin" type="primary" plain
        icon-position="left" @click="onNext" :disabled="disabled">下一页
      </van-button>
      <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" plain
        icon="replay" icon-position="left" @click="onRefresh">刷&nbsp;&nbsp;&nbsp;&nbsp;新
      </van-button>
      <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" plain
        icon="wap-home" icon-position="left" @click="onCancel">返回主页
      </van-button>
      <timer-button class="margin" ref="RefItimer" size="1.3rem" :total="15" :finish="onCancel" />
      <!-- :finish="onCancel" -->
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import { Close, Open } from '@/utils/loading';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { pushAppHome } from '@/router/router';
  import {
    deviceArrivalByOne,
    deviceArrivalMessage,
    getArrivalList,
  } from '@/trans/server/his/registry';
  import PickerPack from '@/components/Picker/Picker.pack.vue';
  import { encode } from 'js-base64';
  import { print } from '@/trans/driver/src/thermal';
  import { Dialog, Toast } from 'vant';
  import { getStore } from '@/utils/cache/storage';
  import { useRoute } from 'vue-router';
  import { array } from 'vue-types';
  import { callDriver, DeviceEnum, MethodEnum } from '@/trans/driver';
  import { speak } from '@/trans/driver/src/speech';
  export default defineComponent({
    name: 'Registry.Mhyy',
    props: {},
    emits: [],
    components: { TimerButton, PickerPack },
    setup(props, ctx) {
      const state = reactive({
        patient: {} as any,
        info: {} as any,
        empty: false,
        appointment: null,
        data: null as any,
        qrCode: '' as any,
        show: false,
        icon: null as any,
        messageTip: '吕军test3,您的签到号是【1】',
        success: false,
        all: {} as any,
        page: 0,
        disabled: false,
      });
      onMounted(async () => {
        const route = useRoute();
        state.qrCode = route.query.qrCode ? route.query.qrCode.toString() : '';
        console.log(state.qrCode);
        state.all = JSON.parse(route.query.data as string);
        state.patient = getStore('history');
        state.data = '123123';
        state.appointment = require('@/assets/svg/appointment.svg');
        state.icon = require('@/assets/svg/patient.svg');
        await onRefresh();
      });
      const onRefresh = async function () {
        Open('');
        state.page = 0;
        var d = await deviceArrivalMessage();
        if (d.workStatus === '0') {
          Toast.loading({
            forbidClick: true,
            message: d.notWorkTip,
            className: 'mat_vant__toast',
            icon: require('@/assets/toast.mat.svg'),
            duration: 5000,
            overlay: true,
          });
          onCancel();
          return;
        }

        // state.all = await getArrivalList(state.qrCode);
        // state.all = state.all.append;
        if (!state.all || state.all.length === 0) {
          state.empty = true;
          onCancel();
        } else {
          state.empty = false;
          const o = Array.from(state.all);
          // state.all.forEach((item: any) => state.info.push(item));
          state.info = o.splice(0, 4);
          if (state.info.length === 1) {
            onPrint(state.info[0]);
          } else {
          }
          if (state.all.length <= 4) {
            state.disabled = true;
          }
        }
        console.log(state.empty);
        Close();
      };

      const onPrevious = function () {
        if (state.page > 0) {
          state.page--;
          const o = Array.from(state.all);
          state.info = o.splice(state.page * 4, 4);
          state.disabled = false;
        }
      };
      const onNext = function () {
        const o = Array.from(state.all);
        if (o.length > (state.page + 1) * 4) {
          state.page++;
          state.info = o.splice(state.page * 4, 4);
          if (state.all.length <= (state.page + 1) * 4) {
            state.disabled = true;
          }
        }
      };
      const onCancel = async function () {
        await pushAppHome();
      };
      const onPrint = async function (data: any) {
        console.log(data);
        var of = await deviceArrivalByOne(data);
        state.messageTip = of.messageTip;
        state.success = of.code === '0';
        await onPopup();
        if (of.isPrint === '1') {
          let sta = await callDriver(DeviceEnum.PRINTER, MethodEnum.STATE, {});
          if (!sta) {
            // await speak('打印机状态异常');
          } else {
            await print({ context: encode(of.printContent) });
          }
        }
      };
      const onPopup = async function () {
        state.show = true;
        setTimeout(async () => {
          state.show = false;
          await onCancel();
        }, 5000);
      };
      return {
        ...toRefs(state),
        onCancel,
        onMounted,
        onRefresh,
        onPrint,
        onPopup,
        onPrevious,
        onNext,
      };
    },
  });
</script>

<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10%;
}

.item {
  margin-bottom: 0px;
}

.box-card {
  border: none;
  background-position: 95% 95% !important;
  background-size: auto 40% !important;
  background-repeat: no-repeat !important;
}

.margin {
  margin-left: 0.2rem;
}

.grayscale {
  filter: progid:DXImageTransform.Microsoft.BasicImage(graysale=1);
  -webkit-filter: grayscale(100%);
}

/deep/.el-card {
  border: none;
}

/deep/.van-cell {
  background: transparent;
}

// /deep/.van-cell__value {
//   // color: #000 !important;
//   // font-size: larger;
// }

.text {
  background-image: -webkit-linear-gradient(left,
      blue,
      #66ffff 10%,
      #cc00ff 20%,
      #cc00cc 30%,
      #ccccff 40%,
      #00ffff 50%,
      #ccccff 60%,
      #cc00cc 70%,
      #cc00ff 80%,
      #66ffff 90%,
      blue 100%);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-background-size: 200% 100%;
  -webkit-animation: masked-animation 4s linear infinite;
}

@keyframes masked-animation {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -100% 0;
  }
}

// /deep/.el-card__header {
//   padding: 0.5%;
// }
// /deep/.van-cell {
//   padding: 12px;
// }

/deep/.van-field__control {
  font-size: 0.33rem;
  font-weight: bold !important;
}

/deep/ .van-button__text {
  font-size: 0.33rem;
}

/deep/ .van-cell__title .van-field__label {
  font-size: 0.33rem;
}

/deep/ .el-card__body {
  padding-top: 16px;
}

.field__doctor {
  font-size: 0.35rem;
  font-weight: bold !important;
}

.field__dept {
  color: #5699fe !important;
  font-size: 0.33rem;
  font-weight: bold !important;
}

/deep/.van-button--disabled {
  background: rgb(151, 150, 150, 0.2);
}
</style>
