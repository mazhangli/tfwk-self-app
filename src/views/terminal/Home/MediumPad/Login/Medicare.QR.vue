<template>
    <div class="content flex-c divtip">
        <p class="title__sub font-l blod">{{ medium.title }}</p>
        <span style="padding:2%;width: 100%;height: 2rem">
            <el-input id="scannerfield" placeholder="请扫描二维码" :rows=1 suffix-icon="el-icon-search" v-model="value"
            :disabled="lockfield" :clearable="true" :maxlength="28" class="field" ref="Container" @keyup.enter="onClose">
            </el-input>
        </span>
        <van-image width="90%" height="calc(100% - 3rem)" radius="1em" fit="contain" position="center" :src="caption" />
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref, watch, toRefs, onActivated, onDeactivated, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue';
import { useEventListener } from '@vant/use';
import { find } from '@/trans/driver/src/other';
import { DeviceEnum } from '@/trans/driver';
import { Open } from '@/utils/loading';
export default defineComponent({
    name: 'MediumMedicareQR',
    props: {
        medium: null as any,
    },
    emits: ['onCallend'],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            caption: null as any,
            longined: false,
            live: false,
            value: '',
            lockfield: false,
        });

        const Container = ref(null as any);

        onMounted(() => {
            state.caption = require('@/assets/img/gif/' + props.medium.caption);
            console.dir(Container.value);
            state.live = true;
        });

        onUnmounted(() => {
            console.log('onUnmounted');
        });

        onBeforeMount(() => {
            console.log('onBeforeMount');
        });

        onBeforeUnmount(() => {
            console.log('onBeforeUnmount');
            state.live = false;
        });
        useEventListener(
            'click',
            () => {
                Container.value.focus();
            }, { target: document.body }
        );
        const onClose = async function () {
            const context = state.value.replace(/\n|\r/g, '');
            console.log(context);
            if (context) {
                state.lockfield = true;
                Open('');
                if (ctx) ctx.emit('onCallend', true, context);
            }
            state.value = '';
        };
        return { ...toRefs(state), ...props, Container, onClose };
    },
});
</script>

<style lang="less" scoped>
.divtip {
    background-color: white !important;
    // padding-left: 2%;
    // padding-right: 2%;
}

.field {
    position: relative;
    z-index: 999;
    //border: rgba(gray, 0.3) solid 1px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12) !important;
    border-radius: 0.5em;
    width: 95%;
    margin: 2.5%;
}

/deep/ .van-icon {
    font-size: 0.5rem !important;
}

/deep/ .el-input__icon {
    width: 0.5rem !important;
    line-height: 0.5rem !important;
}
</style>
