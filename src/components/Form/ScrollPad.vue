<template>
  <div class="ScrollPad">
    <!-- <el-scrollbar :native="false" max-height="40px"> -->
    <el-scrollbar :native="false" wrapStyle="" wrapClass="" viewClass="" viewStyle="">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ScrollPad',
  props: {},
  components: {},
  setup() {
    return {};
  },
});
</script>

<style lang="less">
.ScrollPad {
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 1%;
  padding-bottom: 1%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

// .el-scrollbar__bar.is-vertical {
//   position: absolute;
//   width: 1rem !important;
// }

// .el-scrollbar__thumb {
//   background-color: transparent;
// }
// .el-scrollbar__thumb:hover {
//   width: 1rem;
//   height: 1.3rem;
//   background: transparent;
//   background-color: transparent;
//   background-image: url('~@/assets/svg/scrollbar.button.svg');
//   background-repeat: no-repeat;
//   background-size: 100% 100%;
//   -moz-background-size: 100% 100%;
// }
</style>