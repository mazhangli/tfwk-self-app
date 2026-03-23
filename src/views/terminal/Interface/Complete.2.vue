<template>
<div class="content flex-c-c">
    <van-image :src="image" width="5rem" :style="{margin:'0.5rem'}" />
    <p class="title font-l blod">{{ title }}</p>
    <p class="交易结束,即将返回首页"></p>
    <van-divider :style="{ width: '70%' }"></van-divider>
    <span class="description flex-r" v-for="(item,index) in description" :key="index">
        <van-icon name="wap-nav" color="#1989fa" size="0.5rem" />
        <p> :{{item}}</p>
    </span>
    <div class="control flex-r-c">
        <span :style="{width: '3rem','margin':'0.1rem'}">
            <van-button plain type="primary" block @click="onFinish">返回首页</van-button>
        </span>
    </div>
    <timer-button class="margin" ref="RefItimer" size="1.1rem" :total="10" :finish="onFinish" />
</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';
import { useRoute } from 'vue-router';
import { any } from 'vue-types';
export default defineComponent({
    name: 'Complete.S',
    props: {
        
    },
    emits: ['CallBack'],
    components: { TimerButton },
    setup(props, ctx) {
        onBeforeMount(() => {
           /*路由*/
            const route = useRoute();
            state.state = route.query.state as string; 
            state.description = route.query.description; 
        });
        const state = reactive({
            state: 'success',
            description: null as any,
            title: '当前业务已完成!',
            subtitle: '',
        });
        const image = ref();
        onMounted(() => {
            if (state.state === 'success') {
                image.value = require('@/assets/svg/complete.svg');
                state.title = '当前业务已完成!';
            } else {
                image.value = require('@/assets/svg/faild.svg');
                state.title = '当前业务未完成!';
            }
        });
        const onFinish = function () {
            pushAppHome();
        };
        const onReturn = function () {
            ctx.emit('CallBack');
        };
        return {
            ...toRefs(state),
            image,
            onFinish,
            onReturn,
        };
    },
});
</script>

<style lang="less" scoped>
.title {
    color: #75AC64;
    line-height: 1rem;
}

.description {
    line-height: 0.5rem;
    height: 0.5rem;
    vertical-align: middle;
    text-align: center;
}

.control {
    height: 2rem;
    width: 100%;
}
</style>
