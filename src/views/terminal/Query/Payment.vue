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
                    <p class="font-l" :style="{ float: 'right' }"> 证件号:{{ idcard }}</p>
                </div>
            </div>
            <picker-pack style="
          width: 100%;
          height: calc(100% - 1rem);
          background: rgba(#f0ecec, 0.7);
          padding: 1%;
          border-radius: 1em;
        " :finished="true" class="" custom-style="flex direction_row wrap_yes">
                <el-card style="
            height: max-content;
            background: #fff;
            margin-bottom: 1%;
            border-radius: 1em;
            flex-basis: 49%;
            margin-right: 1%;
          " class="box-card" shadow="never" v-for="(item, index) in info" :key="index">
                    <template #header>
                        <div class="card-header">
                            <span class="font-m bloder">{{ item.allCost }}元 {{ onFormat(item.curDate) }}</span>
                            <van-button type="success" class="btn-size-small" style="border-radius: 0.5em"
                                @click="onPrint(item)">
                                <template #icon>
                                    <van-icon name="newspaper-o" size="20" />
                                </template>
                                补打单据</van-button>
                            <!-- <van-button v-if="item.canPrintInvoice === true" type="primary" class="btn-size-small"
                                style="border-radius: 0.5em" @click="onPrintInvoice(item)">
                                <template #icon>
                                    <van-icon class="iconfont" class-prefix="mat-icon" name="dianzifapiao" size="20" />
                                </template>
                                补打发票</van-button> -->
                        </div>
                    </template>
                    <van-field v-model="item.thirdOrderno" label="交易流水" :colon="true" :readonly="true" />
                    <van-field v-model="item.allCost" label="账单金额" :colon="true" :readonly="true" />
                    <van-field v-model="item.pubCost" label="基金支付" :colon="true" :readonly="true" />
                    <van-field v-model="item.payCost" label="个人支付" :colon="true" :readonly="true" />
                    <van-field v-model="item.empName" label="缴费终端" :colon="true" :readonly="true" />
                    <!-- <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div> -->
                    <van-collapse v-model="activeNames" @click="onClick(item)">
                        <van-collapse-item :name="item.hisOrderno">
                            <template #icon>
                                <van-icon size="0.7rem" name="balance-list" :badge="item.itemContent.length"
                                    style="padding: 10px" />
                            </template>
                            <template #title>
                                <p style="height: 1rem; line-height: 1rem; color: #4e8ed3">点击查看账单详情</p>
                            </template>
                            <span style="height: 1rem; width: 100%" class="flex direction_row wrap_no"
                                v-for="(d, index) in item.itemContent">
                                <van-cell :value="d.itemName" style="width: 50%" />
                                <van-cell :value="d.allQuant + d.itemUnit" style="width: 20%" />
                                <van-cell :value="d.allCost + '元'" style="width: 20%" />
                                <van-cell :value="d.itemLevel" style="width: 10%" />
                            </span>
                            <template #right-icon>
                                <van-icon size="0.7rem" name="arrow-down" style="padding: 10px" />
                            </template>
                        </van-collapse-item>
                    </van-collapse>
                </el-card>
            </picker-pack>
        </div>
        <van-empty v-if="empty === true" class="content__pack" :image="require('@/assets/svg/empty.3.svg')"
            image-size="4rem" description="没有查询到缴费记录,或查询失败,可尝试[刷新]" />
        <div class="content__foot flex-r-3">
            <span class="flex-r-c">
                <span class="font-m text" style="color: #1989fa; width: 40%; text-align: right">仅显示15日内记录</span>
                <span class="font-m text"
                    style="color: #4410be; width: 40%; text-align: right; margin-left: 0.4rem">仅可打印电子发票</span>
            </span>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="printer" icon-position="left" @click="onInvoice">打印发票
            </van-button>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" icon="replay"
                icon-position="left" @click="onRefresh">刷&nbsp;&nbsp;&nbsp;&nbsp;新
            </van-button>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="wap-home" icon-position="left" @click="onCancel">返回主页
            </van-button>
            <timer-button class="margin" ref="RefItimer" size="1.3rem" :total="300" :finish="onCancel" />
        </div>
    </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import { Close, Open } from '@/utils/loading';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { pushAppHome } from '@/router/router';
  import { queryPayment } from '@/trans/server/his/query';
  import PickerPack from '@/components/Picker/Picker.pack.vue';
  import { encode } from 'js-base64';
  import { print } from '@/trans/driver/src/thermal';
  import { Dialog } from 'vant';
  import { getStore } from '@/utils/cache/storage';
  import moment from 'moment';
  import { invoice$file, invoice$state } from '@/trans/server/his/invoice';
  import { pdfPrint } from '@/trans/driver/src/printer';
import { idCardEncipher } from '@/utils/utils';
  export default defineComponent({
    name: 'QueryPayment',
    props: {},
    emits: [],
    components: { TimerButton, PickerPack },
    setup(props, ctx) {
      const state = reactive({
        patient: {} as any,
        info: {} as any,
        empty: false,
        appointment: null,
        emptyimg: null,
        data: null as any,
        idcard: '',
      });
      onMounted(async () => {
        state.patient = getStore('history');
        state.idcard = idCardEncipher(state.patient.idcard);
        state.data = '123123';
        state.emptyimg = require('@/assets/svg/empty.3.svg');
        state.appointment = require('@/assets/svg/appointment.svg');
        await onRefresh();
      });
      const onRefresh = async function () {
        Open('');
        state.info = await queryPayment();
        console.log(state.info);
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
      const onPrint = async function (data: any) {
        await print({ context: encode(data.printContent) });
      };
      const onPrintInvoice = async function (data: any) {
        var base64 = await invoice$file('10', data.hisOrderno);
        if (base64) {
          var sta = await pdfPrint({ Images: [base64], IsUrl: false });
          if (sta) {
            await invoice$state(data.hisOrderno, '10');
          }
        }
      };
      const onFormat = function (date: any) {
        return moment(date).format('llll');
      };
      const onClick = function (data: any) {
        activeNames.value = [data.hisOrderno];
      };
      const onInvoice = function () {
        Open('正在打印...');
        state.info.forEach(async (item: any) => {
          if (item.canPrintInvoice) await onPrintInvoice(item);
        });
        Close();
      };
      const activeNames = ref(['1']);
      return {
        ...toRefs(state),
        onCancel,
        onMounted,
        onRefresh,
        onPrint,
        onFormat,
        activeNames,
        onClick,
        onPrintInvoice,
        onInvoice,
      };
    },
  });
</script>

<style lang="less" scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.item {
    margin-bottom: 0px;
}

.box-card {
    border: none;
    background-position: 95% 95% !important;
    background-size: auto 50% !important;
    background-repeat: no-repeat !important;
}

.box-card:nth-child(4n + 1) {
    background-image: url('~@/assets/img/ground.101.png') !important;
}

.box-card:nth-child(4n + 2) {
    background-image: url('~@/assets/img/ground.102.png') !important;
}

.box-card:nth-child(4n + 3) {
    background-image: url('~@/assets/img/ground.103.png') !important;
}

.box-card:nth-child(4n + 4) {
    background-image: url('~@/assets/img/ground.104.png') !important;
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

/deep/.van-cell__value {
    color: #000 !important;
    font-size: larger;
}

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
</style>
