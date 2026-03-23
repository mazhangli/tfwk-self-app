<template>
  <div class="content flex-r-c">
    <div class="pack flex-c-3">
      <span class="nav flex-r-c">
        <van-image :src="icon_wechat" height="1rem" width="2rem" />
        <p>&emsp;&emsp;</p>
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
        <span class="barcode__tip">请注意时微信/支付宝是否需要输入支付密码</span>

        <!-- 核心：不可见的输入框（接收扫码器的键盘输入） -->
        <input ref="scanInputRef" class="hidden-scan-input" type="text" @input="handleInputChar"
          @keydown.enter.prevent="handleScanInput" @blur="handleInputBlur" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import { speak } from '@/trans/driver/src/speech';
import { getPayCodeType } from '@/utils/payCodeValidator';
  import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
  export default defineComponent({
    name: 'PayoffWechatMicro',
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
        icon_wechat: null as any,
        icon_micropay: null as any,
      });
      // 3. 失焦自动重聚焦（关键：防止输入框丢焦点）
      const handleInputBlur = () => {
        nextTick(() => {
          scanInputRef.value?.focus();
        });
      };
      onMounted(() => {
        state.icon_wechat = require('@/assets/svg/button/wechatpay.svg');
        state.icon_alipay = require('@/assets/svg/button/alipay.svg');
        state.icon_micropay = require('@/assets/img/gif/micropay.gif');
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
        speak('请在手机端打开微信或者支付宝付款码,并将付款码对准自助扫码区,扫码后请检查手机是否需要输入密码');
        
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
        const codeType = getPayCodeType(scanCode);
        if (codeType === 'wechat' || codeType === 'alipay') {
          console.log('付款码识别:', scanCode);
          ctx.emit('scanSuccess', codeType, scanCode);
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
@keyframes wxAlipayGradientFlash {
  0% {
    background: linear-gradient(45deg, #07C160 0%, #06B858 100%);
    opacity: 0.8;
  }
  25% {
    background: linear-gradient(45deg, #07C160 0%, #06B858 100%);
    opacity: 1;
  }
  50% {
    background: linear-gradient(45deg, #04A880 0%, #00ABD7 100%);
    opacity: 0.95;
  }
  75% {
    background: linear-gradient(45deg, #00ABD7 0%, #00ABD7 100%);
    opacity: 1;
  }
  100% {
    background: linear-gradient(45deg, #00ABD7 0%, #00ABD7 100%);
    opacity: 0.8;
  }
}

.pack {
  width: ~'calc(100% - 2rem)';
  height: ~'calc(100% - 0.5rem)';
  box-shadow: 0 8px 12px #ebedf0;
  border-radius: 1em;
  animation: wxAlipayGradientFlash 6s ease-in-out infinite alternate;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  background-size: 200% 200%;
  /* 可选：添加背景平滑过渡，强化呼吸感 */
  transition: background 0.5s ease-in-out;
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
