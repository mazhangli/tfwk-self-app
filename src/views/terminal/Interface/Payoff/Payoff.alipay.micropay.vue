<template>
  <div class="content flex-r-c">
    <div class="pack flex-c-3">
      <span class="nav flex-r-c">
        <van-image :src="icon_alipay" height="1rem" width="2rem" />
      </span>
      <span class="barcode__pack flex-r-c">
        <div class="barcode__box flex-r-c">
          <van-image :src="icon_micropay" fit="contain" width="90%" height="100%" />
        </div>
        <div class="flex-c-r"> </div>
      </span>
      <span class="barcode__foot flex-c">
        <van-divider :style="{ color: '#fff', borderColor: '#fff', width: '50%', height: '0.2rem' }" />
        <span class="barcode__tip">请注意大额支付时支付宝需要输入支付密码</span>
        <input ref="scanInputRef" class="hidden-scan-input" type="text" @input="handleInputChar"
          @keydown.enter.prevent="handleScanInput" @blur="handleInputBlur" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import { speak } from '@/trans/driver/src/speech';
  import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
  export default defineComponent({
    name: 'PayoffAlipayMicro',
    emits: ['scanSuccess'],
    props: {
      amount: Number,
      minute: Number,
    },
    components: {},
    setup(props, ctx) {
      // 隐藏输入框Ref
      const scanInputRef = ref<HTMLInputElement | null>(null);
      // 防抖：避免扫码器逐字符触发（付款码是连续数字）
      let scanTimer: NodeJS.Timeout | null = null;
      let scanCode = '';
      const state = reactive({
        icon_alipay: null as any,
        icon_micropay: null as any,
      });
      // 3. 失焦自动重聚焦（关键：防止输入框丢焦点）
      const handleInputBlur = () => {
        nextTick(() => {
          scanInputRef.value?.focus();
        });
      };
      onMounted(() => {
        state.icon_alipay = require('@/assets/svg/button/alipay.svg');
        state.icon_micropay = require('@/assets/img/gif/micropay.alipay.gif');
        /* 自动聚焦输入框（确保扫码器输入能被捕获）*/
        setTimeout(() => {
          const input = scanInputRef.value;
          if (input) {
            input.focus();
            // 手动触发焦点事件，兼容部分自助机系统
            input.dispatchEvent(new Event('focus'));
            console.log('输入框已聚焦:', document.activeElement === input); // 验证焦点是否生效
          }
        }, 500);
        /* 监听页面点击，重新聚焦（防止输入框失焦）*/
        document.addEventListener(
          'click',
          (e) => {
            // 排除点击输入框本身的情况，避免重复聚焦
            if (e.target !== scanInputRef.value) {
              scanInputRef.value?.focus();
            }
          },
          true
        );
        speak('请在手机端打开支付宝付款码,并将付款码对准自助扫码区,请检查手机是否需要输入密码');
      });
      // 1. 逐字符接收扫码器输入（仅存值，不验证）
      const handleInputChar = (e: Event) => {
        const target = e.target as HTMLInputElement;
        scanCode = target.value.replace(/[\r\n]/g, '');
      };
      // 处理扫码器输入
      const handleScanInput = (e: Event) => {
        if (!scanCode) return;
        // 验证微信付款码格式
        if (/^\d{16,24}$/.test(scanCode)) {
          console.log('付款码识别:', scanCode);
          ctx.emit('scanSuccess', 'alipay', scanCode);
          // 清空输入框和暂存值
          if (scanInputRef.value) scanInputRef.value.value = '';
          scanCode = '';
        } else {
          console.log('付款码格式错误:', scanCode);
          if (scanInputRef.value) scanInputRef.value.value = '';
          scanCode = '';
          speak('付款码格式错误，请重新扫码');
        }
        // 清空防抖定时器
        if (scanTimer) clearTimeout(scanTimer);
      };
      return {
        ...toRefs(state),
        scanInputRef,
        handleScanInput,
        handleInputChar,
        handleInputBlur,
        scanCode,
      };
    },
  });
</script>

<style lang="less" scoped>
.pack {
  width: ~'calc(100% - 2rem)';
  height: ~'calc(100% - 0.5rem)';
  background: #00ABD7;
  box-shadow: 0 8px 12px #ebedf0;
  border-radius: 1em;
}

.nav {
  width: 100%;
  height: 1.5rem;
  background: #fff;
}

.barcode__pack {
  height: ~'calc(100% - 3rem)';
  width: 100%;
}

.barcode__box {
  width: 90%;
  height: 90%;
  border-radius: 1em;
  // background: #fff;
}

.barcode__foot {
  height: 1.5rem;
  width: 100%;
}

.barcode__tip {
  width: 70%;
  height: 0.5rem;
  border-radius: 1em;
  background: #fff;
  vertical-align: middle;
  text-align: center;
}

.barcode__left {
  width: ~'calc(50% - 2rem)';
  height: 100%;
  color: #fff;
}

.barcode__right {
  width: ~'calc(50% - 2rem)';
  height: 100%;
}

.barcode__right__1 {
  color: #fff;
  width: 100%;
  height: 50%;

  p {
    width: 100%;
    text-align: center;
  }
}

/* 核心：隐藏扫码输入框（但保持可聚焦） */
.hidden-scan-input {
  position: fixed;
  top: -9999px;
  left: -9999px;
  width: 0;
  height: 0;
  opacity: 0;
  border: none;
  outline: none;
  background: transparent;
  pointer-events: none;
  z-index: -9999;

  // top: 10px;
  // /* 改为可见位置 */
  // left: 10px;
  // width: 200px;
  // /* 给宽度 */
  // height: 30px;
  // /* 给高度 */
  // opacity: 1;
  // /* 显示 */
  // border: 1px solid red;
  // /* 红色边框，方便看到 */
  // z-index: 9999;
  // /* 置顶 */
}
</style>
