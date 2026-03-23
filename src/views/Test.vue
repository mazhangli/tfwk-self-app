<template>
  <div class="home" :center="true">
    <!-- 居中 -->
    <van-row type="flex" justify="center" align="center">
      <van-field v-model="inputjson" label="输入" placeholder="输入" />
    </van-row>
    <van-row type="flex" justify="center" align="center">
      <van-col span="3">
        <van-button type="warning" @click="drives">调用设备</van-button>
      </van-col>
      <van-col span="3">
        <van-button type="warning">调用医保</van-button>
      </van-col>
      <van-col span="3">
        <van-button type="warning" @click="server">调用服务</van-button>
      </van-col>
      <van-col span="3">
        <van-button type="warning" @click="setupMethod">启动服务</van-button>
      </van-col>
      <van-col span="3">
        <van-button type="warning" @click="redone">二次读卡</van-button>
      </van-col>
      <van-col span="3">
        <van-button type="warning" @click="toast">Toast</van-button>
      </van-col>
      <van-col span="3">
        <van-button type="warning" @click="dialog">Dialog</van-button>
      </van-col>
    </van-row>
    <van-row type="flex" justify="center" align="center">
      <van-field v-model="outputjson" label="输出" placeholder="输出" />
    </van-row>
    <div class="content" id="nucleicinvoking"></div>
    <!-- <div :style="{ width: '8rem', height: '8rem' }">
        <input-pad @callback="callback" placeholder="请扫描条码 / 输入条码内容"></input-pad>
    </div>
    <img :src="img" />
    <img src="~@/assets/svg/button/front.svg" /> -->
    <!-- <van-button :style="{ width: '3rem', height: '2rem', 'font-size': '0.4rem' }" color="#4fc08d" block :icon="img">返回</van-button> -->
    <!-- <timer-button ref="RefItimer" :finish="finish" v-on:click="pause" /> -->
    <!-- <van-image :src="image" /> -->
    <!-- <picker-row :style="{ width: '3rem', height: '7rem'}" :list="['A','B','C','D','E','F','G','H','A','B','C','D','E','F','G','H']">

    </picker-row>
    <picker-column :style="{ width: '17rem', height: '1rem'}" :list="['A','B','C','D','E','F','G','H','A','B','C','D','E','F','G','H']">

    </picker-column> -->
    <!-- <en-keyboard /> -->
    <!-- <span style="width: 2rem; height: 0.8rem">
        <address-label />
    </span> -->

    <!-- <van-field :center="true" :colon="true" label="联系地址">
      <template #input>
        <address-cell />
      </template>
    </van-field>
    <span>
      <van-field :center="true" :colon="true" label="证件信息">
        <template #input>
          <idcard-cell />
        </template>
      </van-field>
    </span>
    <van-popover v-model:show="show" placement="bottom-end">
      <template #default>
        <span>234234234324</span>
      </template>
      <template #reference>
        <van-field
          label="证件编号"
          size="large"
          :colon="true"
          placeholder="请输入证件号码"
          @click-input="show = true"
        />
      </template>
    </van-popover> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import callComputer from '@/utils/terminal/callComputer.js';
