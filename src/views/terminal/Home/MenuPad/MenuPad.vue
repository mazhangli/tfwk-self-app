<template>
  <!-- ============ 舞台层：负责 100%×100% 撑满父容器并居中 ============ -->
  <div class="menupad-stage" v-if="show === false">
    <!-- ============ 等比缩放容器：aspect-ratio = 设计稿宽高比，contain 进 stage ============ -->
    <div class="menupad-wrapper" :style="wrapperStyle">
      <!-- ============ 顶部轮播 ============ -->
      <van-swipe v-if="topBanner" class="top-banner"
        :autoplay="topBanner.autoplay ? (topBanner.interval || 4) * 1000 : 0" :style="topBannerStyle"
        indicator-color="#fff">
        <van-swipe-item v-for="img in sortedTopImages" :key="img.id">
          <img :src="img.imageUrl" :alt="img.title || ''" class="banner-img" @click="onBannerClick(img)" />
        </van-swipe-item>
      </van-swipe>
      <!-- ============ 菜单网格 ============ -->
      <div ref="menupadRoot" class="menu-area">
        <div class="menu_wid" :style="containerStyle">
          <app-menu v-for="(item, i) in layoutItems" :key="item.id || i" :menu="item.menu" :item="item"
            :style="item._style" @subfield="onSubfield" />
        </div>
        <!-- 🆕 水印挂在 menupadRoot 内，显示在菜单区域左下角 -->
        <!-- <div class="pixel-watermark">{{ watermarkText }}</div> -->
      </div>
      <!-- ============ 底部轮播 ============ -->
      <van-swipe v-if="bottomBanner" class="bottom-banner"
        :autoplay="bottomBanner.autoplay ? (bottomBanner.interval || 4) * 1000 : 0" :style="bottomBannerStyle"
        indicator-color="#fff">
        <van-swipe-item v-for="img in sortedBottomImages" :key="img.id">
          <img :src="img.imageUrl" :alt="img.title || ''" class="banner-img" @click="onBannerClick(img)" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
  <!-- ============ 二级菜单 ============ -->
  <div class="content flex-c-c" v-if="show === true">
    <menu-subfield :subfields="subfields" @cancel="show = false" />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  nextTick,
} from 'vue';
import AppMenu from './Menu.vue';
import MenuSubfield from './Subfield/Subfield.vue';
import { prepareLayout, BannerConfig, BannerImage } from './menu.query.new';
import { Close, Open } from '@/utils/loading';
export default defineComponent({
  name: 'MenuPad',
  components: { AppMenu, MenuSubfield },
  setup() {
    const menupadRoot = ref<HTMLElement | null>(null);
    const state = reactive({
      show: false,
      layoutItems: [] as any[],
      containerStyle: {} as Record<string, any>,
      topBanner: null as BannerConfig | null,
      bottomBanner: null as BannerConfig | null,
      subfields: [] as any[],
      // 🆕 设计稿基准尺寸（从模板 container 取，缺省 1080×1920）
      designW: 1080,
      designH: 1920,
    });
    // ============================================================
    // 🆕 等比缩放：aspect-ratio = designW / designH，contain 进父容器
    // 横屏开发机会自动留白居中，竖屏终端会铺满
    // ============================================================
    const wrapperStyle = computed(() => {
      const w = state.designW || 1080;
      const h = state.designH || 1920;
      return {
        aspectRatio: `${w} / ${h}`,
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
      } as Record<string, any>;
    });
    // ============================================================
    // 🆕 banner 高度从固定 px 改为相对设计稿高度的百分比
    // 这样 banner 会跟 wrapper 一起等比缩放，不再脱节
    // ============================================================
    const topBannerStyle = computed(() => {
      const b = state.topBanner;
      if (!b) return {};
      const pct = state.designH ? (b.heightPx / state.designH) * 100 : 0;
      return { height: pct + '%' };
    });
    const bottomBannerStyle = computed(() => {
      const b = state.bottomBanner;
      if (!b) return {};
      const pct = state.designH ? (b.heightPx / state.designH) * 100 : 0;
      return { height: pct + '%' };
    });
    // ============================================================
    // 🆕 水印：menupadRoot 实际像素比例
    // ============================================================
    const rootSize = reactive({ w: 0, h: 0 });
    const watermarkText = computed(() => {
      const w = rootSize.w;
      const h = rootSize.h;
      if (!w || !h) return '测量中...';
      const ratio = (w / h).toFixed(3);
      return `${w} × ${h}   @${ratio}`;
    });
    const measureRoot = () => {
      const el = menupadRoot.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      rootSize.w = Math.round(rect.width);
      rootSize.h = Math.round(rect.height);
    };
    let resizeObserver: ResizeObserver | null = null;
    // ============================================================
    // 排序 banner 图
    // ============================================================
    const sortImages = (list: BannerImage[] | undefined) => {
      if (!list) return [];
      return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    };
    const sortedTopImages = computed(() => sortImages(state.topBanner?.images));
    const sortedBottomImages = computed(() => sortImages(state.bottomBanner?.images));
    // ============================================================
    // 初始化
    // ============================================================
    const init = async () => {
      Open('请等待');
      try {
        const r = await prepareLayout();
        state.layoutItems = r.items;
        state.containerStyle = r.containerStyle;
        state.topBanner = r.topBanner;
        state.bottomBanner = r.bottomBanner;
        // 🆕 从模板 container 拿设计稿基准尺寸，作为 aspect-ratio 依据
        const c = r.template?.container;
        if (c && c.widthPx && c.heightPx) {
          state.designW = c.widthPx;
          state.designH = c.heightPx;
        }
      } catch (e) {
        console.error('[MenuPad] 布局初始化失败:', e);
      } finally {
        Close();
      }
    };
    onMounted(async () => {
      await nextTick();
      setTimeout(measureRoot, 100);
      // 监听 menupadRoot 尺寸变化
      if (menupadRoot.value) {
        resizeObserver = new ResizeObserver(() => {
          measureRoot();
        });
        resizeObserver.observe(menupadRoot.value);
      }
      init();
    });
    onUnmounted(() => {
      resizeObserver?.disconnect();
      resizeObserver = null;
    });
    // ============================================================
    // 事件
    // ============================================================
    const onSubfield = (subfields: any) => {
      state.show = true;
      state.subfields = subfields;
    };
    const onBannerClick = (img: BannerImage) => {
      if (img.linkUrl) {
        window.location.href = img.linkUrl;
      }
    };
    return {
      ...toRefs(state),
      menupadRoot,
      sortedTopImages,
      sortedBottomImages,
      onSubfield,
      onBannerClick,
      watermarkText,
      // 🆕 等比缩放相关
      wrapperStyle,
      topBannerStyle,
      bottomBannerStyle,
    };
  },
});
</script>
<style lang="less" scoped>
/* ============ 舞台层：撑满父容器并居中 wrapper ============ */
.menupad-stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: transparent;
}

