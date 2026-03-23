<template>
  <div
    :class="menu.type === 'main' ? ['appmenu__main', 'flex-c-s'] : ['appmenu__query', 'flex-c-s']"
    ref="appmenu"
  >
    <!-- 主要的menu -->
    <div v-if="menu.type === 'main' && menu.children.length === 0" class="appmenu__main flex-c-s">
      <van-button
        v-preventReClick="2000"
        plain
        type="default"
        class="content menubotton"
        :style="[setClass]"
        @click="login()"
        :disabled="menu.disabled === 'true'"
      >
        <template #default>
          <div class="content">
            <div class="image">
              <van-image :src="img" width="50%" />
            </div>
            <div class="text flex-c-c">
              <p class="font-l blod chinese">{{ menu.menuname }}</p>
              <p class="font-m english">{{ menu.english }}</p>
            </div>
            <p v-if="menu.disabled === 'true'" class="font-m blod disable">暂不启用</p>
          </div>
        </template>
      </van-button>
    </div>
    <!-- query类别的menu -->
    <div v-if="menu.type === 'query'" class="appmenu__query">
      <van-button
        v-preventReClick="2000"
        plain
        type="default"
        class="content menubotton"
        :style="[setClass]"
        @click="login()"
        :disabled="menu.disabled === 'true'"
      >
        <template #default>
          <div class="content flex-r-s nav">
            <van-image :src="img" :style="[comsize]" />
            <div :style="{ width: 'calc(100% - 0.8rem)' }">
              <p class="font-l blod chinese">{{ menu.menuname }}</p>
              <p class="font-m blod chinese">{{ menu.english }}</p>
            </div>
            <p v-if="menu.disabled === 'true'" class="font-m blod disable">暂不启用</p>
          </div>
        </template>
      </van-button>
    </div>
    <!-- 含有子内容的menu -->
    <div
      v-if="menu.type === 'main' && menu.children.length > 0"
      class="appmenu__main appmenu__pack flex-c-s"
    >
      <div class="content menubotton menubotton__tran">
        <div class="appmenu flex-c-c">
          <div class="head flex-r">
            <van-image :src="img" width="20%" height="100%" />
            <div :style="{ width: '80%' }">
              <p class="font-l bloder chinese flex-r title">{{ menu.menuname }}</p>
            </div>
          </div>
          <div class="flex-c-c info">
            <div class="info__item">
              <van-button
                v-preventReClick="2000"
                plain
                type="default"
                class="content menubotton"
                :style="[setChildClass(0)]"
                @click="login(0)"
                :disabled="menu.children[0].disabled === 'true'"
              >
                <template #default>
                  <div class="content flex-r-s nav">
                    <van-image :src="menu.children[0].img" :style="[comsize]" class="sonimg" />
                    <p class="font-l blod chinese">{{ menu.children[0].menuname }}</p>
                    <p v-if="menu.children[0].disabled === 'true'" class="font-m blod disable">
                      暂不启用
                    </p>
                  </div>
                </template>
              </van-button>
            </div>
            <div class="info__item">
              <van-button
                v-preventReClick="2000"
                plain
                type="default"
                class="content menubotton"
                :style="[setChildClass(1)]"
                @click="login(1)"
                :disabled="menu.children[1].disabled === 'true'"
              >
                <template #default>
                  <div class="content flex-r-s nav">
                    <van-image :src="menu.children[1].img" :style="[comsize]" class="sonimg" />
                    <p class="font-l blod chinese">{{ menu.children[1].menuname }}</p>
                    <p v-if="menu.children[1].disabled === 'true'" class="font-m blod disable">
                      暂不启用
                    </p>
                  </div>
                </template>
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { appRouteEnum, pushRouteWithoutParam, pushRouteWithParam } from '@/router/router';
  import { menus, menuSuspends } from '@/trans';
  import { getStore, setStore } from '@/utils/cache/storage';
  import { hexToRGBo } from '@/utils/color';
  import { Toast } from 'vant';
  import { useRect } from '@vant/use';
  import { computed, defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
  import { Close, Open } from '@/utils/loading';
  import { scheduling$branch$cathe$set, scheduling$cathe$set } from '@/trans/server/his/register';
  export default defineComponent({
    name: 'AppMenu',
    props: {
      menu: {} as any,
    },
    components: {},
    setup(props, ctx) {
      const state = reactive({
        rect: null as any,
        menuRefresh: null as any,
        img: '',
      });
      const appmenu = ref();
      const setClass = computed((): any => {
        let less: string[] = [];
        if (props.menu) {
          const rgb = hexToRGBo(props.menu.menucolor);
          const webket =
            '-webkit-gradient(linear,left top, left bottom,from(rgba(' +
            rgb +
            ',0.5)),color-stop(30%, ' +
            props.menu.menucolor +
            '))';
          const normal =
            'linear-gradient(-180deg,rgba(' + rgb + ',0.5) 0%, ' + props.menu.menucolor + ' 30%)';
          less = [
            'background-image:' + webket,
            'background-image:' + normal,
            'box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            'padding: 3%',
          ];
        } else {
          less = ['display:none'];
        }
        return less;
      });
      const setChildClass = function (index: number) {
        let less: string[] = [];
        if (props.menu.children[index]) {
          const rgb = hexToRGBo(props.menu.children[index].menucolor);
          const webket =
            '-webkit-gradient(linear,right, left,from(rgba(' +
            rgb +
            ',0.7)),color-stop(50%, ' +
            props.menu.children[index].menucolor +
            '))';
          const normal =
            'linear-gradient(to right,rgba(' +
            rgb +
            ',0.7) 0%, ' +
            props.menu.children[index].menucolor +
            ' 50%)';
          less = [
            'background-image:' + webket,
            'background-image:' + normal,
            'box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            'padding: 3%',
          ];
        } else {
          less = ['display:none'];
        }
        return less;
      };
      onMounted(() => {});
      const comsize = computed(() => {
        state.rect = useRect(appmenu);
        var less = [];
        if (state.rect.width >= state.rect.height) {
          less = ['width: ' + (state.rect.height / 3) * 2 + 'px'];
        } else {
          less = ['width: ' + (state.rect.width / 3) * 2 + 'px'];
        }
        return less;
      });
      onBeforeMount(() => {
        state.menuRefresh = props.menu;
        state.img = require('@/assets/svg/button/' + props.menu.menuicon + '');
        if (props.menu.children && props.menu.children.length > 0) {
          props.menu.children[0].img = require('@/assets/svg/button/' +
            props.menu.children[0].menuicon +
            '');
          props.menu.children[1].img = require('@/assets/svg/button/' +
            props.menu.children[1].menuicon +
            '');
        }
      });

      const login = async function (index?: number) {
        if (props?.menu?.menucode?.includes('regist')) {
          // 使用 setTimeout（宏任务）让代码在主栈清空后执行，完全不阻塞主业务
          setTimeout(async () => {
            try {
              await scheduling$cathe$set().catch((err) =>
                console.debug('scheduling$cathe$set执行失败:', err)
              );
              await scheduling$branch$cathe$set().catch((err) =>
                console.debug('scheduling$branch$cathe$set执行失败:', err)
              );
              console.debug('菜单判断后执行缓存设置成功');
            } catch (error) {
              console.debug('菜单判断后执行缓存设置失败:', error);
            }
          }, 0);
        }

         console.log('记录登录');
        //跳转登录页面
        if (index === 0 || index === 1) {
          // if (props.menu.children[index].suspended === "true") {
          if (props.menu.menucode === '') Open('正在查询当前是否超出使用时间，请稍后...');
          var suspends = (await menuSuspends(props.menu.menucode?.toLowerCase())) as any;
          Close();
          //console.log(suspends);
          if (suspends && suspends.suspended === 'true') {
            Toast({
              message: suspends.suspendedReason,
              className: 'mat_vant__toast',
            });
            return;
          }
          state.menuRefresh = getStore('menu').filter((query: { menucode: string }) => {
            if (query.menucode.toLowerCase() === props.menu.menucode?.toLowerCase()) {
              return query;
            }
          })[0];
          // }
          // if (state.menuRefresh && state.menuRefresh.children[index].suspended === 'true') {
          //   Toast({
          //     message: state.menuRefresh.children[index].suspendedReason,
          //     className: 'mat_vant__toast',
          //   });
          //   return;
          // }
          setStore('last', { menuCode: props.menu.children[index].menucode });
          switch (props.menu.children[index].menucode) {
            case 'charge.standards':
              pushRouteWithoutParam(appRouteEnum.BasicItem);
              break;
            case 'staff.nuclein':
            case 'nosocomial.nuclein':
            case 'dlyy.examine':
              pushRouteWithParam(appRouteEnum.userLoginMedia, {
                menucode: props.menu.children[index].menucode?.toLowerCase(),
              });
              break;
            case 'medical.record.print':
              if (getStore('machine').hospitalcode.toLowerCase() === 'mhzyy') {
                pushRouteWithParam(appRouteEnum.userLoginDirect, {
                  menucode: props.menu.menucode?.toLowerCase(),
                });
              } else {
                pushRouteWithParam(appRouteEnum.userLogin, {
                  mediums: JSON.stringify(props.menu.mediums),
                  menucode: props.menu.menucode?.toLowerCase(),
                });
              }
              break;
            case 'Report.bUltrasonics':
              pushRouteWithParam(appRouteEnum.bUltrasonicsReport, {
                mediums: JSON.stringify(props.menu.mediums),
                menucode: props.menu.menucode?.toLowerCase(),
              });
              break;
            case 'medical.proof.print':
            case 'medical.prescription.print':
            case 'lisreport':
              console.log('民航登录');
              pushRouteWithParam(appRouteEnum.userLoginDirect, {
                menucode: props.menu.children[index].menucode?.toLowerCase(),
              });
              break;
            default:
              pushRouteWithParam(appRouteEnum.userLogin, {
                mediums: JSON.stringify(props.menu.children[index].mediums),
                menucode: props.menu.children[index].menucode?.toLowerCase(),
              });
              break;
          }
        } else {
          //// if (props.menu.suspended === "true") {
          Open('正在查询当前是否超出使用时间，请稍后...');
          var suspends = (await menuSuspends(props.menu.menucode?.toLowerCase())) as any;
          Close();
          //console.log(suspends);
          if (suspends && suspends.suspended === 'true') {
            Toast({
              message: suspends.suspendedReason,
              className: 'mat_vant__toast',
            });
            return;
          }
          state.menuRefresh = getStore('menu').filter((query: { menucode: string }) => {
            if (query.menucode.toLowerCase() === props.menu.menucode?.toLowerCase()) {
              return query;
            }
          })[0];
          // // }
          // if (state.menuRefresh.suspended === 'true') {
          //   Toast({
          //     message: state.menuRefresh.suspendedReason,
          //     className: 'mat_vant__toast',
          //   });
          //   return;
          // }
          if (props.menu.subfield && props.menu.subfield.length > 0) {
            if (ctx) ctx.emit('subfield', props.menu.subfield);
            return;
          }
          setStore('last', { menuCode: props.menu.menucode });
          switch (props.menu.menucode) {
            case 'account':
              pushRouteWithoutParam(appRouteEnum.PatientCreate);
              break;
            case 'charge.standards':
              pushRouteWithoutParam(appRouteEnum.BasicItem);
              break;
            case 'staff.nuclein':
            case 'nosocomial.nuclein':
              pushRouteWithParam(appRouteEnum.userLoginMedia, {
                menucode: props.menu.menucode?.toLowerCase(),
              });
              break;
            case 'dlyy.nucleic.appointment':
            case 'dlyy.nucleic.today':
            case 'dlyy.examine':
              pushRouteWithParam(appRouteEnum.userLoginMedia, {
                menucode: props.menu.menucode?.toLowerCase(),
              });
              break;
            case 'examination':
              pushRouteWithParam(appRouteEnum.Examination, {
                menucode: props.menu.menucode?.toLowerCase(),
              });
              break;
            case 'medical.record.print':
              if (getStore('machine').hospitalcode.toLowerCase() === 'mhzyy') {
                pushRouteWithParam(appRouteEnum.userLoginDirect, {
                  menucode: props.menu.menucode?.toLowerCase(),
                });
              } else {
                pushRouteWithParam(appRouteEnum.userLogin, {
                  mediums: JSON.stringify(props.menu.mediums),
                  menucode: props.menu.menucode?.toLowerCase(),
                });
              }
              break;
            case 'medical.proof.print':
            case 'medical.prescription.print':
            case 'medical.transfer.print':
            case 'medical.invoice.print':
            case 'registry.mhzyy':
              pushRouteWithParam(appRouteEnum.userLoginDirect, {
                menucode: props.menu.menucode?.toLowerCase(),
              });
              break;
            case 'lisreport':
              if (getStore('machine').hospitalcode.toLowerCase() === 'mhzyy') {
                pushRouteWithParam(appRouteEnum.userLoginDirect, {
                  menucode: props.menu.menucode?.toLowerCase(),
                });
              } else {
                pushRouteWithParam(appRouteEnum.userLogin, {
                  mediums: JSON.stringify(props.menu.mediums),
                  menucode: props.menu.menucode?.toLowerCase(),
                });
              }
              break;
            case 'lisreport.new':
              pushRouteWithParam(appRouteEnum.userLogin, {
                mediums: JSON.stringify(props.menu.mediums),
                menucode: props.menu.menucode?.toLowerCase(),
              });
              break;
            case 'registry.dlyy':
              pushRouteWithParam(appRouteEnum.RegistryDlyy, {
                mediums: JSON.stringify(props.menu.mediums),
                menucode: props.menu.menucode?.toLowerCase(),
              });
              break;

            default:
              pushRouteWithParam(appRouteEnum.userLogin, {
                mediums: JSON.stringify(props.menu.mediums),
                menucode: props.menu.menucode?.toLowerCase(),
              });
              break;
          }
        }
      };
      return {
        ...props,
        ...toRefs(state),
        setClass,
        setChildClass,
        login,
        appmenu,
        comsize,
      };
    },
  });
</script>

<style lang="less" scoped>
  .appmenu {
    position: relative;
    // height: 4rem;
    // width: 4.5rem;
    // max-height: 4rem;
    // max-width: 4.5rem;
    width: 100%;
    height: 100%;
    max-width: 50vw;
    max-height: 50vh;

    &__main {
      // height: 4rem;
      // width: 4.5rem;
      width: 100%;
      height: 100%;
      max-width: 50vw;
      max-height: 50vh;
    }

    &__query {
      // height: ~'calc(2rem - 0.05rem)';
      // width: 4.5rem;
      //padding: 10px;
      width: 100%;
      height: 100%;
      max-width: 50vw;
      max-height: 50vh;
    }

    //&__hasson {}
  }

  .menubotton {
    border-radius: 1em;

    &__tran {
      background: rgba(#333, 0.3) !important;
    }
  }

  .sonimg {
    transform: scale(0.65, 0.65);
  }

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

  .nav {
    padding: 5%;
  }

  .head {
    width: 100%;
    height: 15%;
  }

  .info {
    width: 90%;
    height: 80%;

    &__item {
      height: 50%;
      width: 100%;
      padding: 8px 8px 8px;
    }
  }

  /deep/ .van-button--default {
    border: none;
    padding: 0;
  }
</style>
