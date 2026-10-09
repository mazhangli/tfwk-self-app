<template>
  <van-button
    v-preventReClick="2000"
    :disabled="state.disabled === 'true'"
    :style="[setClass]"
    @click="login"
  >
    <div class="image flexbox-center-col">
      <img :src="state.img" onerror="" />
    </div>
    <div class="text flexbox flexbox-center">
      <p class="font-m blod chinese">{{ state.chinese }}</p>
      <p class="font-s english">{{ state.english }}</p>
    </div>
    <p v-if="state.disabled === 'true'" class="font-m blod disable">暂不启用</p>
  </van-button>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { propTypes } from '@/utils/propTypes';
import { hexToRGBo } from '@/utils/color';
import { getStore } from '@/utils/cache/storage';
import { pushRouteWithParam, appRouteEnum } from '@/router/router';
export default defineComponent({
  name: 'AppMenuButton',
  components: {},
  props: {
    type: propTypes.oneOf([
      'account',
      'register',
      'register.today',
      'register.schedule',
      'appointment',
      'payment',
      'lisreport',
      'medicine.collection',
      'medicine.purchase',
    ]),
  },
  setup(props, { attrs }) {
    const state = ref({
      img: '',
      bgcolor: 'gray',
      width: '3rem',
      height: '3.4rem',
      chinese: '挂   号',
      english: 'register',
      disabled: 'false',
    });
    let mediums = '';
    const search = function (array: Array<any>) {
      if (!array || array.length === 0) {
        return [];
      }
      return array.filter((item) => {
        if (item.menucode.toLowerCase() === props.type?.toLowerCase()) {
          return item;
        }
      });
    };

    const login = function () {
      //跳转登录页面
      pushRouteWithParam(appRouteEnum.userLogin, {
        mediums: mediums,
        menucode: props.type?.toLowerCase(),
      });
    };
    const setClass = computed((): any => {
      let less: string[] = [];
      const array = getStore('menu');
      const menu = search(array);
      if (menu && menu.length > 0) {
        console.log(menu[0]);
        //mediums = menu[0].mediums;
        mediums = JSON.stringify(menu[0].mediums);
        const icon = menu[0].menuicon || '';
        state.value.img = /^https?:\/\//.test(icon) || icon.startsWith('//')
          ? icon
          : require('@/assets/svg/button/' + icon);
        state.value.bgcolor = menu[0].menucolor;
        state.value.chinese = menu[0].menuname;
        state.value.english = menu[0].english;
        state.value.disabled = menu[0].disabled;
        const rgb = hexToRGBo(state.value.bgcolor);
        const webket =
          '-webkit-gradient(linear,left top, left bottom,from(rgba(' +
          rgb +
          ',0.5)),color-stop(30%, ' +
          state.value.bgcolor +
          '))';
        const normal =
          'linear-gradient(-180deg,rgba(' + rgb + ',0.5) 0%, ' + state.value.bgcolor + ' 30%)';
        less = [
          'background-image:' + webket,
          'background-image:' + normal,
          'width:' + state.value.width,
          'height:' + state.value.height,
          'margin: 3px',
          'border-radius: 8px',
          'box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        ];
      } else {
        less = ['display:none'];
      }
      return less;
    });
    const getBindValue = computed((): any => {
      return { ...attrs, ...props };
    });
    return { getBindValue, setClass, login, state, mediums };
  },
});
</script>
<style lang="less" scoped>
.image {
  height: 60%;
  width: 100%;
  img {
    width: 40%;
  }
}
.text {
  height: 40%;
  width: 100%;
}
.chinese {
  color: white;
  vertical-align: middle;
  width: 100%;
  margin: 0.1rem;
  line-height: 0.5rem;
}
.english {
  color: white;
  vertical-align: middle;
  width: 100%;
  line-height: 0.3rem;
}
.disable {
  color: black;
}
</style>