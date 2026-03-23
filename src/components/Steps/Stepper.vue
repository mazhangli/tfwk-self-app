<template>
  <div class="stepper-pad">
    <van-steps :active="active" active-icon="success" inactive-icon="arrow" active-color="#38f">
      <van-step v-for="(step, index) in steps" :key="index">{{ step.name }}</van-step>
    </van-steps>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRef, toRefs } from 'vue';
export default defineComponent({
  name: 'AppStepper',
  props: {
    active: Number,
    steps: Array,
  },
  components: {},
  setup(props) {
    // computed(() => {
    //   const { active, steps } = props;
    //   console.log(active);
    // });

    return { ...props };
  },
});
</script>

<style lang="less" scoped>
.stepper {
  height: 100%;
  &-pad {
    padding-top: 1%;
    height: 1rem;
  }
}
// /deep/ .van-steps {
//   background-color: transparent;
// }
/deep/ .van-step__line {
  background-color: rgba(0, 0, 0, 0.5);
}
/deep/ .van-step--horizontal .van-step__icon {
  font-size: 0.35rem;
  padding-top: 0.1rem;
}
/deep/ .van-step--horizontal .van-step__title {
  font-size: 0.3rem;
}
/deep/ .van-steps {
  background-color: transparent;
}
/deep/.van-hairline {
  padding-bottom: 0.5rem;
}
/deep/ .van-step--horizontal .van-step__circle-container {
  background-color: #f7f8fa;
}
</style>