<template>
  <div v-if="isPictrue" style="width: 100%;height: 50%;top: 0px;z-index: 101; position: absolute;">
    <van-image width="100%" height="100%" :src="require('@/assets/img/gif/'+pictrue)" fit="contain" />
  </div>
  <div id="dynamicbg-box">
    <!-- <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div>
    <div style="z-index: 100"></div> -->
  </div>
</template>

<style lang="less" scoped>
#dynamicbg-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  // background: linear-gradient(to bottom, #67b0fa 0%, #66c7fe 50%, #f5f5f5 50%) url('~@/assets/img/ground1080x1920.gif') no-repeat fixed center;
  background-image: linear-gradient(to bottom, #67b0fa 0%, #66c7fe 50%, #f5f5f5 50%);
}

#dynamicbg-box>div {
  background-color: rgba(0, 0, 0);
  position: relative;
  top: 105vh;
  //infinite   表示循环
  animation: dynamicDiv 13s linear infinite;
  opacity: 0.3;
}

#dynamicbg-box>div:nth-of-type(1) {
  animation-delay: 1s;
}

//等待几秒开始动画
#dynamicbg-box>div:nth-of-type(2) {
  animation-delay: 2s;
}

#dynamicbg-box>div:nth-of-type(3) {
  animation-delay: 3s;
}

#dynamicbg-box>div:nth-of-type(4) {
  animation-delay: 4s;
}

#dynamicbg-box>div:nth-of-type(5) {
  animation-delay: 5s;
}

#dynamicbg-box>div:nth-of-type(6) {
  animation-delay: 6s;
}

#dynamicbg-box>div:nth-of-type(7) {
  animation-delay: 7s;
}

#dynamicbg-box>div:nth-of-type(8) {
  animation-delay: 9s;
}

#dynamicbg-box>div:nth-of-type(9) {
  animation-delay: 11s;
}

#dynamicbg-box>div:nth-of-type(10) {
  animation-delay: 13s;
}

#dynamicbg-box>div:nth-of-type(11) {
  animation-delay: 14s;
}

//等待几秒开始动画
#dynamicbg-box>div:nth-of-type(12) {
  animation-delay: 16s;
}

#dynamicbg-box>div:nth-of-type(13) {
  animation-delay: 19s;
}

#dynamicbg-box>div:nth-of-type(14) {
  animation-delay: 35s;
}

#dynamicbg-box>div:nth-of-type(15) {
  animation-delay: 39s;
}

@keyframes dynamicDiv {
  form {
    top: 105vh;
    transform: scale(1.2);
    transform: rotateX(-30deg) rotateY(0deg);
  }

  to {
    top: -13vh;
    transform: scale(1);
    transform: rotateX(-30deg) rotateY(360deg);
  }
}
</style>
<script lang="ts">
import { getStore } from '@/utils/cache/storage';
import { onMounted, defineComponent, computed } from 'vue';
export default defineComponent({
  name: 'ScreenGround',
  components: {},
  setup() {
    const isPictrue = computed(() => {
      return (getStore('machine').hospitalcode === 'bjsftqzyyy'||getStore('machine').hospitalcode === 'dlyy')  && getStore('machine').redirect != 'registry.dlyy'? true : false;
    });
    const pictrue = computed(() => {
      return getStore('machine').hospitalcode === 'bjsftqzyyy'? "nyyy.gif": "dlyy.gif";
    });
    onMounted(() => {
      var box = document.getElementById('dynamicbg-box');
      if (box) {
        var div = box.getElementsByTagName('div');
        var math = [0, 3];
        for (var i = 0; i < div.length; i++) {
          math[1] = randomDec(1, 4);
          if (math[1] != math[2]) {
            div[i].style.width = math[1] + 'rem';
            div[i].style.height = math[1] + 'rem';
            math[2] = math[1];
          }
        }
        for (var i = 0; i < div.length; i++) {
          div[i].style.left = randomNum(97, 3) + 'vw';
          div[i].style.transform = 'rotate(' + randomNum(360, 5) + 'deg)';
          div[i].style.background =
            'rgb(' +
            randomNum(219, 16) +
            ',' +
            randomNum(144, 78) +
            ',' +
            randomNum(199, 139) +
            ')';
          //div[i].style.opacity = '0.2';
        }
      }
    });
    function randomNum(min: number, max: number) {
      max = max + 1;
      return Math.floor(Math.random() * (max - min) + min);
    }
    function randomDec(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
    return { isPictrue,pictrue };
  },
});
</script>