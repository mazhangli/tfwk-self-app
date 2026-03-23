<template>
    <div class="flex-c divtip" style="width: 100%; overflow-y: scroll;">
        <div class="mat_fill__header font-l blod">
            <van-icon class="iconfont" class-prefix="mat-icon" name="wode-yibaoka" size="0.5rem" /> {{ medium.title }}
        </div>
        <div class="flex-c-c" style="width: 100%; padding-left: 10%; padding-right: 10%" v-if="hide === false">
            <span style="width: 100%; padding-bottom: 0.3rem; padding-top: 0.3rem">
                <van-form ref="formidcard">
                    <!-- <el-input class="field" placeholder="请输入身份证号" :rows="1" prefix-icon="el-icon-postcard" :maxlength="18" v-model="idnum" :autofocus="true" /> -->
                    <van-field v-model="idnum" format-trigger="onBlur" :center="true" placeholder="请输入身份证号"
                        :rules="[{ required: true, message: '请输入身份证号' }, { validator: asyncValidator, message: '身份证号格式异常' }]"
                        class="field" @keyup.enter="onLoading">
                        <template #left-icon>
                            <van-icon name="idcard" size="0.5rem" />
                        </template>
                    </van-field>
                </van-form>
            </span>
            <number-keyboard :extra-key="['X']" theme="custom" @input="onChange" @confirm="onLoading" :maxlength="18" />
        </div>
        <van-image width="90%" height="calc(100% - 1rem)" radius="1em" fit="contain" position="center" :src="caption"
            v-if="hide === true" />
    </div>
</template>

<script lang="ts">
import { Open } from '@/utils/loading';
import { defineComponent, nextTick, onMounted, reactive, ref, watch, toRefs, onActivated, onDeactivated, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue';
import NumberKeyboard from '@/components/Keyboard/NumberKeyboard/src/index.vue';
import { setStore } from '@/utils/cache/storage';
import { isIdCard } from '@/utils/is';
export default defineComponent({
    name: 'MediaIdentityNumber',
    props: {
        medium: null as any,
    },
    emits: ['onCallend'],
    components: { NumberKeyboard },
    setup(props, ctx) {
        const state = reactive({
            caption: null as any,
            longined: false,
            live: false,
            idnum: '',
            hide: false,
            keyicon: null as any,
        });

        onMounted(() => {
            console.log('onMounted');
            state.keyicon = require('@/assets/svg/keyboard.svg');
            state.caption = require('@/assets/img/gif/' + props.medium.caption);
            console.log(state.caption);
            state.live = true;
        });

        onUnmounted(async () => {
            console.log('onUnmounted');
            //await calldrive(DeviceEnum.SPEAKER, 'speak', [props.medium.title], 0);
        });

        onBeforeMount(() => {
            console.log('onBeforeMount');
        });

        onBeforeUnmount(() => {
            console.log('onBeforeUnmount');
            state.live = false;
        });
        const formidcard = ref(null) as any;
        const onLoading = async function () {
            formidcard.value.validate();
            if (await asyncValidator(state.idnum) === false) return;
            if (state.live === true) {
                if (state.idnum) {
                    Open('');
                    if (ctx) ctx.emit('onCallend', true, state.idnum);
                }
                state.idnum = '';
            }
        };
        const onChange = function (val: any) {
            state.idnum = val;
        };
        // 校验函数可以返回 Promise，实现异步校验
        const asyncValidator = (code: string) =>
            new Promise((resolve) => {
                console.log(code);
                resolve(isIdCard(code));
            });
        return { ...toRefs(state), ...props, onLoading, onChange, asyncValidator, formidcard };
    },
});
</script>

<style lang="less" scoped>
.divtip {
    background-color: white !important;
}

.field {
    z-index: 2022;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 20%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 20%);
    border-radius: 0.5em;
    width: 96%;
    margin: 2%;
    font-weight: bold;
    height: auto;
}

/deep/.el-input {
    padding-left: 5%;
    border: none !important;
    border-radius: 8px;
    //box-shadow: 0px 0px 12px rgba(0, 0, 0, .12) !important;
    border: 1px solid #E4E7ED;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 10%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 10%);
}

/deep/.el-input__inner {
    border: none !important;
    box-shadow: none !important;
    font-size: 0.33rem;
}
</style>
