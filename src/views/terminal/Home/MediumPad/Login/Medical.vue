<template>
    <div class="content flex-c divtip">
        <p class="title__sub font-xl blod">{{medium.title}}</p>
        <van-image width="90%" height="calc(100% - 1rem)" radius="1em" fit="contain" position="center" :src="caption" />
    </div>
</template>

<script lang="ts">
import { DeviceEnum } from '@/trans/driver';
import { find } from '@/trans/driver/src/other';
import { defineComponent, nextTick, onMounted, reactive, ref, watch, toRefs, onActivated, onDeactivated, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue';

export default defineComponent({
    name: 'MediumMedical',
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
        });

        onMounted(() => {
            state.caption = require('@/assets/img/gif/' + props.medium.caption);
            state.live = true;
            onLodding();
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

        const onLodding = async function () {
            if (await find(DeviceEnum.PATCARD, () => { return state.live; }) === false) {
                if (ctx) ctx.emit('onCallend', false);
            } else {
                if (ctx) ctx.emit('onCallend', state.live);
            }
        };
        return { ...toRefs(state), ...props, onLodding };
    },
});
</script>

<style lang="less" scoped>
.divtip {
    background-color: white !important;
}
</style>
