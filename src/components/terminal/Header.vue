<template>
  <div class="app-header">
    <van-row justify="space-around" align="center" class="header-content">
      <van-col span="2" class="header-content-cell">
        <div class="flexbox-center header-content-row">
          <van-image height="100%" fit="scale-down" :src="icon" class="icon" />
          <!-- <img class="img-cover" src="@/assets/logo/bjsftqnyyy.svg" /> -->
        </div>
      </van-col>
      <van-col span="17" class="font-xl relative text-middle bloder header-content-hospital">
        {{ hosp }}
      </van-col>

      <van-col span="5" class="relative text-middle-center">
        <p class="font-xl blod">{{ time }}</p
        ><p class="font-s">{{ date }}</p>
      </van-col>
    </van-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue';
  import { getStore } from '@/utils/cache/storage';
  import { formatToDayDate, formatNowTime } from '@/utils/dateUtil';

  export default defineComponent({
    name: 'AppHeader',
    props: {},
    components: {},

    setup() {
      let timer: IntervalHandle;
      const state = reactive({
        date: '',
        time: '',
        hosp: '',
        icon: null as any,
      });
      onMounted(() => {
        start();
        const machine = getStore('machine');
        state.hosp = machine.hospitalname;
        const logo = machine.hospitallogo;
        state.icon = logo
          ? (/^https?:\/\//.test(logo) || logo.startsWith('//')
              ? logo
              : require('@/assets/logo/' + logo))
          : require('@/assets/logo/' + machine.hospitalcode + '.svg');
      });
      onUnmounted(() => {
        stop();
      });
      const update = () => {
        state.date = formatToDayDate();
        state.time = formatNowTime();
      };
      function start() {
        update();
        clearInterval(timer);
        timer = setInterval(() => update(), 1000);
      }
      function stop() {
        clearInterval(timer);
      }
      return { ...toRefs(state) };
    },
  });
</script>

<style lang="less" scoped>
  .app-header {
    width: 100%;
    height: 10%;
    position: absolute;
    z-index: 999;
    background: transparent;
    padding-left: 0.2rem;
  }
  .app-header-ground {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 0;
  }
  .header-content {
    position: absolute;
    height: 100%;
    width: 100%;
    &-row {
      height: 100%;
    }
    &-cell {
      height: 100%;
      line-height: 100%;
    }
    &-hospital {
      font-family: Microsoft YaHei;
      color: #5e5f61;
    }
    &-imp {
      color: red;
      font-size: 600;
    }
  }
  .icon {
    padding-top: 2%;
  }
  .header-logo {
    height: 100%;
    width: 100%;
  }
  .hospital {
    text-align: left;
    vertical-align: middle;
    color: #5e5f61;
    line-height: 100%;
  }
</style>
