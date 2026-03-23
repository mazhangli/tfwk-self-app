<template>
<span style="width: -webkit-fill-available">
    <van-field>
        <template #input>
            <el-select v-model="type" placeholder="请选择证件类型" size="large" style="width: 4rem">
                <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
            <span style="width: 2%" />

            <!-- <van-popover v-model:show="shownPiker" placement="bottom-end" id="mediumidcardno">
                <template #default>
                    <van-number-keyboard :show="shownPiker" theme="custom" extra-key="X" close-button-text="完成" :get-container="field" />
                </template>
                <template #reference> -->
            <van-form>
                <van-field v-model="no" label="证件编号" size="large" :autofocus="focu" :readonly="type === ''" :colon="true" placeholder="请输入证件号码" :rules="[{ required: true, message: '请输入证件号码' }, { validator: asyncValidator, message: '证件号码格式异常' }]" @click="onKeyboard" />
            </van-form>
            <!-- </template>
            </van-popover> -->
        </template>
        <template #right-icon>
            <van-image :src="keyicon" width="0.5rem" />
        </template>
    </van-field>
</span>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { Show, Hide } from '@/utils/terminal/keyboard/keyboard';
import { Lang } from '@/utils/terminal/keyboard/keyboard';
import { idcardtype } from '@/trans/server/self/dictionary';
import { isIdCard } from '@/utils/is';
export default defineComponent({
    name: 'IdcardCell',
    props: {},
    emits: ['change'],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            value: '',
            options: null as any,
            shownPiker: false,
            keyicon: null as any,
            focu: false,
            type: '',
            no: '',
        });
        const onShown = function () {
            if (ctx) ctx.emit('change');
        };

        onBeforeMount(async () => {
            state.options = [];
            state.options = await idcardtype();
        });
        onMounted(() => {
            state.keyicon = require('@/assets/svg/keyboard.svg');
        });
        const onKeyboard = function () {
            state.focu = true;
            state.no = '';
            if(state.type) Show(Lang.Identity);
        };
        const onInput = function () {

        };
        const onDelete = function () {

        };
        // 校验函数可以返回 Promise，实现异步校验
        const asyncValidator = (code: string) =>
            new Promise((resolve) => {
                console.log(code);
                resolve(state.type === '' ? true : isIdCard(code));
            });
        watch(() => state.type, () => {
            if (ctx) ctx.emit('change', state.type, state.no);
        }, { deep: true });
        watch(() => state.no, () => {
            if (ctx) ctx.emit('change', state.type, state.no);
        }, { deep: true });
        return { ...toRefs(state), onKeyboard, onShown, onInput, onDelete, asyncValidator };
    },
});
</script>

<style lang="less" scoped>
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
}

/deep/ .el-select-dropdown__item {
    padding: 20px !important;
}
</style>