/* ============ 等比缩放容器 ============
   aspect-ratio 由 :style="wrapperStyle" 注入（来自模板 container.widthPx/heightPx）
   width/height/max-width/max-height 100% + aspect-ratio
   → 浏览器自动选 contain，横屏机自动留白居中，竖屏机铺满
*/
.menupad-wrapper {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: transparent;
  /* 🆕 建立容器查询上下文，后续子组件可用 cqh/cqw 单位跟随实际渲染尺寸 */
  container-type: size;
  container-name: ui;
}

/* ============ 顶部轮播：强制撑满浏览器视口宽度 ============
   wrapper 是 aspect-ratio contain 的，宽度可能小于视口（横屏机左右留白）。
   用 width:100vw + 负 margin-left 把 banner 拉出 wrapper，占满整个浏览器宽度。
   margin-left = (wrapperWidth - viewportWidth) / 2，负向即向左拉回视口左边缘。
*/
.top-banner {
  width: 100vw;
  margin-left: calc((100% - 100vw) / 2);
  flex-shrink: 0;
  overflow: hidden;
  /* 左上角、右上角圆角 */
  border-radius: 16px 16px 0 0;
  box-shadow:
    0 6px 24px 2px rgba(168, 85, 247, 0.22),
    0 4px 12px 0 rgba(79, 70, 229, 0.25);

  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    /* 拉伸撑满 */
    display: block;
  }
}

/* ============ 菜单区域 ============ */
.menu-area {
  position: relative;
  /* 🆕 水印定位基准 */
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
}

.menu_wid {
  width: 100%;
  height: 100%;
}

/* ============ 底部轮播 ============ */
.bottom-banner {
  width: 100%;
  flex-shrink: 0;
  overflow: visible;
  border-radius: 15px;
  /* wrapper 是 overflow:hidden，底部外阴影向下会被裁，所以阴影向上投射 */
  box-shadow:
    0 -6px 24px 2px rgba(168, 85, 247, 0.22),
    0 -4px 12px 0 rgba(79, 70, 229, 0.25);

  .banner-img {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    object-fit: fill;
    display: block;
  }
}

/* ============================================================
   水印：像素比例（菜单区域左下角）
   ============================================================ */
.pixel-watermark {
  position: absolute;
  left: 12px;
  bottom: 12px;
  font-family: Consolas, Monaco, monospace;
  font-size: 28px;
  /* 🆕 从 16px 调到 28px */
  font-weight: 700;
  /* 🆕 加粗 */
  letter-spacing: 2px;
  color: rgba(0, 0, 0, 0.35);
  /* 🆕 加深到 0.35 */
  background: rgba(255, 255, 255, 0.8);
  padding: 6px 14px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 🆕 加阴影更醒目 */
}
</style>
