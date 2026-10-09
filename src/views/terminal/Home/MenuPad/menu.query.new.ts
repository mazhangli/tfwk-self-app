// ====================================================================
// menu/query.new.ts
// 模板驱动布局：通过 style() 拉取模板 → 解析 → 与菜单数据合并
// 输出 Menu.vue 期望的 menu 结构
// ====================================================================

import { style } from '@/trans/server/self/machine';
import { getStore } from '@/utils/cache/storage';

// ====================================================================
// 0. 日志
// ====================================================================
const DEBUG = true;

const tag = '%c[MenuPad]';
const tagStyle = 'color:#165DFF;font-weight:bold;';
const okStyle = 'color:#00B42A;font-weight:bold;';
const warnStyle = 'color:#FF7D00;font-weight:bold;';
const errStyle = 'color:#F53F3F;font-weight:bold;';

const logOk = (msg: string, ...args: any[]) =>
  DEBUG && console.log(`${tag} %c✓ ${msg}`, tagStyle, okStyle, ...args);

const logWarn = (msg: string, ...args: any[]) =>
  DEBUG && console.warn(`${tag} %c⚠ ${msg}`, tagStyle, warnStyle, ...args);

const logErr = (msg: string, ...args: any[]) =>
  DEBUG && console.error(`${tag} %c✗ ${msg}`, tagStyle, errStyle, ...args);

const logTable = (data: any) => {
  if (DEBUG) console.table(data);
};

// ====================================================================
// 1. 类型定义
// ====================================================================

/** 模板里的单个按钮项 */
export interface TemplateItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  icon?: string;
  bgColor?: string;
  menuCode?: string;
  action?: {
    type: 'api' | 'route' | string;
    target?: string;
    [key: string]: any;
  };
}

/** 轮播图 */
export interface BannerImage {
  id: string;
  imageUrl: string;
  order: number;
  title?: string;
  linkUrl?: string;
}

/** 横幅配置 */
export interface BannerConfig {
  enabled: boolean;
  heightPx: number;
  interval?: number;
  autoplay?: boolean;
  images: BannerImage[];
}

/** 模板的容器配置 */
export interface TemplateContainer {
  cols: number;
  widthPx: number;
  heightPx: number;
  showGrid?: boolean;
  bgType?: 'gradient' | 'solid' | string;
  bgColor?: string;
  bgColor2?: string;
  bgAngle?: number;
  bgOpacity?: number;
}

/** 模板的全局样式 */
export interface TemplateStyle {
  buttonRadius?: number;
  buttonShadow?: boolean;
  fontSize?: number;
}

/** 模板里的一个页面 */
export interface TemplatePage {
  id: string;
  name: string;
  items: TemplateItem[];
  topBanner?: BannerConfig;
  bottomBanner?: BannerConfig;
}

/** 完整模板配置 */
export interface TemplateConfig {
  version: string;
  name: string;
  description?: string;
  lastModified?: string;
  container: TemplateContainer;
  style?: TemplateStyle;
  usePages?: boolean;
  pages: TemplatePage[];
}

/** 合并后的菜单项（模板 + 菜单数据） */
export interface LayoutItem extends TemplateItem {
  /** Menu.vue 期望的菜单对象 */
  menu: any;
  /** CSS Grid 定位样式 */
  _style: Record<string, any>;
  /** 原始模板 item */
  _template: TemplateItem;
}

// ====================================================================
// 2. 模板拉取（带缓存）
// ====================================================================

let _templatePromise: Promise<TemplateConfig | null> | null = null;

export const fetchTemplate = (): Promise<TemplateConfig | null> => {
  if (_templatePromise) return _templatePromise;

  _templatePromise = (async () => {
    try {
      const t0 = performance.now();
      const raw: any = await style();
      const cost = (performance.now() - t0).toFixed(0);

      if (!raw) {
        logErr(`style() 返回空，耗时 ${cost}ms`);
        return null;
      }

      const template = pickTemplate(raw);
      if (!template) {
        logErr('模板解析失败，原始返回:', raw);
        return null;
      }

      const firstPage = template.pages?.[0];
      logOk(`模板加载成功 (${cost}ms)`, {
        名称: template.name,
        版本: template.version,
        尺寸: `${template.container?.widthPx}x${template.container?.heightPx}`,
        列数: template.container?.cols,
        页面数: template.pages?.length,
        首页: firstPage?.name,
        按钮数: firstPage?.items?.length,
        顶图数: firstPage?.topBanner?.images?.length ?? 0,
        底图数: firstPage?.bottomBanner?.images?.length ?? 0,
      });

      return template;
    } catch (e) {
      logErr('style() 接口异常', e);
      return null;
    }
  })();

  return _templatePromise;
};

