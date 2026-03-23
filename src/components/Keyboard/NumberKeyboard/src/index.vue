<template>
<div class="mat-number-keyboard">
    <div class="mat-number-keyboard__body">
        <!-- 主键盘 -->
        <div class="mat-number-keyboard__keys">
            <div :class="key.wider === true ? 'mat-key__wrapper mat-key__wrapper--wider': 'mat-key__wrapper'" v-for="(key, index) in keys" :key="index">
                <div role="button" tabindex="0" class="mat-key" v-if="!key.type || key.type === 'extra'" @click="onInput(key)">{{key.text}}</div>
                <div role="button" tabindex="0" class="mat-key" v-if="key.type && key.type === 'close'" @click="onHide()">
                    <svg class="mat-key__collapse-icon" viewBox="0 0 30 24">
                        <path d="M26 13h-2v2h2v-2zm-8-3h2V8h-2v2zm2-4h2V4h-2v2zm2 4h4V4h-2v4h-2v2zm-7 14 3-3h-6l3 3zM6 13H4v2h2v-2zm16 0H8v2h14v-2zm-12-3h2V8h-2v2zM28 0l1 1 1 1v15l-1 2H1l-1-2V2l1-1 1-1zm0 2H2v15h26V2zM6 4v2H4V4zm10 2h2V4h-2v2zM8 9v1H4V8zm8 0v1h-2V8zm-6-5v2H8V4zm4 0v2h-2V4z" fill="currentColor" />
                    </svg>
                </div>
                <div role="button" tabindex="0" class="mat-key" v-if="key.type && key.type === 'delete'" @click="onDelete()">
                    <svg class="mat-key__delete-icon" viewBox="0 0 30 24">
                        <path d="M28 0a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H10.4a2 2 0 0 1-1.4-.6L1 13.1c-.6-.5-.9-1.3-.9-2 0-1 .3-1.7.9-2.2L9 .6a2 2 0 0 1 1.4-.6zm0 2H10.4l-8.2 8.3a1 1 0 0 0-.3.7c0 .3.1.5.3.7l8.2 8.4H28a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2zm-5 4a1 1 0 0 1 .7.3 1 1 0 0 1 0 1.4L20.4 11l3.3 3.3c.2.2.3.5.3.7 0 .3-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.7-.3L19 12.4l-3.4 3.3a1 1 0 0 1-.6.3 1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.2.1-.5.3-.7l3.3-3.3-3.3-3.3A1 1 0 0 1 14 7c0-.3.1-.5.3-.7A1 1 0 0 1 15 6a1 1 0 0 1 .6.3L19 9.6l3.3-3.3A1 1 0 0 1 23 6z" fill="currentColor" />
                    </svg>
                </div>
            </div>
        </div>
        <!-- 左侧栏 -->
        <div class="mat-number-keyboard__sidebar" v-if="theme === 'custom'">
            <div class="van-key__wrapper">
                <div role="button" tabindex="0" class="mat-key mat-key--large mat-key--delete" @click="onDelete()">
                    <svg class="mat-key__delete-icon" viewBox="0 0 30 24">
                        <path d="M28 0a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H10.4a2 2 0 0 1-1.4-.6L1 13.1c-.6-.5-.9-1.3-.9-2 0-1 .3-1.7.9-2.2L9 .6a2 2 0 0 1 1.4-.6zm0 2H10.4l-8.2 8.3a1 1 0 0 0-.3.7c0 .3.1.5.3.7l8.2 8.4H28a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2zm-5 4a1 1 0 0 1 .7.3 1 1 0 0 1 0 1.4L20.4 11l3.3 3.3c.2.2.3.5.3.7 0 .3-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.7-.3L19 12.4l-3.4 3.3a1 1 0 0 1-.6.3 1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.2.1-.5.3-.7l3.3-3.3-3.3-3.3A1 1 0 0 1 14 7c0-.3.1-.5.3-.7A1 1 0 0 1 15 6a1 1 0 0 1 .6.3L19 9.6l3.3-3.3A1 1 0 0 1 23 6z" fill="currentColor" />
                    </svg>
                </div>
            </div>
            <div class="mat-key__wrapper">
                <div role="button" tabindex="0" class="mat-key mat-key--large mat-key--blue" @click="onConfirm()">
                    完成
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { before } from 'lodash';
import { defineComponent, nextTick, onBeforeMount, onMounted, PropType, reactive, ref, toRefs } from 'vue';
import { oneOf } from 'vue-types';
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
        theme: oneOf(['custom', 'default']),
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
            type: [String, Array] as PropType < string | string[] > ,
            default: '',
        },
    },
    emits: ['input', 'delete', 'close', 'blur', 'show', 'hide', 'confirm'],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            keys: [{ text: '1', wider: false }, { text: '2', wider: false }, { text: '3', wider: false }, { text: '4', wider: false }, { text: '5', wider: false },
                { text: '6', wider: false }, { text: '7', wider: false }, { text: '8', wider: false }, { text: '9', wider: false }
            ] as any,
            value: '',
        });
        onBeforeMount(() => {
            if (props.extraKey) {
                const extraKeys = Array.isArray(props.extraKey) ? props.extraKey : [props.extraKey];
                if (extraKeys.length === 1) {
                    state.keys.push({ text: '0', wider: true }, { text: extraKeys[0], type: 'extra' });
                } else if (extraKeys.length === 2) {
                    state.keys.push({ text: extraKeys[0], type: 'extra' }, { text: 0 }, { text: extraKeys[1], type: 'extra' });
                }
                // if(state.keys.length % 3 === 1){
                    
                // }
            } else {
                // state.keys.push( { text: 'delete', wider: true, type: 'delete' },{ text: '0', wider: true }, { text: 'close', wider: true, type: 'close' },);
                state.keys.push({ text: '0', wider: true }, { text: 'close', type: 'close' }, );
            }
        });
        const onInput = function (key: any) {
            if (props.maxlength && state.value.length === props.maxlength)
                return;
            state.value += key.text;
            if (ctx) { ctx.emit('input', state.value) }
            if (props.maxlength && state.value.length === props.maxlength)
                onHide();
        };
        const onHide = function () {};
        const onDelete = function () {
            if (state.value) state.value = state.value.substring(0, state.value.length - 1);
            if (ctx) { ctx.emit('input', state.value); }
        };
        const onConfirm = function () {
            if (state.value)
                if (ctx) { ctx.emit('confirm', state.value); }
        };
        return { ...toRefs(state), onInput, onHide, onDelete, onConfirm };
    },
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
