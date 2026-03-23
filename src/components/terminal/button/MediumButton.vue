<template>
  <van-button plain v-preventReClick="2000" :style="[setClass]" @click="clicked">
    <div class="ground">
      <img :src="img" onerror="" />
    </div>
    <div class="contenor">
      <div class="contenor-null"></div>
      <div class="contenor-mask">
        <p class="font-m blod chinese">{{ medium.mediumname }}</p>
        <p class="font english">{{ medium.english }}</p>
      </div>
    </div>
  </van-button>
</template>
<script lang="ts">
import { defineComponent, computed, reactive, toRefs, ref } from 'vue';
export default defineComponent({
  name: 'MediumButton',
  components: {},

  props: {
    medium: Object,
  },
  setup(props, { attrs }) {
    let img = ref('');
    const clicked = () => {};
    const setClass = computed((): any => {
      let less: string[] = [];
      if (props.medium) {
        less = [
          'background:' + require('@/assets/img/button/' + props.medium.mediumimg),
          'width: 4.3rem',
          'height: 4.3rem',
          'margin: 0px',
          'box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.06)',
        ];
        img.value = require('@/assets/img/button/' + props.medium.mediumimg);
      } else {
        less = ['display:none'];
      }
      return less;
    });

    return {
      setClass,
      clicked,
      img,
    };
  },
});
</script>
<style lang="less" scoped>
.ground {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  img {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
.contenor {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  &-null {
    width: 100%;
    height: 75%;
  }
  &-mask {
    background: rgba(0, 0, 0, 0.3);
    border-top: gray solid 1px;
    width: 100%;
    height: 25%;
  }
}
// .mask {
//   background: rgba(0, 0, 0, 0.4);
//   position: relative;
//   height: 1rem;
//   width: 4.3rem;
//   align-items: flex-end;
// }
.chinese {
  color: #feeeed;
  vertical-align: middle;
  width: 100%;
  padding: 5px;
  line-height: 0.5rem;
}
.english {
  color: #feeeed;
  vertical-align: middle;
  width: 100%;
  line-height: 0.3rem;
}
</style>