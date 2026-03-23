<template>
  <div class="picker-cell">
    <van-cell
      :value="value"
      :center="center"
      :clickable="true"
      @click="onClick()"
      :style="{ 'background-color': bkgColor(), color: Color() }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'PickerCell',
  props: {
    center: {
      type: Boolean,
      default: true,
    },
    lineheight: {
      type: String,
      default: '0.8rem',
    },
    active: {
      type: Boolean,
      default: false,
    },
    value: null,
  },
  components: {},
  setup(props, context) {
    const state = reactive({
      color: '#333',
      backgroundColor: 'transparent',
    });
    const onClick = function () {};
    const bkgColor = function () {
      if (props.active === true) {
        state.backgroundColor = '#1989fa';
      } else {
        state.backgroundColor = '#fcfcfc';
      }
      return state.backgroundColor;
    };
    const Color = function () {
      if (props.active === true) {
        state.color = '#fff';
      } else {
        state.color = '#333';
      }
      return state.color;
    };
    return {
      ...props,
      ...toRefs(state),
      onClick,
      bkgColor,
      Color,
    };
  },
});
</script>

<style  lang="less" scoped>
.picker-cell {
  padding: 1px 0;
}

/deep/.van-cell {
  -webkit-box-shadow: 10px 10px 10px rgba(#333, 0.2);
  -moz-box-shadow: 10px 10px 10px rgba(#333, 0.2);
  box-shadow: 10px 10px 10px rgba(#333, 0.2);
}
/deep/.van-cell::after {
  border: none;
}
/deep/.van-cell__value {
  color: v-bind(color) !important;
}
/deep/.van-cell__value {
  height: v-bind(lineheight);
  line-height: v-bind(lineheight);
}
</style>
