<template>
  <div id="main"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
export default defineComponent({
  name: 'Main',
  props: {},
  components: {},
  setup(props) {
    let state = reactive({});

    onMounted(() => {
      document.body.addEventListener(
        'touchmove',
        function (event) {
          event.preventDefault();
        },
        false
      );
      document.body.addEventListener(
        'touchstart',
        function (event) {
          event.preventDefault();
        },
        false
      );
    });

    return { ...props, ...toRefs(state) };
  },
});
</script>
<style lang="less" scoped>
#main {
  width: 100vw;
  height: 100vh;
  margin: 0;
  border: none;
  background: #fafafa;
  background: url('~@/assets/img/ground.gif') no-repeat;
  background-size: 100% 100%;
}

</style>