/**
 * 从各种可能的返回结构里提取模板
 */
const pickTemplate = (raw: any): TemplateConfig | null => {
  if (isTemplate(raw)) return raw;

  const wrapped = raw.result ?? raw.Response ?? raw.data;
  if (wrapped) {
    if (isTemplate(wrapped)) return wrapped;
    const jsonData =
      wrapped.jsonData ??
      wrapped.JSONDATA ??
      wrapped.styleJsonData ??
      wrapped.json;
    if (jsonData) {
      const parsed = tryParse(jsonData);
      if (parsed && isTemplate(parsed)) return parsed;
    }
  }

  if (raw.jsonData) {
    const parsed = tryParse(raw.jsonData);
    if (parsed && isTemplate(parsed)) return parsed;
  }

  return null;
};

const isTemplate = (o: any): o is TemplateConfig => {
  return !!o && typeof o === 'object' && Array.isArray(o.pages) && !!o.container;
};

const tryParse = (s: any): any => {
  if (!s) return null;
  if (typeof s === 'object') return s;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

export const clearTemplateCache = () => {
  _templatePromise = null;
};

// ====================================================================
// 3. 容器样式
// ====================================================================

const calcTotalRows = (items: TemplateItem[]): number => {
  let maxRow = 0;
  for (const it of items) {
    maxRow = Math.max(maxRow, it.y + it.h);
  }
  return maxRow || 1;
};

export const getContainerStyle = (
  template: TemplateConfig
): Record<string, any> => {
  const { container, pages } = template;
  const allItems = pages.flatMap(p => p.items);
  const totalRows = calcTotalRows(allItems);

  const s: Record<string, any> = {
    display: 'grid',
    gridTemplateColumns: `repeat(${container.cols}, 1fr)`,
    gridTemplateRows: `repeat(${totalRows}, 1fr)`,
    width: '100%',
    height: '100%',
    gap: '4px',
    padding: '8px',
    boxSizing: 'border-box',
  };

  if (
    container.bgType === 'gradient' &&
    container.bgColor &&
    container.bgColor2
  ) {
    const angle = container.bgAngle ?? 135;
    //s.background = `linear-gradient(${angle}deg, ${container.bgColor}, ${container.bgColor2})`;
  } else if (container.bgColor) {
    //s.background = container.bgColor;
  }

  logOk('容器样式', {
    列数: container.cols,
    行数: totalRows,
    背景: container.bgType === 'gradient'
      ? `${container.bgColor} → ${container.bgColor2} @${container.bgAngle}°`
      : container.bgColor,
  });

  return s;
};

// ====================================================================
// 4. 单个按钮样式
// ====================================================================

export const getItemStyle = (
  item: TemplateItem,
  template?: TemplateConfig
): Record<string, any> => {
  const s: Record<string, any> = {
    gridColumn: `${item.x + 1} / span ${item.w}`,
    gridRow: `${item.y + 1} / span ${item.h}`,
  };

  if (item.bgColor) {
    s.backgroundColor = item.bgColor;
  }

  if (template?.style) {
    const st = template.style;
    if (st.buttonRadius != null) {
      s.borderRadius = `${st.buttonRadius}px`;
    }
    if (st.buttonShadow) {
      s.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
    }
    if (st.fontSize != null) {
      s.fontSize = `${st.fontSize}px`;
    }
  }

  return s;
};

// ====================================================================
// 5. 合并模板与菜单数据
// ====================================================================

/**
 * 把模板 item 映射成 Menu.vue 期望的 menu 结构
 *
 *   label     → menuname
 *   icon      → menuicon
 *   bgColor   → menucolor
 *   menuCode  → menucode
 *
 * 其余字段（type / children / mediums / subfield / suspended）从 store 的菜单数据补齐
 */
export const mergeTemplateMenus = (
  template: TemplateConfig,
  pageIndex = 0
): LayoutItem[] => {
  const page = template.pages?.[pageIndex];
  if (!page) {
    logWarn(`模板没有第 ${pageIndex} 页`);
    return [];
  }

  // store 里的菜单索引（key 统一小写）
  const storeMenus = (getStore('menu') as any[]) || [];
  const menuMap = new Map<string, any>();
  for (const m of storeMenus) {
    if (m && m.menucode) menuMap.set(String(m.menucode).toLowerCase(), m);
  }

  const items = page.items.map(item => {
    const code = (item.menuCode || '').toLowerCase();
    const storeMenu = code ? menuMap.get(code) : null;

    // ============ 构造 Menu.vue 期望的 menu 对象 ============
    const menu: any = {
      // 先铺 store 的完整字段
      ...(storeMenu || {}),

      // 再用模板字段覆盖（模板优先级更高）
      menucode: item.menuCode || storeMenu?.menucode || '',
      menuname: item.label || storeMenu?.menuname || '',
      menuicon: storeMenu?.menuicon || item.icon || '',
      menucolor:  storeMenu?.menucolor || item.bgColor || '#468AFD',

      // 保证 Menu.vue 依赖的字段有值
      english: storeMenu?.english || '',
      type: storeMenu?.type || 'query',
      children: Array.isArray(storeMenu?.children) ? storeMenu.children : [],
      disabled: storeMenu?.disabled || 'false',
      mediums: storeMenu?.mediums || [],
      subfield: Array.isArray(storeMenu?.subfield) ? storeMenu.subfield : [],
      suspended: storeMenu?.suspended || 'false',
    };

    // 有子菜单 → type = 'main'
    if (menu.children.length > 0) {
      menu.type = 'main';
    }

    return {
      // 模板原始字段
      ...item,

      // Menu.vue 用的 menu 对象
      menu,

      // CSS Grid 定位
      _style: getItemStyle(item, template),

      // 原始模板（备查）
      _template: item,
    };
  });

  const matched = items.filter(
    it => it.menuCode && menuMap.has(it.menuCode.toLowerCase())
  ).length;
  const unmatched = items.filter(
    it => it.menuCode && !menuMap.has(it.menuCode.toLowerCase())
  ).length;

  logOk(`合并完成 (${page.name})`, {
    模板按钮数: page.items.length,
    store菜单数: storeMenus.length,
    匹配成功: matched,
    未匹配: unmatched,
  });

  if (DEBUG) {
    logTable(
      items.map(it => ({
        标签: it.label,
        menuCode: it.menuCode || '-',
        色: it.bgColor || '-',
        类型: it.menu.type,
        图标: it.menu.menuicon ? '有' : '无',
        子菜单: it.menu.children.length,
        匹配: !it.menuCode
          ? '无'
          : menuMap.has(it.menuCode.toLowerCase())
          ? '✅'
          : '⚠️',
      }))
    );
  }

  return items;
};

// ====================================================================
// 6. 一步到位
// ====================================================================

export interface ReadyResult {
  template: TemplateConfig | null;
  containerStyle: Record<string, any>;
  items: LayoutItem[];
  topBanner: BannerConfig | null;
  bottomBanner: BannerConfig | null;
}

export const prepareLayout = async (pageIndex = 0): Promise<ReadyResult> => {
  const t0 = performance.now();

  const template = await fetchTemplate();
  if (!template) {
    logErr('准备布局失败：模板为空');
    return {
      template: null,
      containerStyle: {},
      items: [],
      topBanner: null,
      bottomBanner: null,
    };
  }

  const containerStyle = getContainerStyle(template);
  const items = mergeTemplateMenus(template, pageIndex);

  const page = template.pages?.[pageIndex];
  const topBanner = page?.topBanner?.enabled ? page.topBanner : null;
  const bottomBanner = page?.bottomBanner?.enabled ? page.bottomBanner : null;

  const cost = (performance.now() - t0).toFixed(0);
  logOk(`prepareLayout 完成 (${cost}ms) → 渲染 ${items.length} 个按钮`);

  return { template, containerStyle, items, topBanner, bottomBanner };
};