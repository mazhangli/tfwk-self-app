<template>
<div class="content flex-r-c">
    <div class="pack flex-c-3">
        <span class="nav flex-r-c">
            <van-image :src="icon_alipay" height="1rem" width="2rem" />
        </span>
        <span class="barcode__pack flex-r-c">
            <div class="barcode__left flex-r-c">
                <span class="flex-c-c" :style="{width: '100%'}">
                    <van-icon name="after-sale" size="1rem" color="#fff" /></span>
                <p class="blod">¥</p>
                <p class="font-l blod">{{amount}}</p>
                <p class="font" :style="{width: '100%',color: '#5e5f61','text-align': 'center'}">待支付金额</p>
            </div>
            <div class="barcode__box flex-r-c">
                <van-image :src="barcode" width="90%" height="90%" />
            </div>
            <div class="barcode__right flex-c">
                <div class="barcode__right__1 flex-c-c">
                    <p>①</p>
                    <van-icon name="scan" size="1rem" color="#fff" />
                    <p class="how font">打开支付宝[扫一扫]</p>
                </div>
                <div class="barcode__right__1 flex-c-c">
                    <p>②</p>
                    <van-icon name="qr-invalid" size="1rem" color="#fff" />
                    <p class="how font">扫描左侧二维码</p>
                </div>
            </div>
        </span>
        <span class="barcode__foot flex-c">
            <van-divider :style="{ color: '#fff', borderColor: '#fff', width: '50%', height: '0.2rem'}" />
            <span class="barcode__tip">二维码有效时长5分钟,请尽快支付</span>
        </span>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
export default defineComponent({
    name: 'PayoffAlipay',
    props: {
        amount: Number,
        barcode: String,
        minute: Number,
    },
    emits: [],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            icon_alipay: null as any,
        });
        onMounted(() => {
            state.icon_alipay = require('@/assets/svg/button/alipay.svg');
        });
        return {
            ...toRefs(state),
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
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 1em;
    background: #fff;
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
</style>
