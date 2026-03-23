<template>
  <div class="ScrollSelect">
    <van-picker
      title="标题"
      @change="onChange"
      :columns="list"
      :default-index="active"
      :show-toolbar="false"
      visible-item-count="9"
      item-height="1rem"
      :loading="loading"
      swipe-duration="700"
    />
  </div>
</template>

<script lang="ts">
import { Toast } from 'vant';
import { computed, defineComponent, onMounted, reactive, ref, toRef, toRefs } from 'vue';
export default defineComponent({
  name: 'ScrollSelect',
  props: {
    active: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    list: Array,
    align: {
      type: String,
      default: 'center',
    },
    change: Function,
  },
  components: {},
  setup(props) {
    const state = reactive({
      count: 0,
    });
    const onChange = (value: any, index: any) => {};
    return { ...props, onChange, ...toRefs(state) };
  },
});
</script>

<style lang="less" scoped>
.ScrollSelect {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2%;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  //box-shadow: inset 0px 1rem 1rem -1rem #fff, inset 0px -1rem 1rem -1rem #fff;
}

/deep/ .van-cell {
  background-color: transparent;
}
/deep/.van-cell::after {
  border-bottom: 1px solid #bbbbbd;
}
/deep/.van-cell__title {
  vertical-align: middle;
  text-align: center;
}

/deep/.van-picker {
  background-color: transparent;
}
/deep/.van-picker__mask {
  background-image: linear-gradient(
      180deg,
      hsla(0, 0%, 100%, 0.9),
      hsla(0, 0%, 100%, 0.5) 30%,
      hsla(0, 0%, 100%, 0) 40%
    ),
    linear-gradient(
      0deg,
      hsla(0, 0%, 100%, 0.9),
      hsla(0, 0%, 100%, 0.5) 30%,
      hsla(0, 0%, 100%, 0) 40%
    );
}
/deep/.van-picker-column__item {
  background-color: transparent;
  border-radius: 2px;
  box-shadow: 1px 7px 8px -6px rgba(#333, 0.2);
}
/deep/.van-picker-column__item--selected {
  background: #1989fa;
  color: #fff;
  border-radius: 2px;
}
</style>