import { http } from '@/utils/request';
import { medias, startup } from '@/trans/index';
import InputPad from '@/components/InputPad/InputPad.vue';
import router from '@/router/index';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import PickerRow from '@/components/Picker/Picker.Row.vue';
import PickerColumn from '@/components/Picker/Picker.Column.vue';
import EnKeyboard from '@/components/EnKeyboard/EnKeyboard.vue';
import AddressCell from '@/components/Label/AddressCell.vue';
import IdcardCell from '@/components/Label/IdcardCell.vue';
import CapinfoBarcode from '@/views/terminal/Home/MediaPad/Capinfo';
//import Open from '@/views/terminal/Home/MediaPad/Capinfo/index';
import Confirm from '@/views/terminal/Home/MediaPad/Capinfo';
import { DeviceEnum, MethodEnum, callDriver } from '@/trans/driver';
import { Dialog, Toast } from 'vant';
import { Open } from '@/utils/loading';
export default defineComponent({
  name: 'Test',
  components: {
    InputPad,
    TimerButton,
    PickerRow,
    PickerColumn,
    EnKeyboard,
    AddressCell,
    IdcardCell,
  },
  data() {
    return {
      inputjson: '{"method": "Machine","systime": "yyyymmddhh24miss","operator": "00001"}',
      outputjson: '',
      text: '',
      img: null,
      value1: 0,
      option1: [
        { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 },
      ],
      show: false,
    };
  },
  beforeMount() {
    this.img = require('@/assets/svg/button/front.svg');
  },
  setup() {
    const RefItimer = ref();
    const state = reactive({
      image: null,
    });

    onMounted(() => {});

    const image = require('@/assets/img/gif/ticket.gif');
    // function pause() {
    //   if (RefItimer) {
    //     RefItimer.value.pause();
    //   }
    // }
    const pause = () => {
      RefItimer.value.pause(); //sonFn是子组件里的方法
    };
    const redone = async function () {
      await startup();
      await medias();
      //针对电子凭证二次读卡
      await Confirm({})
        .then(() => {
          console.log('二次读卡成功结束');
          return true;
        })
        .catch(() => {
          console.log('二次读卡失败结束');
          return false;
        });
      // Open({})
      //   .then(() => {
      //     console.log('点击确认');
      //   })
      //   .catch(() => {
      //     console.log('点击取消');
      //   });
    };
    const toast = function () {
      // Toast({
      //   message:
      //     '3234321413241324asdfadsflajsdflakjdsfkajd啊看电视剧法拉克减肥的拉科技代发阿第三方框架啊第三方',
      //   duration: 0,
      //   className	:'mat_fill__toast',
      //   icon: require("@/assets/toast.mat.svg"),
      //   overlay: true,
      // });
      Open('234234234234234234234234234234234234234');
    };
    const dialog=function(){

      Dialog.alert({
      title: '错误',
      message: "咖啡机阿拉山口大家法兰卡手机大发立卡手机大发",
      closeOnPopstate: true,
      className: 'mat-vant__dialog',
      theme:'round-button',
      
    }).then(() => {
      return null;
    });
    }
    return { ...toRefs(state), pause, RefItimer, image, redone, toast, dialog };
  },
  methods: {
    setupMethod() {
      startup();
    },
    finish() {
      router.push('/App/Home');
    },

    async drives() {
      //var json = JSON.parse(this.inputjson);
      // callComputer(json).then((response) => {
      //   this.outputjson = response;
      // });
      const res = await callDriver(DeviceEnum.SYSTEM, MethodEnum.INFO, {});
      // if (res === true) {
      //   console.log('true');
      // } else {
      //   console.log('untrue');
      // }

      this.outputjson = '';
    },
    callback(json: string) {
      console.log(json);
      this.outputjson = json;
    },
    server() {
      // let params = {
      //   json: this.inputjson,
      // };
      // http('/api').post('/IMock', params);
      //var json = machine();
      //console.log(json);
    },
  },
  created() {},
  beforeUnmount() {},
  mounted() {},
});
</script>

<style lang="less" scoped>
.home {
  position: relative;
  height: 100%;
  width: 100%;
  // background: '@/assets/img/ground.gif' no-repeat;
  background: rgb(236, 234, 234);
  background-size: 100% 100%;
  background-attachment: fixed;
  overflow-y: scroll;
}

.waves {
  position: relative;
  width: 100%;
  height: 10%;
  margin-bottom: -7px;
  /*Fix for safari gap*/
  min-height: 10%;
  max-height: 10%;
}

/* Animation */

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/*Shrinking for mobile*/
@media (max-width: 100%) {
  .waves {
    height: 10%;
    min-height: 10%;
  }
}

.pickerrow {
  width: 3rem;
  height: 6rem;
}

/deep/.van-number-keyboard {
  position: relative !important;
}

/deep/ .van-toast{
  width: 50% !important;
  height: 50% !important;
}

/deep/ .van-toast__text{
  font-size: 0.45rem !important;
  font-weight: bolder !important;
}

/deep/.van-toast__icon{
  font-size: 4rem !important;
}
</style>
