<template>
<div  id="EnKeyboard">
    <van-field v-model="text" label="拼音简码:" placeholder="请输入拼音简码" label-width="1.5rem" class="field__class" id="enKeybard__field" @focus="onFocus" />
    <div class="EnKeybard flex-r-2" id="enKeybard" v-show="show">
        <div v-for="(item, index) in keys" :key="index" :class="item.code.length === 1? ['vankey', 'van-key__wrapper']:['vankey-2','van-key__wrapper']">
            <van-button type="primary" class="content" @click="onClick(item)" :disabled="(item.code==='Del') && (!text || text.length === 0)">{{item.text}}</van-button>
        </div>
    </div>
</div>
</template>


<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue';
import { useEventListener } from '@vant/use';
import { emit } from 'process';
export default defineComponent({
    name: 'EnKeybard',
    props: {
        Size: {
            type: String,
            default: '10rem',
        },
        Color: {
            type: String,
            default: '#5EA4ED',
        },
        width: {
            type: String,
            default: '7rem',
        },
    },
    emits: ['confirm','change'],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            keys: [{ code: '0', text: '0' }, { code: '1', text: '1' }, { code: '2', text: '2' }, { code: '3', text: '3' }, { code: '4', text: '4' }, { code: '5', text: '5' }, { code: '6', text: '6' }, { code: '7', text: '7' }, { code: '8', text: '8' }, { code: '9', text: '9' },
                { code: 'A', text: 'A' }, { code: 'B', text: 'B' }, { code: 'C', text: 'C' }, { code: 'D', text: 'D' }, { code: 'E', text: 'E' }, { code: 'F', text: 'F' }, { code: 'G', text: 'G' }, { code: 'H', text: 'H' }, { code: 'I', text: 'I' }, { code: 'J', text: 'J' },
                { code: 'K', text: 'K' }, { code: 'L', text: 'L' }, { code: 'M', text: 'M' }, { code: 'N', text: 'N' }, { code: 'O', text: 'O' }, { code: 'P', text: 'P' }, { code: 'Q', text: 'Q' }, { code: 'R', text: 'R' }, { code: 'S', text: 'S' }, { code: 'T', text: 'T' },
                { code: 'U', text: 'U' }, { code: 'V', text: 'V' }, { code: 'W', text: 'W' }, { code: 'X', text: 'X' }, { code: 'Y', text: 'Y' }, { code: 'Z', text: 'Z' }, { code: 'Del', text: '删除' }, { code: 'Confirm', text: '确认' }
            ],
            text: '',
            left: '0px',
            top: '0px',
            show: false,
        });
        var Container = ref();
        var EnKeybard = ref();
        onMounted(() => {
            Container.value = document.getElementById('enKeybard__field');
            EnKeybard.value = document.getElementById('enKeybard');
            console.dir(Container.value);
            console.dir(EnKeybard.value);
            console.dir(Container.value.getBoundingClientRect());
            state.left = Container.value.getBoundingClientRect().left + 'px';
            state.top = (Container.value.getBoundingClientRect().bottom + 8) + 'px';
            //state.top = '10px';
        });
        const onFocus = function () {
            state.show = true;
        };
        const onBlur = function () {
            state.show = false;
        };
        const onClick = function (item: any) {
            switch (item.code) {
                case 'Del':
                    if (state.text.length > 0) {
                        state.text = state.text.substring(0, state.text.length - 1);
                    };
                    break;
                case 'Confirm':
                    ctx.emit('confirm', state.text);
                    state.show = false;
                    break;
                default:
                    state.text = state.text + item.code;
                    break;
            };
        };
        // 在 body 元素上绑定 click 事件
        useEventListener(
            'click',
            (e: any) => {
                if (window.document.querySelector('#EnKeyboard') && !window.document.querySelector('#EnKeyboard')?.contains(e.target)) {
                    onBlur();
                };
            }, { target: document.body }
        );
        return {
            ...toRefs(state),
            ...props,
            Container,
            EnKeybard,
            onFocus,
            onBlur,
            onClick,
        };
    },
});
</script>

<style lang="less" scoped>
.enKeybardfield {
    width: max-content;
    height: max-content;
}

.field__class {
    //width: v-bind(width);
    border-radius: 8px;
    border: #1989fa solid 1px;
    height: 1rem;
}

.EnKeybard {
    position: fixed;
    width: v-bind(Size);
    height: max-content;
    padding: 0.2rem;
    background-color: rgba(lightgray, 0.6);
    left: v-bind(left);
    top: v-bind(top);
    z-index: 999;

    .vankey {
        //width: 1rem;
        height: 1.1rem;
        font-size: 0.3rem;
        flex-basis: 12.5% !important;
    }

    .vankey-2 {
        height: 1.1rem;
        font-size: 0.3rem;
        flex-basis: 25% !important;
    }
}
</style>
