<template>
  <div class="picker">
    <div class="picker__wrapper">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了">
        <span v-for="(item, index) in list" :key="index">
          <picker-cell
            :value="item"
            :active="isActive(index)"
            :center="center"
            @click="onClick(index)"
          />
        </span>
      </van-list>
      <div class="picker__mask" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import PickerCell from '@/components/Picker/Picker.cell.vue';
export default defineComponent({
  name: 'Picker',
  props: {
    center: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    finished: {
      type: Boolean,
      default: true,
    },
    lineheight: {
      type: String,
      default: '1rem',
    },
    list: Array,
  },
  components: { PickerCell },
  setup(props, context) {
    const curactive = ref(0);
    const isActive = function (index: number) {
      if (index === curactive.value) {
        return true;
      } else {
        return false;
      }
    };
    const isSelect = function (index: number) {
      if (index === curactive.value) {
        return 'picker-selected';
      } else {
        return 'picker__disselected';
      }
    };
    const onClick = function (index: number) {
      curactive.value = index;
    };
    return {
      ...props,
      curactive,
      isActive,
      isSelect,
      onClick,
    };
  },
});
</script>

<style  lang="less" scoped>
.picker {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1%;
  -webkit-scrollbar: hidden;
  scrollbar-width: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  cursor: grab;
}
::-webkit-scrollbar-track {
  width: 0;
}
.picker__wrapper {
  background: rgba(#fff, 0.2);
}
// .picker__mask {
//   position: absolute;
//   top: 0;
//   left: 0;
//   z-index: 1;
//   width: 100%;
//   height: 100%;
//   background-image: linear-gradient(
//     0deg,
//     hsla(0, 0%, 100%, 0.7),
//     hsla(0, 0%, 100%, 0.5) 10%,
//     hsla(0, 0%, 100%, 0) 20%
//   );
//   background-repeat: no-repeat;
//   background-position: top, bottom;
//   pointer-events: none;
// }
.picker-selected {
  background-color: #1989fa !important;
  color: white !important;
}
.picker-disselected {
  //   background-color: rgba(#333, 0.1) !important;
  background-color: rgba(#fff, 0.9) !important;
  color: #333 !important;
}
.vant-cell__value_alone_deep {
  color: #fff !important;
}
.center {
  text-align: center;
}
.left {
  text-align: left;
}
.height {
  height: v-bind(lineheight);
  line-height: v-bind(lineheight);
}
// /deep/.van-cell {
//   background-color: transparent;
//   padding: 0;
//   border-radius: 2px;
//   border-right: 1px rgba(#333, 0.1) solid;
//   box-shadow: 1px 7px 8px -6px rgba(#333, 0.2);
// }
// // /deep/ .van-cell--clickable:active {
// //   background-color: #1989fa !important;
// // }
// /deep/.van-cell::after {
//   border: none;
// }
// // /deep/.van-cell:active {
// //   background-color: #1989fa;
// // }
// // /deep/.van-cell:hover {
// //   background-color: #1989fa;
// // }
// /deep/.van-cell__value {
//   height: v-bind(lineheight);
//   line-height: v-bind(lineheight);
// }
</style>
