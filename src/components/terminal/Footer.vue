<template>
  <div ref="_this" id="AppFooter" class="app-footer">
    <div class="app-footer-ground">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(217,183,249,0.3)" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(177,219,252,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(170,185,219,0.4)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(170,185,219,0.2)" />
        </g>
      </svg>
    </div>
    <!-- 关键改动：van-row垂直底部对齐 -->
    <van-row justify="space-around" align="bottom" class="footer-content">
      <van-col
        class="font-s relative text-middle bloder footer-content-hospital"
        @click="fiveClick"
      >
        <span class="flex-r-2">
          <van-image :src="require('@/assets/logo/tfwk.svg')" width="1rem" />
          <span>
            <p class="font-l">
              北京同方卫康科技有限公司<a class="font-m blod">自助服务系统V1.0-rc2.0</a>
              <a class="font-m blod">终端编号:{{ machineid }}</a>
            </p>
            <p class="font footer-content-comp"
              >Copyright(c)2005-2006 BJ.TFWK. Technology Co.,Lid All rights Reserve</p
            >
          </span>
        </span>
      </van-col>
      <van-col
        class="relative text-middle-center blod footer-content-quit"
        style="display: flex; align-items: center; justify-content: center;"
      >
        <button
          v-if="home"
          type="button"
          class="eject-card-btn"
          style="
            background: rgba(255, 255, 255, 0.55);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(120, 100, 100, 0.25);
            border-radius: 999px;
            color: rgba(110, 85, 85, 0.75);
            font-size: 0.42rem;
            font-weight: 500;
            letter-spacing: 0.05em;
            padding: 0.28rem 0.7rem;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
            transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
          "
          @click="onQuit"
        >退回卡片</button>
      </van-col>
    </van-row>
  </div>
</template>
<script lang="ts">
import { appRouteEnum, pushRouteWithoutParam } from '@/router/router';
import { eject } from '@/trans/driver/src/other';
import { getStore } from '@/utils/cache/storage';
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'AppFooter',
  props: {},
  components: {},
  setup() {
    const state = reactive({
      clickTimes: 0,
      machineid: null as any,
    });
    const route = useRoute();
    const cardquit = ref();
    let height = ref('');
    onMounted(() => {
      state.machineid = getStore('system').empId;
      cardquit.value = require('@/assets/svg/card.quit.svg');
      height.value = document.getElementById('AppFooter')?.clientHeight + 'px' || '3rem';
    });
    const home = computed(() => {
      return (
        route.path.toLowerCase() === '/app/home' ||
        route.path.toLowerCase() === '/app/nucleic' ||
        route.path.toLowerCase() === '/app/dlyy/nucleic' ||
        route.path.toLowerCase() === '/app/examination' ||
        route.path.toLowerCase() === '/app/registry' ||
        route.path.toLowerCase().indexOf('app/login/direct') >= 0 ||
        route.path.toLowerCase().indexOf('app/login/media') >= 0
      );
    });
    // 2秒内5连击
    const multiClick = function (
      multiClickCallback: any,
      singleClickCallback: any,
      maxTimes = 5,
      time = 2000
    ) {
      state.clickTimes || (state.clickTimes = 0);
      ++state.clickTimes >= maxTimes &&
        (multiClickCallback && multiClickCallback(), singleClickCallback || (state.clickTimes = 0));
      state.clickTimes === 1 &&
        setTimeout(() => {
          state.clickTimes < maxTimes && singleClickCallback && singleClickCallback();
          state.clickTimes = 0;
        }, time);
    };
    // 5连击进入管理页
    const fiveClick = function (data: any, node: any) {
      multiClick(
        () => {
          state.clickTimes = 0;
          if (home.value === true) {
            console.log('打开manager');
            pushRouteWithoutParam(appRouteEnum.Manager);
          }
        },
        () => {},
        5,
        2000
      );
    };
    const onQuit = async function () {
      await eject();
    };
    return { ...toRefs(state), height, cardquit, home, multiClick, fiveClick, onQuit };
  },
});
</script>
<style lang="less" scoped>
.app-footer {
  width: 100%;
  height: 15%;
  position: relative;
  z-index: 999;
  background: transparent;
  /* 容器高度不变，内部子元素靠底部 */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 0.3rem; /* 底部留白，不贴最底边，可微调大小 */
  box-sizing: border-box;
}
.app-footer-ground {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 0;
  bottom: 0;
}
.footer-content {
  position: relative;
  width: 100%;
  padding-left: 0.3rem;
  z-index: 1;
  /* 高度不再占满，由内容自身高度决定 */
  height: auto;
  &-hospital {
    color: rgb(41, 22, 22);
    font-weight: 600;
    width: calc(~'100% - 4rem');
    p {
      margin-bottom: 5px;
    }
    a {
      margin-left: 0.4rem;
    }
  }
  &-quit {
    width: 4rem;
  }
  &-comp {
    color: #5e5f61;
  }
}
.waves {
  width: 100%;
  height: 100%;
  margin-bottom: -7px;
  min-height: 100%;
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
  animation-duration: 15s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 16s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
</style>
