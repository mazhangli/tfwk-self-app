<template>
  <div class="appload">
    <div class="app-loading">
      <div class="app-loading-wrap">
        <img src="/resource/logo.svg" class="app-loading-logo" />
        <div class="app-loading-dots">
          <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
        </div>
        <van-button
          v-if="quited === true"
          color="linear-gradient(to right, #FF6347, #FF4500)"
          class="quit shadow-md font-xl"
          @click="drives"
          >退出</van-button
        >
      </div>
    </div>
    <div class="app-loading-foot">
      <van-divider
        :style="{ borderColor: '#87CEEB', padding: '0 3rem', width: '100%' }"
      ></van-divider>
      <p id="title">银医自助服务系统</p>
      <p id="compny">北京同方卫康科技有限公司提供技术支持</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { startup } from '@/trans/index';
import { appRouteEnum, pushRouteWithoutParam } from '@/router/router';
import { close, eject } from '@/trans/driver/src/other';
import { quit } from '@/trans/driver/src/system';
import { getStore } from '@/utils/cache/storage';

export default defineComponent({
  name: 'AppLoad',
  props: {},
  components: {},

  setup() {
    var index = 0;
    let quited = ref(false);
    const callup = async function () {
      const res = await startup();
      
      
      if (res === true) {
          pushRouteWithoutParam(appRouteEnum.appHome);
      } else {
        if (index < 3) {
          index++;
          console.log('正在尝试重新启动...第[' + index + ']次...');
          callup();
        } else {
          quited.value = true;
        }
      }
    };
    const drives = async function () {
      await eject();
      await close();
      await quit();
    };
    onMounted(async () => {
      callup();
    });
    return { quited, drives};
  },
});
</script>

<style lang="less" scoped>
.appload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: 100vw 100vh;
  background: #f0f2f5;
  background: url('~@/assets/img/ground1080x1920.gif') no-repeat;
  background-size: contain;
  background-position: center center;
}
.app-loading {
  display: flex;
  width: 100%;
  height: ~'calc(100% - 3rem)';
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.app-loading-foot {
  display: flex;
  width: 100%;
  height: 3rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  #compny {
    color: #5e5f61;
    font-size: 0.35rem;
    font-weight: bold;
  }
  #title {
    color: #5e5f61;
    font-size: 0.5rem;
    font-weight: bolder;
  }
}

.app-loading .app-loading-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .quit {
    margin-top: 1rem;
    width: 2.7rem;
    height: 1.2rem;
  }
}

.app-loading .dots {
  display: flex;
  padding: 98px;
  justify-content: center;
  align-items: center;
}

.app-loading .app-loading-logo {
  display: block;
  width: 300px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.dot {
  position: relative;
  display: inline-block;
  width: 96px;
  height: 96px;
  margin-top: 30px;
  font-size: 64px;
  transform: rotate(45deg);
  box-sizing: border-box;
  animation: antRotate 1.2s infinite linear;
}

.dot i {
  position: absolute;
  display: block;
  width: 40px;
  height: 40px;
  background-color: #0065cc;
  border-radius: 100%;
  opacity: 0.3;
  transform: scale(0.75);
  animation: antSpinMove 1s infinite linear alternate;
  transform-origin: 50% 50%;
}

.dot i:nth-child(1) {
  top: 0;
  left: 0;
}

.dot i:nth-child(2) {
  top: 0;
  right: 0;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.dot i:nth-child(3) {
  right: 0;
  bottom: 0;
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.dot i:nth-child(4) {
  bottom: 0;
  left: 0;
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}
@keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}
@-webkit-keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}
@keyframes antSpinMove {
  to {
    opacity: 1;
  }
}
@-webkit-keyframes antSpinMove {
  to {
    opacity: 1;
  }
}
</style>