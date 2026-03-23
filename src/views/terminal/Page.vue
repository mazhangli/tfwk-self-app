<template>
  <app-screen>
    <template v-slot:default>
      <div id="Home" :class="gethospital">
        <app-header class="apppage-header" /><!--  shadow-lg -->
        <div class="container" ref="root" id="root">
          <router-view>
            <template v-slot="{ Component, route }">
              <component :is="Component" :key="route.fullPath" />
            </template>
          </router-view>
        </div>
        <app-footer class="apppage-footer" />
      </div>
    </template>
  </app-screen>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, computed, onBeforeMount } from 'vue';
  import AppScreen from '@/views/terminal/Screen.vue';
  import AppHeader from '@/components/terminal/Header.vue';
  import AppFooter from '@/components/terminal/Footer.vue';
  import { useRoute } from 'vue-router';
  import { getStore } from '@/utils/cache/storage';
  export default defineComponent({
    name: 'AppPage',
    props: {
      fullScreen: Boolean,
    },
    components: { AppScreen, AppHeader, AppFooter },
    setup() {
      const state = reactive({
        hospital: '',
      });
      const route = useRoute();
      const home = computed(() => {
        return (
          route.path.toLowerCase() === '/app/home' ||
          route.path.toLowerCase() === '/app/nucleic' ||
          route.path.toLowerCase() === '/App/Dlyy/Nucleic'
        );
      });
      onBeforeMount(() => {
        state.hospital = getStore('machine').hospitalcode;
      });
      const gethospital = computed(() => {
        var classes= [];
        if(state.hospital != "mhzyy"){
          classes = ['apppage']
        }else{
          classes = ['apppage__mhzyy']
        }
        return classes;
      });
      return { ...toRefs(state), home ,gethospital };
    },
  });
</script>

<style lang="less" scoped>
  .router-fade-enter-active,
  .router-fade-leave-active {
    transition: opacity 0.8s;
    animation: bounceInLeft 0.5s;
    animation: bounceInOutRight 0.5s;
  }

  .router-fade-enter,
  .router-fade-leave-active {
    opacity: 0;
  }

  #Home {
    width: 100%;
    height: 100%;
  }
  .apppage__mhzyy { 
    background: url('~@/assets/img/ground1280x1024.gif') no-repeat !important;
    background-size: 100% 100% !important;
  }
  .apppage {
    position: absolute;
    //border: #fff 2px;
    // background: #fafafa;
    background: #f0f3ff;
    //background: url('~@/assets/img/ground1280x1024.gif') no-repeat;
    background-size: 100% 100%;

    &-header {
      //box-shadow: 1px 5px 9px 9px rgba(0, 0, 0, 0.1);
      position: relative;
      border-bottom: black;
    }

    &-footer {
      position: relative;
    }
  }

  .container {
    position: relative;
    width: 100%;
    height: 75%;
  }

  .container-full {
    width: 100%;
    height: 100%;
    z-index: 101;
  }
</style>
