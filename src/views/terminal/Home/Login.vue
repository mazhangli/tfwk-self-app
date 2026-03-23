<template>
  <div class="content">
    <medium-pad />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import MediumPad from './MediumPad/Medium.pad.vue';
export default defineComponent({
  name: 'AppLogin',
  props: {},
  components: { MediumPad },
  setup() {

    return {
    };
  },
});
</script>

<style lang="less" scoped>

</style>
