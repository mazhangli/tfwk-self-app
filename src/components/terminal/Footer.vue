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
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(217,183,249,0.3" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(177,219,252,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(170,185,219,0.4)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(170,185,219,0.2)" />
        </g>
      </svg>
    </div>
    <van-row justify="space-around" align="center" class="footer-content">
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
      <van-col class="relative text-middle-center blod footer-content-quit">
        <!-- <van-button
          type="primary"
          color="rgb(88, 94, 170)"
          class="quit shadow-md font-xl"
          v-if="home"
          @click="onQuit"
        >
          <template #default>
            <div class="flex-c">
              <van-image :src="cardquit" width="0.7rem" />
              <h2 class="font-m" style="color: #fff; margin-top: 0.1rem">退卡</h2>
            </div>
          </template>
        </van-button> -->
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
      //console.log(route.path.toLowerCase());
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
    // 2秒内5连击（默认）________________________
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
          state.clickTimes < maxTimes && singleClickCallback && singleClickCallback(); //执行单击
          state.clickTimes = 0;
        }, time);
    };
    // 双击树形节点(双击场景demo)________________________
    const fiveClick = function (data: any, node: any) {
      multiClick(
        () => {
          state.clickTimes = 0;
          //5连击
          console.log(home.value === true);
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
}

.app-footer-ground {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 0;
}

.footer-content {
  position: absolute;
  height: 100%;
  width: 100%;
  padding-left: 0.3rem;

  &-row {
    height: 100%;
  }

  &-cell {
    height: 100%;
    line-height: 100%;
  }

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
    //width: v-bind(height);
    height: 100%;
  }

  &-comp {
    color: #5e5f61;
  }
}

.footer-logo {
  height: 100%;
  width: 100%;
}

.hospital {
  text-align: left;
  vertical-align: middle;
  color: #5e5f61;
  line-height: 100%;
}

.quit {
  float: right;
  position: relative;
  border-top-left-radius: 90%;
  opacity: 1;
  width: v-bind(height);
  height: 100%;
  // height: ~'calc(100% - 1px)';
  // width: 0;
  // padding-left: 50%;
  border: none;
}

.waves {
  width: 100%;
  height: 100%;
  margin-bottom: -7px;
  /*Fix for safari gap*/
  min-height: 100%;
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

/*Shrinking for mobile*/
@media (max-width: 100%) {
  .waves {
    height: 100%;
    min-height: 100%;
  }
}
</style>
