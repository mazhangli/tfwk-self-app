<template>
    <div class="content">
        <van-button type="primary" v-preventReClick="2000" class="app__medium" @click="onClicked"
            style="border: none;border-radius: 1em; overflow: hidden;">
            <template #default>
                <div class="app__medium-class">
                    <p class="font-l blod chinese" style="color: #fff">{{ history.pattype }}</p>
                </div>
            </template>
            <template #icon>
                <van-icon class="iconfont" class-prefix="mat-icon" name="zizhufuwu" size="1rem" />
            </template>
        </van-button>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, computed, reactive, toRefs, ref, onMounted, } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

export default defineComponent({
    name: 'MediumClass',
    components: {},
    props: {
        history: null as any,
    },
    emits: ['confirm'],
    setup(props, ctx) {
        const state = reactive({
        });
        onMounted(() => {

        });
        const onClicked = async function () {
            if(ctx) ctx.emit('confirm', props.history);
        };

        onBeforeRouteLeave(() => {
        });
        const onClose = async function () {
        };
        return { ...toRefs(props), ...toRefs(state), onClicked, onClose, };
    },
});
</script>
  
<style lang="less" scoped>
.app__medium {
    position: relative;
    box-shadow: 0 20px 25px -15px rgba(#252627, 0.2), 0 10px 10px -15px rgba(#252627, 0.1);
    width: 100%;
    height: 100%;
    background-color: transparent;


    &-class {
        font-size: 0.35rem;
    }
}
</style>
  