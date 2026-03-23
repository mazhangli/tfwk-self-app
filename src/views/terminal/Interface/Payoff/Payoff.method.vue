<template>
<van-button v-preventReClick="2000" plain type="primary" class="payoff__btn" :color="color">
    <div class="payoff__btn-pack">
        <van-image height="90%" :src="icon" fit="contain" />
    </div>
    <span class="triangle" v-if="type=='wechat' || type === 'alipay'">推荐</span>
    <span class="active" v-if="active === true" />
</van-button>
</template>

<script lang="ts">
import { computed, defineComponent, inject, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import { oneOf } from 'vue-types';
export default defineComponent({
    name: 'PayoffMethod',
    props: {
        active: { type: Boolean, default: false, },
        type: oneOf(['wechat', 'alipay', 'unionpay','credit']),
    },
    emits: [],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            icon: null as any,
        });
        onMounted(() => {
            switch (props.type) {
                case 'wechat':
                    state.icon = require('@/assets/svg/button/wechatpay.svg');
                    break;
                case 'alipay':
                    state.icon = require('@/assets/svg/button/alipay.svg');
                    break;
                case 'unionpay':
                    state.icon = require('@/assets/svg/button/unionpay.svg');
                    break;
                case 'credit':
                    state.icon = require('@/assets/svg/button/creditpay.svg');
                    break;
            }
        });
        const color = computed(() => {

            let c = props.active ? 'transparent' : 'transparent';
            console.log(props.type, props.active, c);
            return c;
        });
        return { ...toRefs(state), color };
    },
});
</script>

<style lang="less" scoped>
.payoff__btn {
    width: 2.5rem;
    height: 1.2rem;
    margin: 0.1rem;
    overflow: hidden;
    box-shadow: 0 8px 12px #ebedf0;

    .payoff__btn-pack {
        width: 100%;
        height: 100%;
        padding: 10%;
    }

    .triangle {
        opacity: 0.7;
        font-size: 0.25rem;
        line-height: 0.3rem;
        background: #1989fa;
        color: #fff;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;
        padding: 0 1em;
        -webkit-transform-origin: left bottom;
        -moz-transform-origin: left bottom;
        transform-origin: left bottom;
        -webkit-transform: translate(29.29%, -100%) rotate(45deg);
        -moz-transform: translate(29.29%, -100%) rotate(45deg);
        transform: translate(29.29%, -100%) rotate(45deg);
        text-indent: 0;
    }

    .active {
        font-size: 0.25rem;
        line-height: 0.3rem;
        background: red;
        color: #fff;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 2;
        padding: 2em 2em;
        -webkit-transform-origin: left top;
        -moz-transform-origin: left top;
        transform-origin: left top;
        // -webkit-transform: translate(29.29%, 100%) rotate(-145deg);
        // -moz-transform: translate(29.29%, 100%) rotate(-145deg);
        transform: translate(29.29%, 100%) rotate(135deg);
        text-indent: 0;
    }
}

/deep/.van-button::before {
    border: v-bind(color) 1px solid;
}
</style>
