<template>
  <div class="normalformpad"> <div class="border"></div> </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'AppFormNormal',
  props: {},
  components: {},
  setup() {
    return {};
  },
});
</script>

<style lang="less">
.normalformpad {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 2%;
}
.border{
    background: rgba(#fff, 0.3);
    border-radius: 6px;
}
</style>