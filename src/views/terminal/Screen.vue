<template>
  <div ref="screen" :class="center ? ['Screen', 'content_center'] : ['Screen', 'content_bottom']">
    <screen-ground v-if="fullScreen === false" />
    <div :class="[getClass]">
      <slot name="default" />
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeMount, reactive, toRefs } from 'vue';
  import ScreenGround from '@/components/Ground.vue';
  import { getStore } from '@/utils/cache/storage';
  export default defineComponent({
    name: 'AppScreen',
    props: {
      fullScreen: Boolean,
    },
    components: { ScreenGround },
    setup(props) {
      const state = reactive({
        center: true,
      });
      let fullScreen = true;
      onBeforeMount(() => {
        state.center = getStore('machine').hospitalcode === 'bjsftqzyyy' ? false : 
          (getStore('machine').hospitalcode === 'dlyy' && getStore('machine').redirect != 'registry.dlyy') ? false : true;
      });
      const getClass = computed(() => {
        console.log(state.center);
        if (
          window.document.documentElement.clientWidth >=
          window.document.documentElement.clientHeight
        ) {
          //横屏 | 方屏
          fullScreen = true;
        } else {
          //竖屏
          fullScreen = false;
        }
        if (
          getStore('machine').hospitalcode === 'bjftyy' ||
          getStore('machine').hospitalcode === 'mhzyy'  ||
          getStore('machine').hospitalcode === 'tfwk'  ||
          (getStore('machine').hospitalcode === 'dlyy' && getStore('machine').redirect === 'registry.dlyy')||
          getStore('machine').hospitalcode === 'bwjysq'||
          getStore('machine').hospitalcode === 'mhzyyhytj'||
          getStore('machine').hospitalcode === 'kdsqwsfwzx'||
          getStore('machine').hospitalcode === 'nyt'
        )
          fullScreen = true; //强制全屏
        if (window.location.href.toLowerCase().indexOf('/app/loader') >= 0) {
          fullScreen = true;
        }
        return fullScreen === true ? 'content-full' : 'content-part';
      });

      return { ...toRefs(state), ...props, getClass };
    },
  });
</script>

<style lang="less" scoped>
.Screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 100vw 100vh;
}

.content-part {
  position: absolute;
  height: calc(90vw / 1080 * 960);
  width: 99vw;
  z-index: 101;
  // box-shadow: 22px 22px 22px rgba(0, 0, 0, .12), 22px 22px 20px rgba(0, 0, 0, .04);
  //box-shadow: 1px 15px 15px 15px rgba(0, 0, 0, 0.12);
}

.content-part:before,
.content-part:after {
  z-index: -1;
  position: absolute;
  content: '';
  bottom: 5px;
  left: 5px;
  width: 50%;
  top: 95%;
  background: #777;
  -webkit-box-shadow: 0 15px 10px #777;
  -moz-box-shadow: 0 15px 10px #777;
  box-shadow: 0 15px 10px #777;
  -webkit-transform: rotate(-3deg);
  -moz-transform: rotate(-3deg);
  -o-transform: rotate(-3deg);
  -ms-transform: rotate(-3deg);
  transform: rotate(-3deg);
}

.content-part:after {
  -webkit-transform: rotate(3deg);
  -moz-transform: rotate(3deg);
  -o-transform: rotate(3deg);
  -ms-transform: rotate(3deg);
  transform: rotate(3deg);
  right: 5px;
  left: auto;
}

.content-full {
  width: 100%;
  height: 100%;
  z-index: 101;
}

.content_center {
  display: flex;
  display: -webkit-flex;
  flex: 1;
  justify-content: center;
  -webkit-justify-content: center;
  align-items: center;
  -webkit-align-items: center;
  flex-direction: row;
  -webkit-flex-direction: row;
  flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
}

.content_bottom {
  display: flex;
  display: -webkit-flex;
  flex: 1;
  justify-content: center;
  -webkit-justify-content: center;
  align-items: flex-end;
  -webkit-align-items: flex-end;
  flex-direction: row;
  -webkit-flex-direction: row;
  flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
}
</style>
