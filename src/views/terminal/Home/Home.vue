<template>
  <div class="menupad flex-c">
    <span class="pad flex justify_center">
      <menu-pad />
    </span>
    <!-- <span class="con"> </span> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MenuPad from './MenuPad/MenuPad.vue';
export default defineComponent({
  name: 'Home',
  props: {},
  components: { MenuPad },
  setup() {    
    return { };
  },
});
</script>

<style lang="less">
.menupad {
  width: 100%;
  height: 100%;
  position: relative;
}
.pad {
  max-width: 90%;
  min-width: 90%;
  height: 100%;
}
.con {
  height: 15%;
}
</style>