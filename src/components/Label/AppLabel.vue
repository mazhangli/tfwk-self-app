<template>
  <span class="app-label" :style="classes">
    <!-- <p class="el-icon-user app-label-icon" /> -->
    <van-icon :name="icon" size="0.5rem" color="#1989fa" :style="{ padding: '0, 4px' }" />
    <p class="app-label-form font-m blod">{{ label }}</p>
    <p class="app-label-colon font-m blod">:</p>
    <p class="app-label-item font-m bloder">{{ text }}</p>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRef, toRefs } from 'vue';
export default defineComponent({
  name: 'AppLabel',
  props: {
    height: {
      type: String,
      default: '0.7rem',
    },
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },
  components: {},
  setup(props) {
    const classes = computed(() => {
      console.log();
      return {
        height: props.height,
        color: '#333',
      };
    });
    return { ...props, classes };
  },
});
</script>

<style lang="less" scoped>
.app-label {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  // vertical-align: middle;

  &-form {
    width: 1.5rem;
    // vertical-align: middle;
    text-align-last: justify;
    text-align: center;
    opacity: 0.9;
  }
  &-colon {
    width: 0.2rem;
    text-align: center;
    font-size: 0.4rem;
    opacity: 0.9;
  }
  &-item {
    font-size: 0.33rem;
    width: 2rem;
    color: #5e5f61;
    text-shadow: 1px 0px 0px #5e5f61;
  }
  &-icon {
    font-size: 0.5rem;
    height: auto;
  }
}
</style>