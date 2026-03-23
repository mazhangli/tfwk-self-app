<template>
  <div class="content flex-r-c">
    <div class="flex-c-c" :style="{ height: '30%', width: '100%' }">
      <!-- <van-image width="20%" :src="icon" /> -->

      <van-col class="font-s relative text-middle bloder footer-content-hospital">
        <p class="font-xl" :style="{ 'font-family': '华文行楷', 'padding-top': '0.5rem' }">
          体检自助签到机
        </p>
      </van-col>
    </div>
    <div class="flex-c-c" :style="{ height: '70%', width: '100%' }">
      <alien-button
        :style="{ 'max-width': '70%', 'max-height': '50%' }"
        remark="请准备好身份证"
        @click="onSign"
        >预约登记</alien-button
      >
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
  import { pushRouteWithoutParam, appRouteEnum, pushRouteWithParam } from '@/router/router';
  import AlienButton from '@/components/terminal/button/AlienButton.vue';
  export default defineComponent({
    name: 'Examination',
    props: {},
    components: { AlienButton },
    setup(props) {
      const state = reactive({
        icon: null as any,
      });
      onBeforeMount(() => {
        state.icon = require('@/assets/logo/mhzyyhytj.svg');
      });
      onMounted(() => {});
      const onSign = async function () {
        console.log('签到');
        pushRouteWithoutParam(appRouteEnum.ExaminationLogin);
      };

      return { ...toRefs(state), onSign };
    },
  });
</script>

<style lang="less" scoped></style>
