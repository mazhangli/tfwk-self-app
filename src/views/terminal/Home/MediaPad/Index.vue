<template>
  <div class="content flex-c">
    <div class="content__pack flex-r-c">
      <div class="toolbar flex-c" style="flex-wrap:nowrap">
        <p class="toolbar-title font-l blod">请选择身份认证方式</p>
        <p>Please select a way</p>
        <van-divider />
        <span v-for="(item, index) in medias" :key="index" style="width: 100%; height: 1.5rem; padding: 5px 0">
          <van-button type="primary" color="#36A3F1" size="large" @click="onClick(item)"
            :disabled="item.diaabled === 'true'" style="height: 100%">
            <template #icon>
              <van-icon class="iconfont" class-prefix="mat-icon" :name="item.icon" size="40" />
            </template>
            <template #default>
              <span class="flex-c">
                <span>{{ item.medianame }}</span>
                <span>{{ item.english }}</span>
              </span>
            </template>
          </van-button>
          <van-divider :style="{ color: '#5E5F76', borderColor: '#5E5F76', padding: '2px 0' }" />
        </span>
      </div>
      <div class="inforpad">
        <div class="content inforpadm">
          <div class="content flex-c-c" v-if="!type || type === ''">
            <p class="title__sub font-l blod">请选择适合的身份认证方式</p>
            <van-image :src="image" width="8rem" />
          </div>
          <media-identity @onCallend="onEnd" v-if="type === 'IDENTITY'" :key="token" :medium="medium" />
          <media-identity-number @onCallend="onEnd" v-if="type === 'IDENTITY.INPUT'" :key="token" :medium="medium" />
          <media-medicare-card @onCallend="onEnd" v-if="type === 'MEDICARE.CARD'" :key="token" :medium="medium" />
          <media-medicare-barcode @onCallend="onEnd" v-if="type === 'MEDICARE.BARCODE'" :key="token" :medium="medium" />
          <!-- <media-enter @onCallend="onEnd" v-if="type === 'ENTER'" :key="token" :medium="medium" /> -->
          <media-phone @onCallend="onEnd" v-if="type === 'PHONE'" :key="token" :medium="medium" />
          <media-scanner @onCallend="onEnd" v-if="type === 'SCANNING'" :key="token" :medium="medium" />
        </div>
      </div>
    </div>
    <div class="content__foot flex-r-3">
      <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" icon="wap-home"
        icon-position="left" @click="onCancel">返回主页
      </van-button>
      <timer-button class="margin" ref="RefItimer" size="1.1rem" :total="300" :finish="onCancel" />
    </div>
  </div>
  <van-dialog :v-model:show="shown" title=" " theme="round-button" width="12rem" overlayClass="van-overlay-white">
    <span>1</span>
  </van-dialog>
</template>

