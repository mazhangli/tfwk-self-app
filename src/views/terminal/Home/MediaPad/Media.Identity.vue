<template>
    <div class="content flex-c divtip">
        <!-- <p class="title__sub font-m blod">{{medium.title}}</p> -->
        <div class="mat_fill__header font-l blod">
            <van-icon class="iconfont" class-prefix="mat-icon" name="wode-yibaoka" size="0.5rem" /> {{ medium.title }}
        </div>
        <van-image width="90%" class="mat_fill__pack" radius="1em" fit="contain" position="center" :src="caption" />
    </div>
</template>

<script lang="ts">
import { Open } from '@/utils/loading';
import { defineComponent, nextTick, onMounted, reactive, ref, watch, toRefs, onActivated, onDeactivated, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePageVisibility } from '@vant/use';
import { find } from '@/trans/driver/src/other';
import { DeviceEnum } from '@/trans/driver';
export default defineComponent({
    name: 'MediaIdentity',
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
            console.log('onMounted');
            state.caption = require('@/assets/img/gif/' + props.medium.caption);
            state.live = true;
            onLodding();
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

        const onLodding = async function () {
            if (await find(DeviceEnum.IDCARD, () => { return state.live; }) === false) {
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
    // background-color: white !important;
}

.head {
    background: rgba(#428DF5);
    color: white;
    width: 100%;
    height: 1.5rem;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;

    p {
        line-height: 1.5rem;
        text-align: center;
        vertical-align: bottom;
    }
}
</style>
