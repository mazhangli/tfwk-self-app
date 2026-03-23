<template>
  <div class="mediumpad">
    <div class="subheader flexbox flexbox-center flexbox-row">
      <p class="van-dialog__header"> 请选择身份认证方式 </p>
    </div>
    <div class="padconent flexbox flexbox-center flexbox-row">
      <span v-for="(medium, z) in mediums" :key="z">
        <medium-button :medium="medium" @click="done(medium.mediumcode, medium.caption, medium.title)" />
      </span>
    </div>
    <div class="subFooter flexbox justify-end flexbox-row">
      <van-button class="btn-size-normal font-s" type="primary" icon="wap-home" icon-position="left"
        v-on:click="onClick()">返回首页
      </van-button>
      <timer-button ref="RefItimer" :finish="onClick" />
    </div>

    <!-- 当存在子属性时弹出界面选择子属性 -->
    <van-popup v-model:show="showpopup" position="center" :style="{ height: '6rem', width: '10rem' }">
      <div :style="{ width: '9rem', height: '4.8rem', margin: '0 auto' }"
        class="flexbox flexbox-center flexbox-row justify-around">
        <span v-for="(child, i) in medium.children" :key="i">
          <medium-button :medium="child" @click="childClicked(child.mediumcode, child.caption, child.title)" />
        </span>
      </div>
      <div :style="{ width: '100%', height: '1rem' }" class="flexbox flexbox-center">
        <van-button :style="{ width: '90%', height: '100%', 'font-size': '0.4rem' }" color="#4fc08d" block :icon="front"
          @click="unshown">返回</van-button>
      </div>
    </van-popup>

    <!-- 进入后台后显示图片弹窗遮罩主界面 -->
    <van-dialog v-model:show="dialog" theme="round-button" cancel-button-color="#ee0a24" contain :title="title"
      :show-confirm-button="false" :show-cancel-button="true" lazy-render width="10rem">
      <div class="flexbox flexbox-center flexbox-col">
        <scanning @callback="callback" placeholder="请扫描二维码" v-if="code === 'MEDICARE.BARCODE'" />
        <input-pad @callback="callback" placeholder="请扫描条码 / 输入条码内容" v-if="code === 'SCANNING'" />
        <van-image contain width="8rem" height="8rem" :src="gif" v-if="code !== 'SCANNING'">
          <template v-slot:error>图片加载失败</template>
        </van-image>
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { appRouteEnum, pushAppHome, pushRouteWithoutParam } from '@/router/router';
import { login } from '@/trans/index';
import InputPad from '@/components/InputPad/InputPad.vue';
import Scanning from '@/components/InputPad/Scanning.vue';
import MediumButton from '@/components/terminal/button/MediumButton.vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
export default defineComponent({
  name: 'MediumPad',
  props: {},
  components: { MediumButton, TimerButton, InputPad, Scanning },
  setup() {
    const onClick = function () {
      pushAppHome();
    };
    const HomeContainer = document.querySelector('#Home');
    let showpopup = ref(false);
    let dialog = ref(false);
    const state = reactive({
      menucode: '',
      mediums: [],
      medium: {
        mediumcode: '',
        mediumname: '',
        mediumimg: '',
        english: '',
        caption: '',
        title: '',
        children: [],
      },
      //dialog 属性
      code: '',
      title: '',
      gif: '',
    });

    const search = function (array: Array<any>, code: string) {
      if (!array || array.length === 0) {
        return [];
      }
      return array.filter((item) => {
        if (item.mediumcode.toLowerCase() === code.toLowerCase()) {
          return item;
        }
      });
    };
    const front = require('@/assets/svg/button/front.svg');
    const done = function (code: string, caption: string, title: string) {
      state.medium = search(state.mediums, code)[0];
      if (state.medium.children && state.medium.children.length > 0) {
        //有子属性
        showpopup.value = true;
      } else {
        //没有子属性
        callserver(code, caption, title);
      }
    };

    const childClicked = function (code: string, caption: string, title: string) {
      unshown();
      callserver(code, caption, title);
    };

    const unshown = () => {
      showpopup.value = false;
    };

    const callserver = async function (code: string, caption: string, title: string) {
      state.gif = require('@/assets/img/gif/' + caption);
      state.code = code;
      state.title = title;
      dialog.value = true;
      console.log(code);
      const longined = await login(code, 20);
      if (longined === true) {
        console.log('当前患者登录成功', '登录方式', code);
        push();
      } else {
        console.log('当前患者登录失败', '登录方式', code);
      }
      dialog.value = false;
    };

    const callback = function (input: string) {
      console.log(input);
      dialog.value = false;
    };

    const push = function () {
      console.log(state.menucode);
      switch (state.menucode) {
        case 'register': //自助挂号
          pushRouteWithoutParam(appRouteEnum.Register);
          break;
        case 'register.schedule': //自助预约
          pushRouteWithoutParam(appRouteEnum.Schedule);
          break;
        case 'medicine.purchase': // 自助购药
          pushRouteWithoutParam(appRouteEnum.PurchaseMedicine);
          break;
        case 'medicine.collection': // 扫码取药
          pushRouteWithoutParam(appRouteEnum.CollectionMedicine);
          break;
      }
    };

    onMounted(() => {
      if (!state.menucode) {
        /*路由*/
        const route = useRoute();
        if (route.query.medium) {
          const array = JSON.parse(route.query.medium.toLocaleString());
          if (array && array.length > 0) {
            state.mediums = array;
          }
        }
        state.menucode = (route.query.menucode ? route.query.menucode : '').toString();
      }
    });
    return {
      onClick,
      ...toRefs(state),
      callserver,
      done,
      unshown,
      childClicked,
      HomeContainer,
      callback,
      front,
      showpopup,
      dialog,
    };
  },
});
</script>

<style lang="less" scoped>
.mediumpad {
  width: 100%;
  height: 100%;
}

.subheader {
  height: 15%;
  width: 100%;

  .header {
    color: #5e5f61;
  }
}

.padconent {
  height: 70%;
  width: 100%;
}

.subFooter {
  height: 15%;
  width: 85%;
}

.text {
  height: 100%;
  width: 100%;
}

.mask {
  background: rgba(0, 0, 0, 0.5);
  position: relative;
  height: 25%;
  margin-top: 75%;
}

.chinese {
  margin-top: 2%;
  color: #feeeed;
  vertical-align: middle;
  width: 100%;
  margin: 0.1rem;
  line-height: 0.5rem;
}

.english {
  color: #feeeed;
  vertical-align: middle;
  width: 100%;
  line-height: 0.3rem;
}
</style>
