<template>
  <!-- 主菜单 / 查询菜单（无子菜单） -->
  <div
    v-if="menu.type !== 'main' || menu.children.length === 0"
    ref="cardRef"
    class="menu-card"
    :class="[orientation, { disabled: menu.disabled === 'true' }]"
    :style="cardStyle"
    @click="onClick"
  >
    <!-- 图标区：固定占卡片高度 35%，object-fit contain 保证完整显示 -->
    <div class="menu-card__icon">
      <img :src="img" alt="" />
    </div>
    <!-- 文字区 -->
    <div class="menu-card__text">
      <p class="menu-card__cn">{{ menu.menuname }}</p>
      <p class="menu-card__en">{{ menu.english }}</p>
    </div>
    <div v-if="menu.disabled === 'true'" class="menu-card__mask"><span>暂不启用</span></div>
  </div>

  <!-- 含子菜单 -->
  <div
    v-else
    class="menu-card menu-card--pack"
    :style="cardStyle"
  >
    <div class="menu-card__head">
      <img :src="img" alt="" class="menu-card__head-icon" />
      <p class="menu-card__head-title">{{ menu.menuname }}</p>
    </div>
    <div class="menu-card__children">
      <div
        v-for="(child, i) in menu.children.slice(0, 2)"
        :key="i"
        class="menu-card__child"
        :class="{ disabled: child.disabled === 'true' }"
        :style="childStyle(i)"
        @click="onClick(i)"
      >
        <img :src="childImg(i)" alt="" class="menu-card__child-icon" />
        <p class="menu-card__child-name">{{ child.menuname }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { appRouteEnum, pushRouteWithoutParam, pushRouteWithParam } from '@/router/router';
import { menuSuspends } from '@/trans';
import { getStore, setStore } from '@/utils/cache/storage';
import { hexToRGBo } from '@/utils/color';
import { Toast } from 'vant';
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue';
import { Close, Open } from '@/utils/loading';
import { scheduling$branch$cathe$set, scheduling$cathe$set } from '@/trans/server/his/register';

const resolveIcon = (ic: string): string => {
  if (!ic) return '';
  if (/^https?:\/\//.test(ic) || ic.startsWith('//') || ic.startsWith('/')) return ic;
  try {
    return require('@/assets/svg/button/' + ic);
  } catch {
    return ic;
  }
};

export default defineComponent({
  name: 'AppMenu',
  props: {
    menu: { type: Object as any, default: () => ({}) },
  },
  emits: ['subfield'],
  setup(props, { emit }) {
    const cardRef = ref<HTMLElement | null>(null);
    const orientation = ref<'portrait' | 'landscape'>('portrait');
    let ro: ResizeObserver | null = null;

    const state = reactive({
      img: '',
      childImgs: [] as string[],
    });

    state.img = resolveIcon(props.menu?.menuicon);
    if (props.menu?.children?.length) {
      state.childImgs = props.menu.children.map((c: any) => resolveIcon(c?.menuicon));
    }

    // 根据卡片宽高比切换方向：宽>高 → landscape（横向居中），高>=宽 → portrait（纵向居中）
    const updateOrientation = () => {
      const el = cardRef.value;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      orientation.value = width > height ? 'landscape' : 'portrait';
    };

    onMounted(() => {
      updateOrientation();
      ro = new ResizeObserver(updateOrientation);
      if (cardRef.value) ro.observe(cardRef.value);
    });

    onUnmounted(() => {
      if (ro) ro.disconnect();
    });

    const childImg = (i: number) => state.childImgs[i] || '';

    // 卡片渐变背景
    const cardStyle = computed(() => {
      const color = props.menu.menucolor || '#468AFD';
      const rgb = hexToRGBo(color);
      return {
        backgroundImage: `linear-gradient(-180deg, rgba(${rgb},0.5) 0%, ${color} 30%)`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      };
    });

    const childStyle = (i: number) => {
      const child = props.menu.children?.[i];
      if (!child) return {};
      const color = child.menucolor || '#468AFD';
      const rgb = hexToRGBo(color);
      return {
        backgroundImage: `linear-gradient(to right, rgba(${rgb},0.7) 0%, ${color} 50%)`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      };
    };

    const onClick = async (index?: number) => {
      if (props.menu.disabled === 'true') return;

      if (props?.menu?.menucode?.includes('regist')) {
        setTimeout(async () => {
          try {
            await scheduling$cathe$set().catch((err) => console.debug('scheduling$cathe$set失败:', err));
            await scheduling$branch$cathe$set().catch((err) => console.debug('scheduling$branch$cathe$set失败:', err));
          } catch (error) {
            console.debug('缓存设置失败:', error);
          }
        }, 0);
      }

      // 子菜单点击
      if (index === 0 || index === 1) {
        Open('正在查询当前是否超出使用时间，请稍后...');
        const suspends = (await menuSuspends(props.menu.menucode?.toLowerCase())) as any;
        Close();
        if (suspends && suspends.suspended === 'true') {
          Toast({ message: suspends.suspendedReason, className: 'mat_vant__toast' });
          return;
        }
        const child = props.menu.children[index];
        setStore('last', { menuCode: child.menucode });
        switch (child.menucode) {
          case 'charge.standards':
            pushRouteWithoutParam(appRouteEnum.BasicItem);
            break;
          case 'staff.nuclein':
          case 'nosocomial.nuclein':
          case 'dlyy.examine':
            pushRouteWithParam(appRouteEnum.userLoginMedia, { menucode: child.menucode?.toLowerCase() });
            break;
          case 'medical.record.print':
            if (getStore('machine').hospitalcode.toLowerCase() === 'mhzyy') {
              pushRouteWithParam(appRouteEnum.userLoginDirect, { menucode: props.menu.menucode?.toLowerCase() });
            } else {
              pushRouteWithParam(appRouteEnum.userLogin, { mediums: JSON.stringify(props.menu.mediums), menucode: props.menu.menucode?.toLowerCase() });
            }
            break;
          case 'Report.bUltrasonics':
            pushRouteWithParam(appRouteEnum.bUltrasonicsReport, { mediums: JSON.stringify(props.menu.mediums), menucode: props.menu.menucode?.toLowerCase() });
            break;
          case 'medical.proof.print':
          case 'medical.prescription.print':
          case 'lisreport':
            pushRouteWithParam(appRouteEnum.userLoginDirect, { menucode: child.menucode?.toLowerCase() });
            break;
          default:
            pushRouteWithParam(appRouteEnum.userLogin, { mediums: JSON.stringify(child.mediums), menucode: child.menucode?.toLowerCase() });
            break;
        }
        return;
      }

      // 主菜单点击
      Open('正在查询当前是否超出使用时间，请稍后...');
      const suspends = (await menuSuspends(props.menu.menucode?.toLowerCase())) as any;
      Close();
      if (suspends && suspends.suspended === 'true') {
        Toast({ message: suspends.suspendedReason, className: 'mat_vant__toast' });
        return;
      }
      if (props.menu.subfield && props.menu.subfield.length > 0) {
        emit('subfield', props.menu.subfield);
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
          pushRouteWithParam(appRouteEnum.userLoginMedia, { menucode: props.menu.menucode?.toLowerCase() });
          break;
        case 'dlyy.nucleic.appointment':
        case 'dlyy.nucleic.today':
        case 'dlyy.examine':
          pushRouteWithParam(appRouteEnum.userLoginMedia, { menucode: props.menu.menucode?.toLowerCase() });
          break;
        case 'examination':
          pushRouteWithParam(appRouteEnum.Examination, { menucode: props.menu.menucode?.toLowerCase() });
          break;
        case 'medical.record.print':
          if (getStore('machine').hospitalcode.toLowerCase() === 'mhzyy') {
            pushRouteWithParam(appRouteEnum.userLoginDirect, { menucode: props.menu.menucode?.toLowerCase() });
          } else {
            pushRouteWithParam(appRouteEnum.userLogin, { mediums: JSON.stringify(props.menu.mediums), menucode: props.menu.menucode?.toLowerCase() });
          }
          break;
        case 'medical.proof.print':
        case 'medical.prescription.print':
        case 'medical.transfer.print':
        case 'medical.invoice.print':
        case 'registry.mhzyy':
          pushRouteWithParam(appRouteEnum.userLoginDirect, { menucode: props.menu.menucode?.toLowerCase() });
          break;
        case 'lisreport':
          if (getStore('machine').hospitalcode.toLowerCase() === 'mhzyy') {
            pushRouteWithParam(appRouteEnum.userLoginDirect, { menucode: props.menu.menucode?.toLowerCase() });
          } else {
            pushRouteWithParam(appRouteEnum.userLogin, { mediums: JSON.stringify(props.menu.mediums), menucode: props.menu.menucode?.toLowerCase() });
          }
          break;
        case 'lisreport.new':
          pushRouteWithParam(appRouteEnum.userLogin, { mediums: JSON.stringify(props.menu.mediums), menucode: props.menu.menucode?.toLowerCase() });
          break;
        case 'registry.dlyy':
          pushRouteWithParam(appRouteEnum.RegistryDlyy, { mediums: JSON.stringify(props.menu.mediums), menucode: props.menu.menucode?.toLowerCase() });
          break;
        default:
          pushRouteWithParam(appRouteEnum.userLogin, { mediums: JSON.stringify(props.menu.mediums), menucode: props.menu.menucode?.toLowerCase() });
          break;
      }
    };

    return { cardRef, orientation, cardStyle, childStyle, childImg, img: state.img, onClick };
  },
});
</script>

<style lang="less" scoped>
/* ============================================================
   卡片容器
   ============================================================ */
.menu-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 4% 6%;
  /* 顶部高光，增加立体感 */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 45%;
    background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
    z-index: 1;
  }
  /* 内容层级高于高光 */
  > * {
    position: relative;
    z-index: 2;
  }
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  &:active:not(.disabled) {
    transform: scale(0.96);
  }
  &.disabled {
    cursor: not-allowed;
  }
}

