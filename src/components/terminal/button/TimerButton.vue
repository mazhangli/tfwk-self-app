<template>
<van-circle v-model:current-rate="rate" rate="100" layer-color="#fff" text="" :clockwise="false" :size="size" stroke-linecap="sqaure" stroke-width="30" :style="{ 'margin-left': '0.2rem' }">
    <div class="container flexbox flexbox-center">
        <van-count-down ref="countDown" :time="total * 1000" @finish="finish">
            <template #default="timeData">
                <span class="block">{{
            timeData.minutes - 9 > 0 ? timeData.minutes : '0' + timeData.minutes
          }}</span>
                <span class="colon">:</span>
                <span class="block">{{
            timeData.seconds - 9 > 0 ? timeData.seconds : '0' + timeData.seconds
          }}</span>
            </template>
        </van-count-down>
    </div>
</van-circle>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onBeforeMount,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    toRefs,
} from 'vue';
import { getStore } from '@/utils/cache/storage';
import { onBeforeRouteLeave } from 'vue-router';

export default defineComponent({
    name: 'TimerButton',
    props: {
        size: {
            type: String,
            default: '1.1rem',
        },
        finish: Function,
        loft: Number,
        total: Number,
    },
    components: {},

    setup(props) {
        const state = reactive({
            total: 0,
            current: 0,
            rate: 0,
            pause: false,
        });

        const countDown = ref();
        let timer: IntervalHandle;
        let started = false;
        onBeforeMount(() => {
            if (props.total && props.total > 0) {
                state.total = props.total;
            } else {
                state.total = parseInt(getStore('countdown').timer);
            }
        });
        onMounted(() => {
            if (state.total && started === false) {
                start();
            }
        });

        onUnmounted(() => {
            stop();
        });
        const update = () => {
            state.rate = (100 * state.current) / state.total;
            if (!state.pause) {
                state.current--;
            }
        };

        function start() {
            // console.log('start');
            started = true;
            update();
            if (!timer) {
                clearInterval(timer);
                state.current = state.total;
                timer = setInterval(() => update(), 1000);
            }
        }

        function stop() {
            clearInterval(timer);
        }

        function finish() {
            clearInterval(timer);
            if (props.finish) {
                props.finish();
            }
        }
        const pause = () => {
            if (state.pause === true) {
                state.pause = false;
                countDown.value.start();
            } else {
                state.pause = true;
                countDown.value.pause();
            }
        };
        return { ...toRefs(state), countDown, stop, pause, finish };
    },
});
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
}

.colon {
    display: inline-block;
    margin: 0 2px;
    font-size: 0.3rem;
    color: #ee0a24;
}

.block {
    display: inline-block;
    width: 0.4rem;
    color: #ee0a24;
    font-size: 0.25rem;
    text-align: center;
}
</style>
