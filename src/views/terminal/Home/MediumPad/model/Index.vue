<template>
  <div class="content flex-c divtip">
    <div class="content__pack">
      <medium-identity
        :medium="medium"
        v-if="medium.mediumcode === 'IDENTITY'"
        @onCallend="oneOff"
      />
      <medium-medicareQR
        :medium="medium"
        v-if="medium.mediumcode === 'MEDICARE.BARCODE'"
        @onCallend="oneOff"
      />
      <medium-scanner
        :medium="medium"
        v-if="medium.mediumcode === 'SCANNING'"
        @onCallend="oneOff"
      />
      <medium-medical :medium="medium" v-if="medium.mediumcode === 'MEDICAL'" @onCallend="oneOff" />
      <medium-medicare-card
        :medium="medium"
        v-if="medium.mediumcode === 'MEDICARE.CARD'"
        @onCallend="oneOff"
      />
    </div>
    <div class="content__nav flex-r-c">
      <van-button
        class="content__fit"
        type="primary"
        size="large"
        icon="revoke"
        block
        round
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        @click="onCancel"
        >取消</van-button
      >
    </div>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    nextTick,
    onMounted,
    reactive,
    ref,
    toRefs,
    onActivated,
    onDeactivated,
    onBeforeMount,
    onBeforeUnmount,
    onUnmounted,
  } from 'vue';
  import MediumIdentity from './Identity.vue';
  import MediumMedicareQR from './Medicare.QR.vue';
  import MediumScanner from './Scanner.vue';
  import MediumMedical from './Medical.vue';
  import MediumMedicareCard from './Medicare.Card.vue';
  import { read as idcard } from '@/trans/driver/src/idcard';
  import { read as patcard } from '@/trans/driver/src/patcard';
  import { callinsapi } from '@/trans/driver/src/insapi/index';
  import { getStore } from '@/utils/cache/storage';
  import { MethodEnum } from '@/trans/driver';
  import { Close, Open } from '@/utils/loading';
  import { patient$confined } from '@/trans/server/his/inhospital';
  import { history$confined } from '@/trans/server/his/patient';

  // ============================================================
  // 日志工具（统一前缀 + 脱敏）
  // ============================================================
  const LOG_PREFIX = '[MediumIndex]';

  /**
   * 敏感信息脱敏：
   *   - 身份证号 / 就诊卡号 / 扫码内容 → 只保留前 4 位 + 后 4 位
   *   - 空值返回 '(empty)'
   *   - 短字符串（< 10）直接返回
   */
  const maskSensitive = (val: any): string => {
    if (val === null || val === undefined) return '(null)';
    const s = String(val);
    if (s === '') return '(empty)';
    if (s.length <= 10) return s;
    return s.substring(0, 4) + '***' + s.substring(s.length - 4) + `(len=${s.length})`;
  };

  /**
   * capinfo 是医保返回的复杂对象，只打 key 数量 + 几个关键字段
   */
  const summarizeCapinfo = (capinfo: any): string => {
    if (!capinfo || typeof capinfo !== 'object') return '(empty)';
    const keys = Object.keys(capinfo);
    return `{ keys=[${keys.join(',')}] }`;
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

  export default defineComponent({
    name: 'MediumIndex',
    props: {
      menucode: String,
      medium: null as any,
      token: null as any,
    },
    emits: ['called', 'cancel'],
    components: {
      MediumIdentity,
      MediumMedicareQR,
      MediumScanner,
      MediumMedical,
      MediumMedicareCard,
    },
    setup(props, ctx) {
      const state = reactive({
        captiongif: null as any,
      });

      onMounted(() => {
        log('✅ onMounted', {
          menucode: props.menucode,
          mediumcode: props.medium?.mediumcode,
          mediumname: props.medium?.mediumname,
          token: props.token,
        });
        state.captiongif = require('@/assets/img/gif/identity.gif');
      });

      onUnmounted(() => {
        log('🚪 onUnmounted', { mediumcode: props.medium?.mediumcode });
      });

      onBeforeMount(() => {
        log('🔧 onBeforeMount', { menucode: props.menucode });
      });

      onBeforeUnmount(() => {
        log('🔧 onBeforeUnmount', { mediumcode: props.medium?.mediumcode });
      });

      const onCalled = function () {
        log('✅ onCalled 触发：登录成功，向上层 emit "called"');
        ctx.emit('called');
      };

      const onCancel = function () {
        log('❌ onCancel 触发：用户取消或登录失败，向上层 emit "cancel"');
        if (ctx) ctx.emit('cancel');
      };

      const oneOff = async function (success: boolean, ...args: any[]) {
        // ============================================================
        // 入口日志
        // ============================================================
        const mediumcode = props.medium?.mediumcode;
        log('🔔 oneOff 被调用', {
          success,
          mediumcode,
          argsCount: args.length,
          args: args.map(a => maskSensitive(a)),
        });

        var type = '';
        var card = '';
        var capinfo = {} as any;
        var readed = false;

        if (success === true) {
          // ============================================================
          // 分派：根据 mediumcode 走不同的读取流程
          // ============================================================
          switch (mediumcode) {
            case 'IDENTITY':
              log('▶ [IDENTITY] 开始读取身份证...');
              try {
                readed = await idcard();
                log('◀ [IDENTITY] idcard() 返回 =', readed);
                if (readed === true) {
                  type = '身份证';
                  card = getStore('identity').Code;
                  log('✔ [IDENTITY] 读取成功', {
                    type,
                    card: maskSensitive(card),
                  });
                } else {
                  logWarn('⚠ [IDENTITY] 读取失败，readed = false');
                }
              } catch (err) {
                logError('✖ [IDENTITY] idcard() 抛异常:', err);
                readed = false;
              }
              break;

            case 'MEDICARE':
            case 'MEDICARE.CARD':
              log(`▶ [${mediumcode}] 开始读取医保卡...`);
              try {
                readed = await callinsapi(MethodEnum.READ);
                log(`◀ [${mediumcode}] callinsapi(READ) 返回 =`, readed);
                if (readed === true) {
                  type = 'capinfo';
                  capinfo = getStore('capinfo');
                  log(`✔ [${mediumcode}] 读取成功`, {
                    capinfo: summarizeCapinfo(capinfo),
                  });
                } else {
                  logWarn(`⚠ [${mediumcode}] 读取失败，readed = false`);
                }
              } catch (err) {
                logError(`✖ [${mediumcode}] callinsapi() 抛异常:`, err);
                readed = false;
              }
              break;

            case 'MEDICARE.BARCODE':
              log('▶ [MEDICARE.BARCODE] 开始处理扫码结果...');
              if (args && args[0]) {
                log('  args[0] 扫码内容 =', maskSensitive(args[0]));
                try {
                  readed = await callinsapi(MethodEnum.READ, args[0]);
                  log('◀ [MEDICARE.BARCODE] callinsapi(READ, code) 返回 =', readed);
                  if (readed === true) {
                    type = 'capinfo';
                    card = args[0];
                    capinfo = getStore('capinfo');
                    log('✔ [MEDICARE.BARCODE] 处理成功', {
                      card: maskSensitive(card),
                      capinfo: summarizeCapinfo(capinfo),
                    });
                  } else {
                    logWarn('⚠ [MEDICARE.BARCODE] 处理失败，readed = false');
                  }
                } catch (err) {
                  logError('✖ [MEDICARE.BARCODE] callinsapi() 抛异常:', err);
                  readed = false;
                }
              } else {
                logWarn('⚠ [MEDICARE.BARCODE] args[0] 为空，无法处理');
                readed = false;
              }
              break;

            case 'SCANNING':
              log('▶ [SCANNING] 处理扫码结果...');
              if (args[0]) {
                readed = true;
                type = '%';
                card = args[0];
                log('✔ [SCANNING] 扫码成功', {
                  card: maskSensitive(card),
                });
              } else {
                readed = false;
                logWarn('⚠ [SCANNING] args[0] 为空，视为失败');
              }
              break;

            case 'MEDICAL':
              log('▶ [MEDICAL] 开始读取就诊卡...');
              try {
                readed = await patcard();
                log('◀ [MEDICAL] patcard() 返回 =', readed);
                if (readed === true) {
                  type = '就诊卡';
                  card = getStore('patcard').cardno;
                  log('✔ [MEDICAL] 读取成功', {
                    type,
                    card: maskSensitive(card),
                  });
                } else {
                  logWarn('⚠ [MEDICAL] 读取失败，readed = false');
                }
              } catch (err) {
                logError('✖ [MEDICAL] patcard() 抛异常:', err);
                readed = false;
              }
              break;

            default:
              logWarn('⚠ 未知 mediumcode，无法处理:', mediumcode);
              break;
          }

          // ============================================================
          // 读取成功 → 调服务端
          // ============================================================
          if (readed === true) {
            log('📤 本地读取完成，开始调用服务端', {
              type,
              card: maskSensitive(card),
              capinfo: summarizeCapinfo(capinfo),
              menucode: props.medium.menucode,
            });

            Close();
            Open('');

            var server = false;
            const menuLower = props.medium.menucode?.toLowerCase() || '';
            const isInhospital = menuLower.startsWith('inhospital');

            try {
              if (isInhospital) {
                log('  → 调用 patient$confined（住院）');
                server = await patient$confined(type, card, capinfo, props.medium.menucode);
              } else {
                log('  → 调用 history$confined（门诊）');
                server = await history$confined(type, card, capinfo, props.medium.menucode);
              }
              log('◀ 服务端返回 =', server);
            } catch (err) {
              logError('✖ 服务端调用抛异常:', err);
              server = false;
            }

            if (server === true) {
              log('🎉 服务端校验通过 → onCalled()');
              onCalled();
            } else {
              logWarn('❌ 服务端校验失败 → onCancel()');
              onCancel();
            }
          } else {
            logWarn('⚠ 本地读取未成功（readed = false），跳过服务端调用');
          }

          Close();
        } else {
          // ============================================================
          // success !== true 的情况
          // ============================================================
          logWarn('⚠ oneOff 收到 success = false，子组件未成功读取', {
            mediumcode,
            args: args.map(a => maskSensitive(a)),
          });
        }

        log('🔚 oneOff 结束', {
          mediumcode,
          finalType: type,
          finalCard: maskSensitive(card),
          finalReaded: readed,
        });
      };

      return { ...toRefs(state), onCalled, oneOff, onCancel };
    },
  });
</script>

<style lang="less" scoped>
  .divtip {
    background-color: rgba(#fff, 0.5) !important;
    border-radius: 0.5rem;
    box-shadow: x-shadow 0 10px 10px rgba(0, 0, 0, 0.5);
    padding-left: 2%;
    padding-right: 2%;
  }
</style>