/* ============================================================
   横向（landscape）：图标在左、文字在右
   ============================================================ */
.menu-card.landscape {
  flex-direction: row;
  gap: 0.3rem;
  .menu-card__icon {
    width: 1.2rem;
    height: 1.2rem;
    flex: 0 0 1.2rem;
  }
  .menu-card__text {
    width: auto;
    flex: 0 1 auto;
    text-align: left;
    align-items: flex-start;
  }
}

/* ============================================================
   图标区
   ============================================================ */
.menu-card__icon {
  flex: 0 0 auto;
  width: 100%;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    /* 图标投影，增加层次感 */
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));
  }
}

/* ============================================================
   文字区
   ============================================================ */
.menu-card__text {
  flex: 0 1 auto;
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.menu-card__cn {
  color: #fff;
  font-size: 0.38rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 0.02em;
  margin: 0;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0,0,0,0.15);
}

.menu-card__en {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.22rem;
  font-weight: 400;
  line-height: 1.3;
  margin: 0.08rem 0 0;
  max-width: 100%;
  /* 英文最多 2 行，超出省略 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-word;
}

/* ============================================================
   禁用遮罩：背景模糊 + 半透明
   ============================================================ */
.menu-card__mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 3;
  span {
    color: #fff;
    font-size: 0.3rem;
    padding: 0.12rem 0.36rem;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.4);
    white-space: nowrap;
  }
}

/* ============================================================
   含子菜单卡片
   ============================================================ */
.menu-card--pack {
  background: rgba(51, 51, 51, 0.3) !important;
  cursor: default;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0;
  padding: 5% 6%;
}

.menu-card__head {
  width: 100%;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 3%;
  margin-bottom: 4%;
}

.menu-card__head-icon {
  height: 0.6rem;
  width: 0.6rem;
  flex: 0 0 0.6rem;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.2));
}

.menu-card__head-title {
  color: #fff;
  font-size: 0.4rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.menu-card__children {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 3%;
  min-height: 0;
}

.menu-card__child {
  width: 100%;
  flex: 1;
  min-height: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 4%;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  &:active:not(.disabled) {
    transform: scale(0.97);
  }
  &.disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
}

.menu-card__child-icon {
  width: 0.7rem;
  height: 0.7rem;
  object-fit: contain;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.15));
}

.menu-card__child-name {
  color: #fff;
  font-size: 0.32rem;
  font-weight: 700;
  margin-left: 3%;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0,0,0,0.15);
}
</style>
