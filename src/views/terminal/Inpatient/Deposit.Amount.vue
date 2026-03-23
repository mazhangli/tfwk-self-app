<template>
    <div class="content flex-c">
        <div class="content__pack flex-center" style="padding: 5%; border-radius: 1em;overflow: hidden;">
            <span style="width: 100%; height: 2rem;">
                <van-field id="scannerfield" v-model="number" label="金额" type="number" format-trigger="onBlur"
                    :center="true" placeholder="请输入缴纳押金金额" :rules="[{ required: true, message: '请输入缴纳押金金额' }]"
                    ref="Container" :autofocus="true"
                    style="border-radius: 0.5em;border: #0087CE solid 1px; margin-bottom: 0.2rem;">
                    <template #left-icon>
                        <van-icon name="cash-on-deliver" size="0.5rem" />
                    </template>
                </van-field>
                <span style="width: 100%;">
                    <van-notice-bar left-icon="volume-o" text="请按照病房通知补缴适当押金。" style="opacity: 0.8" />
                </span>
            </span>
            <van-number-keyboard :show="true" theme="custom" extra-key="." close-button-text="完成" @input="onInput"
                @delete="onDelete" @close="onConfirm" />
        </div>
        <div class="content__foot flex-r-3">
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" icon="wap-home"
                icon-position="left" @click="onHome">返回主页
            </van-button>
            <timer-button class="margin" ref="RefItimer" size="1.1rem" :finish="onHome" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';
import { print } from '@/trans/driver/src/thermal';
import { Toast, ToastOptions } from 'vant';
export default defineComponent({
    name: 'DepositAmount',
    props: {
        printContent: String,
    },
    emits:['confirm'],
    components: { TimerButton },
    setup(props, ctx) {
        const state = reactive({
            image: null,
            number: '',
        });
        onMounted(async () => {
            state.image = require('@/assets/img/gif/ticket.gif');
            await print({ context: props.printContent });
        });
        const onHome = function () {
            pushAppHome();
        };
        const onInput = function (value: string) {
            state.number += value;
        };
        const onDelete = function () {
            state.number = state.number.substring(0, state.number.length - 1);
        };
        const onConfirm = function () {
            if (state.number) {
                if (ctx) ctx.emit('confirm', state.number);
            }
        };
        return { ...toRefs(state), onHome, onInput, onDelete, onConfirm };
    },
});
</script>

<style lang="less" scoped>
/deep/ .van-empty__description {
    font-size: 0.34rem;
}

/deep/.van-number-keyboard {
    position: relative;
    background-color: rgba(#ebeef5, .5);
    border-radius: 1em;
    z-index: 100;
    transform: scale(1, 1.3) translate(0, 0.4rem);
    // transform:translate(0, 0.5rem);
}

/deep/ .van-icon {
    font-size: 0.5rem !important;
}

/deep/.van-number-keyboard {
    background-color: rgba(235, 238, 245, 0.7);
    padding: 3%;
}
/deep/.van-key__wrapper {}
</style>
