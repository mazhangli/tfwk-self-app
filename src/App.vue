<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="router-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <!-- <router-view v-if="!$route.meta.keepAlive">
      <transition name="router-fade" mode="out-in"> </transition>
    </router-view> -->
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  export default defineComponent({
    name: 'App',
    props: {},
    components: {},
    setup(props) {
      let state = reactive({});
      onMounted(() => {
        document.body.addEventListener(
          'touchstart',
          function (event) {
            if (event.touches.length > 1) {
              event.preventDefault();
            }
          },
          { passive: false }
        );
      });

      return { ...props, ...toRefs(state) };
    },
  });
</script>
<style lang="less" scoped>
  .router-fade-enter-active,
  .router-fade-leave-active {
    transition: opacity 0.6s;
    animation: bounceInLeft 0.2s;
    animation: bounceInOutRight 0.2s;
  }

  .router-fade-enter,
  .router-fade-leave-active {
    opacity: 0.05;
  }
  #app {
    width: 100vw;
    height: 100vh;
    margin: 0;
    border: none;
    background: #fafafa;
    background: url('~@/assets/img/ground1080x1920.gif') no-repeat;
    background-size: contain;
    background-position: center center;
  }

  // // ::-webkit-scrollbar-track {
  // //   background: transparent;
  // //   border-radius: 0;
  // // }

  // ::-webkit-scrollbar {
  //   //-webkit-appearance: none;
  //   // width: 1rem;
  //   // height: 100%;
  //   position: relative;
  // }

  // ::-webkit-scrollbar-thumb {
  //   //cursor: pointer;

  //   //border-radius: 5px;
  //   //background: rgba(0, 0, 0, 0.25);
  //   background: url (~'@/assets/svg/scrollbar.button.svg');
  //   width: 1rem;
  //   height: 2rem;
  //   //transition: color 0.2s ease;
  // }
</style>
<style lang="less"></style>
