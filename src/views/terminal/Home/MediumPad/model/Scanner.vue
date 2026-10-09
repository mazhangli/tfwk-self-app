<template>
  <div class="content flex-c">
    <span class="mat_fill__header font-l blod">{{ medium.title }}</span>
    <el-input id="inputfield" ref="Container" input-style="font-size: 0.4rem;font-weight:bloder" style="height: 1rem"
      placeholder="请扫描条码 / 输入条码内容" :rows="1" suffix-icon="el-icon-full-screen" v-model="value" :autofocus="true"
      :clearable="true" :disabled="false" class="field" @keyup.enter="onClose" />

    <!-- 键盘 + 引导图 上下分栏 -->
    <div style="width: 100%; height: calc(100% - 4rem)" class="flex-c">
      <!-- 键盘区：占 60% -->
      <div style="height: 60%; width: 100%" class="flex-c-c">
        <van-number-keyboard :show="true" theme="custom" extra-key="." close-button-text="完成"
          class="van-number-keyboard" @input="onInput" @close="onClose" @delete="onDelete" />
      </div>
      <!-- 引导图区：占 40% -->
      <div style="height: 40%; width: 100%; overflow: hidden" class="flex-c-c">
        <van-image width="90%" height="90%" radius="1em" fit="contain" position="center" :src="caption" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Close, Open } from '@/utils/loading';
  import {
    defineComponent,
    nextTick,
    onMounted,
    reactive,
    ref,
    watch,
    toRefs,
    onActivated,
    onDeactivated,
    onBeforeMount,
    onBeforeUnmount,
    onUnmounted,
  } from 'vue';
  import { useRoute } from 'vue-router';
  import { usePageVisibility } from '@vant/use';
  import { useEventListener } from '@vant/use';
  import { sleep } from '@/utils/utils';

  // ============================================================
  // 日志工具（统一前缀 + 脱敏）
  // ============================================================
  const LOG_PREFIX = '[MediumScanner]';

  const maskSensitive = (val: any): string => {
    if (val === null || val === undefined) return '(null)';
    const s = String(val);
    if (s === '') return '(empty)';
    if (s.length <= 10) return s;
    return s.substring(0, 4) + '***' + s.substring(s.length - 4) + `(len=${s.length})`;
  };

  const log = (...args: any[]) => {
    console.log(LOG_PREFIX, `[${new Date().toLocaleTimeString()}]`, ...args);
  };

  const logWarn = (...args: any[]) => {
    console.warn(LOG_PREFIX, `[${new Date().toLocaleTimeString()}]`, ...args);
  };

  const logError = (...args: any[]) => {
    console.error(LOG_PREFIX, `[${new Date().toLocaleTimeString()}]`, ...args);
  };

  // ============================================================
  // 图标/动画解析（与 AppMenu、Medium 保持一致）
  // 支持三种来源：
  //   1. 远程 URL：http://、//（协议相对）
  //   2. 绝对路径：/uploads/xxx.gif（后端返回的地址）
  //   3. 本地文件：相对于 baseDir 的本地打包资源
  // ============================================================
  const resolveIcon = (ic: string | undefined | null, baseDir: string): string => {
    if (!ic) return '';
    if (/^(https?:)?\/\//.test(ic) || ic.startsWith('/')) return ic;
    try {
      return require(baseDir + ic);
    } catch (e) {
      logWarn('⚠ resolveIcon 加载本地资源失败:', ic, e);
      return ic;
    }
  };

  export default defineComponent({
    name: 'MediumScanner',
    props: {
      medium: null as any,
    },
    emits: ['onCallend', 'cancel'],
    components: {},
    setup(props, ctx) {
      const state = reactive({
        caption: null as any,
        longined: false,
        live: false,
        value: '',
        lock: false,
      });
      const Container = ref(null as any);

      onMounted(() => {
        log('✅ onMounted', {
          mediumcode: props.medium?.mediumcode,
          mediumname: props.medium?.mediumname,
          title: props.medium?.title,
          rawCaption: props.medium?.caption,
        });

        state.caption = resolveIcon(props.medium?.caption, '@/assets/img/gif/');
        log('  → caption 解析结果 =', state.caption);

        console.dir(Container.value);
        state.live = true;
        log('  → state.live = true');
      });

      onUnmounted(() => {
        log('🚪 onUnmounted', { mediumcode: props.medium?.mediumcode });
      });

      onBeforeMount(() => {
        log('🔧 onBeforeMount', { mediumcode: props.medium?.mediumcode });
      });

      onBeforeUnmount(() => {
        log('🔧 onBeforeUnmount', {
          mediumcode: props.medium?.mediumcode,
          live: state.live,
        });
      });

      useEventListener(
        'click',
        () => {
          try {
            Container.value?.focus();
          } catch (err) {
            logWarn('⚠ Container.focus() 失败:', err);
          }
        },
        { target: document.body }
      );

      const onInput = function (key: string) {
        state.value += key;
        log('⌨ 键盘输入', {
          key,
          currentValue: maskSensitive(state.value),
          length: state.value.length,
        });
      };

      const onClose = async function () {
        log('🔔 onClose 被触发（用户点"完成"或回车）', {
          mediumcode: props.medium?.mediumcode,
          live: state.live,
          lock: state.lock,
          inputLength: state.value.length,
          inputMasked: maskSensitive(state.value),
        });

        if (state.lock === true) {
          logWarn('⚠ 已有提交在进行中，忽略本次 onClose');
          return;
        }

        state.lock = true;
        var context = state.value.replace(/\n|\r/g, '');
        log('  → 清洗后 context =', maskSensitive(context));

        if (context) {
          try {
            Open('');

            if (state.live === true) {
              log('🎉 本地校验通过，向上层 emit "onCallend"', {
                context: maskSensitive(context),
                mediumcode: props.medium?.mediumcode,
              });
              if (ctx) ctx.emit('onCallend', true, context);
            } else {
              logWarn('⚠ state.live = false，组件已卸载或取消，不 emit');
            }
          } catch (err) {
            logError('✖ onClose 内部异常:', err);
          }
        } else {
          logWarn('⚠ context 为空，用户没输入任何内容');
        }

        await sleep(1500);
        state.lock = false;
        state.value = '';
        log('🔚 onClose 结束，state 已重置', {
          lock: state.lock,
          value: state.value,
        });
      };

      const onDelete = function () {
        if (state.value) {
          const before = state.value;
          state.value = state.value.substring(0, state.value.length - 1);
          log('⌫ 退格', {
            before: maskSensitive(before),
            after: maskSensitive(state.value),
            length: state.value.length,
          });
        } else {
          log('⌫ 退格（但 value 已为空，忽略）');
        }
      };

      const onCancel = function () {
        log('❌ onCancel 触发：用户取消，向上层 emit "cancel"', {
          mediumcode: props.medium?.mediumcode,
          inputBeforeCancel: maskSensitive(state.value),
        });
        state.live = false;
        if (ctx) ctx.emit('cancel');
      };

      return { ...toRefs(state), ...props, Container, onInput, onClose, onDelete, onCancel };
    },
  });
</script>

<style lang="less" scoped>
.divtip {
  background-color: white !important;
}

.field {
  z-index: 2022;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12) !important;
  border-radius: 0.5em;
  width: 96%;
  margin-top: 2%;
  margin-bottom: 2%;
  font-size: 0.35rem;
}

/deep/.van-number-keyboard {
  position: relative;
  background-color: rgba(#ebeef5, 0.5);
  border-radius: 1em;
  z-index: 100;
  font-size: 0.3rem !important;
}

/deep/.van-number-keyboard__key {
  height: 40px !important;
  margin: 4px !important;
  border-radius: 8px !important;
}

/deep/ .van-icon {
  font-size: 0.5rem !important;
}
</style>