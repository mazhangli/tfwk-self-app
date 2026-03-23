<template>
  <div class="content flex-c">
    <div class="content__pack flex-r-c">
      <div class="toolbar flex-c">
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
        </div>
      </div>
    </div>
    <div class="content__foot flex-r-3">
        <van-button v-preventReClick="2000" class="btn-size-small font-s btn__foot margin" type="primary" icon="wap-home" icon-position="left" @click="onCancel">返回主页
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
import { getStore, removeStore, setStore } from '@/utils/cache/storage';
import { medias } from '@/trans';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';
import { Close, Open } from '@/utils/loading';
import { useEventListener, useCountDown } from '@vant/use';
import moment from '@/utils/moment';
import { history } from '@/trans/server/his/nucleic';
import CapinfoBarcode from '@/views/terminal/Home/MediaPad/Capinfo';
import Confirm from '@/views/terminal/Home/MediaPad/Capinfo/index';
import { speak } from '@/trans/driver/src/speech';
import { eject } from '@/trans/driver/src/other';
// import Confirm from '@/views/terminal/Home/MediaPad/Capinfo/Capinfo.Barcode';
export default defineComponent({
  name: 'Nucleic',
  props: {},
  emits: ['confirm'],
  components: {
    TimerButton,
    MediaIdentity,
    MediaMedicareCard,
    MediaMedicareBarcode,
    MediaEnter,
    MediaPhone,
    MediaIdentityNumber,
  },
  setup(props, ctx) {
    const state = reactive({
      shown: false,
      type: undefined as any,
      token: 0,
      medias: [] as any, //[{ mediacode: "IDENTITY", medianame: "身份证", english: "Identity Card", sort: "A", icon: "idcard-red", caption: "identity.gif", title: "请将患者身份证放置在感应区", disabled: "false" }, { mediacode: "ENTER", medianame: "无卡登录", english: "Enter Information", sort: "D", icon: "yingjiandang", caption: "", title: "*", disabled: "false" }, { mediacode: "PHONE", medianame: "手机号识别", english: "Phone Recognition", sort: "E", icon: "renlianshibie", caption: "", title: "*", disabled: "false" }] as any,
      medium: null as any,
    });
    onBeforeMount(async () => { });
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
      state.type = media.mediacode;
      var driveopen = null as any;
      switch (state.type) {
        case 'IDENTITY':
          await speak('请将身份证放置在感应区');
          break;
        case 'IDENTITY.INPUT':
          await speak('请输入身份证号码');
          break;
        case 'MEDICARE.CARD':
          await speak('请插入医保卡');
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
    };
    const onClose = function () {
      state.token++;
    };
    const onEnd = async function (success: boolean) {
      Open('');
      if (success === true) {
        console.log('关闭设备');
        var login = getStore('login');
        switch (state.type) {
          case 'IDENTITY':
            var res = await history('身份证', login.identity.Code, {});
            if (res === true) {
              await onNucleic({ cardType: '1', idCard: login.identity.Code });
            }
            break;
          case 'IDENTITY.INPUT':
            var res = await history('身份证', login.identity.Code, {});
            if (res === true) {
              await onNucleic({ cardType: '1', idCard: login.identity.Code });
            }
            break;
          case 'MEDICARE.CARD':
            var res = await history('capinfo', 'capinfo', login.capinfo);
            if (res === true) {
              await onNucleic({ cardType: '1', capinfo: login.capinfo });
            } else {
              await eject();
            }
            break;
          case 'MEDICARE.BARCODE':
            var res = await history('capinfo', 'capinfo', login.capinfo);
            //await login$close('medicare.barcode');
            if (res === true) {
              await onNucleic({ cardType: '1', capinfo: login.capinfo });
            }
            break;
            //   case 'ENTER':
            //     await onNucleic({ phone: login.enter.phone });
            //     break;
            //   case 'PHONE':
            //     await onNucleic({ phone: login.phone });
            break;
        }
      } else {
        state.type = '';
        await eject();
      }
      Close();
    };
    const onNucleic = async function (data: any) {
      Open('');
      await pushRouteWithoutParam(appRouteEnum.DlyyNucleicInvoking);
      Close();
    };
    const onCancel = function () {
      state.token++;
      state.type = '';
      pushAppHome();
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
  width: 8rem;
  height: 100%;
  padding: 1rem;

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
  width: calc(100% - 8rem);
  height: 100%;
  padding: 2%;

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
