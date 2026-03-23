<template>
<div class="mat-keyboard">
    <div class="mat-number-keyboard">
        <div class="mat-number-keyboard__keys"></div>
        <div class="mat-number-keyboard__sidebar"></div>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue';
export default defineComponent({
    name: 'NumberKeyboard',
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        title: String,
        zIndex: Number,
        maxlength: Number,
        modelValue: String,
        blurOnClose: {
            type: Boolean,
            default: true,
        },
        showDeleteKey: {
            type: Boolean,
            default: true,
        },
        randomKeyOrder: {
            type: Boolean,
            default: false,
        },
        closeButtonText: String,
        deleteButtonText: String,
        extraKey: {
            type: Array(String),
        },
    },
    emits: ['input', 'delete', 'close', 'blur', 'show', 'hide'],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            keys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            
        });
        return {};
    },
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