<script lang="ts">
import { pushRouteWithoutParam, appRouteEnum, pushRouteWithParam } from '@/router/router';
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  toRefs,
} from 'vue';
import MediaIdentity from '@/views/terminal/Home/MediaPad/Media.Identity.vue';
import MediaMedicareCard from '@/views/terminal/Home/MediaPad/Media.Medicare.Card.vue';
import MediaMedicareBarcode from '@/views/terminal/Home/MediaPad/Media.Medicare.QR.vue';
import MediaEnter from '@/views/terminal/Home/MediaPad/Media.Enter.vue';
import MediaPhone from '@/views/terminal/Home/MediaPad/Media.Phone.vue';
import MediaIdentityNumber from '@/views/terminal/Home/MediaPad/Media.Identity.Number.vue';
import MediaScanner from '@/views/terminal/Home/MediaPad/Media.Scanner.vue';
import { getStore, removeStore, setStore } from '@/utils/cache/storage';
import { medias } from '@/trans';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';
import { Close, Open } from '@/utils/loading';
import { useEventListener, useCountDown } from '@vant/use';
import { useRoute } from 'vue-router';
import { history$confined } from '@/trans/server/his/patient';
import { speak } from '@/trans/driver/src/speech';
import { eject } from '@/trans/driver/src/other';
import { read as idcard } from '@/trans/driver/src/idcard';
import { read as patcard } from '@/trans/driver/src/patcard';
import { inject as Inscard } from '@/trans/driver/src/inscard';
import { inject as Patcard } from '@/trans/driver/src/patcard';
import { callinsapi } from '@/trans/driver/src/insapi/index';
import { MethodEnum } from '@/trans/driver';
export default defineComponent({
  name: 'MediaIndex',
  props: {
    menuCode: String,
  },
  emits: [],
  components: {
    TimerButton,
    MediaIdentity,
    MediaMedicareCard,
    MediaMedicareBarcode,
    MediaEnter,
    MediaPhone,
    MediaIdentityNumber,
    MediaScanner,
  },
  setup(props, ctx) {
    const state = reactive({
      menuCode: '',
      shown: false,
      type: undefined as any,
      token: 0,
      medias: [] as any,
      medium: null as any,
    });
    onBeforeMount(async () => {
      removeStore('historys');
      removeStore('history');
      removeStore('patients');
      removeStore('patient');
      /*路由*/
      const route = useRoute();
      state.menuCode = route.query.menucode as string;
    });
    onMounted(async () => {
      state.medias = await medias();
      countDown.start();
    });

    const finder = function (code: string) {
      var array = state.medias.filter(function (item: { mediumcode: string }) {
        return item.mediumcode === code;
      });
      if (array) {
        return array[0];
      }
    };

    const image = computed(() => {
      return require('@/assets/svg/unstep.svg');
    });
    const onClick = async function (media: any) {
      state.token++;
      state.medium = {
        mediumcode: media.mediacode,
        mediumname: media.mediacode,
        mediumimg: media.icon,
        english: media.english,
        caption: media.caption,
        title: media.title,
      };
      state.type = '';
      switch (media.mediacode) {
        case 'IDENTITY':
          await speak('请将身份证放置在感应区');
          break;
        case 'IDENTITY.INPUT':
          await speak('请输入身份证号码');
          break;
        case 'MEDICARE.CARD':
          if ((await Inscard()) === false) return;
          await speak('请插入医保卡');
          break;
        case 'MEDICAL':
          if ((await Patcard()) === false) return;
          await speak('请插入就诊卡');
          break;
        case 'MEDICARE.BARCODE':
          await speak('请出示医保电子凭证并靠近扫描区');
          break;
        case 'ENTER':
          await speak('请输入基本信息');
          break;
        case 'PHONE':
          await speak('请输入手机号码');
          break;
        default:
          break;
      }
      state.type = media.mediacode;
    };
    const onClose = function () {
      state.token++;
    };
    const onEnd = async function (success: boolean, ...args: any[]) {

      console.log('token++', success, ...args);
      var type = '';
      var card = '';
      var capinfo = {};
      var readed = false;
      if (success === true) {
        switch (state.type) {
          case 'IDENTITY':
            readed = await idcard();
            if (readed === true) {
              type = '身份证';
              card = getStore('identity').Code;
              setStore('login', { cardtype: '身份证' });
            }
            break;
          case 'IDENTITY.INPUT':
            if (args) {
              type = '身份证';
              card = args[0];
              readed = true;
              setStore('login', { cardtype: '身份证号' });
            }
            else {
              readed = false;
            }
            break;
          case 'MEDICARE.CARD':
            readed = await callinsapi(MethodEnum.READ);
            if (readed === true) {
              type = 'capinfo';
              capinfo = getStore('capinfo');
              setStore('login', { cardtype: '医保卡' });
            }
            break;
          case 'MEDICARE.BARCODE':
            if (args) {
              readed = await callinsapi(MethodEnum.READ, args[0]);
              if (readed === true) {
                type = 'capinfo';
                card = args[0];
                capinfo = getStore('capinfo');
                setStore('login', { cardtype: '医保卡' });
              }
            }
            else {
              readed = false;
            }
            break;
          case 'MEDICAL':
            readed = await patcard();
            if (readed === true) {
              type = '就诊卡';
              card = getStore('patcard').cardno;
              setStore('login', { cardtype: '就诊卡' });
            }
            break;
        }
      } else {
        state.type = '';
        eject();
      }
      if (readed === true) {
        Open('');
        if ((await history$confined(type, card, capinfo, state.menuCode)) === true) onNucleic();
        Close();
      }else{
        Close();
      }
    };
    const onNucleic = async function () {
      if(!state.menuCode && getStore('machine').redirect) state.menuCode = getStore('last').menuCode;
      console.log(state.menuCode);
      switch (state.menuCode) {
        case 'staff.nuclein':
        case 'nosocomial.nuclein':
          await pushRouteWithParam(appRouteEnum.Automaton, {});
          break;
        case 'payfor.examination':
          await pushRouteWithParam(appRouteEnum.Payment, {});
          break;
        case 'dlyy.examine':
          await pushRouteWithParam(appRouteEnum.bUltrasonics, {});
          break;
        default:
          await pushRouteWithoutParam(appRouteEnum.DlyyNucleicInvoking);
      }
    };
    const onCancel = function () {
      pushAppHome();
      state.token++;
      state.type = '';
    };
    useEventListener(
      'click',
      (e: any) => {
        console.log('刷新倒计时');
        countDown.reset();
      },
      { target: document.body }
    );
    const countDown = useCountDown({
      // 倒计时 1 分钟
      time: 60 * 1000,
    });

    return {
      ...toRefs(state),
      image,
      onClick,
      onClose,
      onEnd,
      finder,
      onNucleic,
      onCancel,
      useEventListener,
      countDown,
    };
  },
});
</script>

<style lang="less" scoped>
.toolbar {
  // width: 8rem;
  width: 30%;
  height: 100%;
  padding: 2%;
  overflow-y: hidden;

  p {
    text-align: center;
    vertical-align: middle;
  }

  &-title {
    width: 100%;
    height: 0.7rem;
    color: #36a3f1;
  }
}

.inforpad {
  // width: calc(100% - 8rem);
  width: 70%;
  height: 100%;
  // padding: 2%;

  &m {
    //border-bottom-left-radius: 1em;
    //border-top-right-radius: 1em;
    border-radius: 0.5em;
    // background: rgba(#686868, 0.1);
    background: white;
    // border: rgba(#c2c2c4, 0.2) 1px solid;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 8px 2px;
    //border: 1px solid #E4E7ED;
    padding: 8px;
  }
}

.ground {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(#394664, 0.2);
  top: 0;
  left: 0;

  img {
    position: relative;
    width: 100%;
    height: 100%;
  }
}

.color {
  color: #36a3f1;
}

/deep/.van-divider {
  margin: 6px 0;
}
</style>
