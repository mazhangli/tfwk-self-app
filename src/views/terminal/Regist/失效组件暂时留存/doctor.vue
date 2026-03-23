<template>
  <div class="menupad flexbox flexbox-center flexbox-row">
      
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppButton from '@/components/terminal/button/MenuButton.vue';
export default defineComponent({
  name: 'Register',
  props: {},
  components: { AppButton },
  setup(props) {
    // onBeforeMount(async () => {
    //   const res = await menus();
    //   if (res === true) {
    //     tryOnMounted(() => {}, true);
    //   }
    // });
    return { ...props };
  },
});
</script>

<style lang="less">
.menupad {
  width: 100%;
  height: 100%;
}
</style>