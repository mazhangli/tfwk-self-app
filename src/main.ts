import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import vantUI from '@/vantUI';
import elementUI from '@/elementUI';
import { loadEnv } from '@/setup/utils';
import { setupGlobDirectives } from '@/setup/directives';
import { isDevMode } from '@/utils/env';
import { registerGlobComp } from '@/components/registerGlobComp'
import { setApp } from "@/setup/App";
import repeatDirective from '@/setup/directives/repeatClick';
import preventReClick from '@/utils/directive';
import '@/styles/index.less';
import '@/styles/font.less';
import '@/assets/fonts/font.css';
import 'lib-flexible';
import '@/assets/fonts/font_3017912_ijam3qlccu/iconfont.css';

loadEnv();
const app = createApp(App);//创建实例

vantUI(app);
elementUI(app);
app.use(router);
app.directive('repeat-click', repeatDirective);//防止長時間觸摸
app.directive('preventReClick', preventReClick);//防止連擊
// Register global directive
// setupGlobDirectives(app);

// The development environment takes effect
if (isDevMode()) {
    app.config.performance = true;
    window.__APP__ = app;
}

// Mount when the route is ready
router.isReady().then(() => {
    app.mount('#app');
});

// Used to share app instances in other modules
setApp(app);

registerGlobComp(app);