<template>
    <div id="picker-pack" class="picker-pack">
        <div class="picker-pack__content">
            <div id="picker-pack__content" :class="customStyle">
                <slot />
            </div>
            <div class="picker-pack__finished van-ellipsis" v-show="finished">
                <van-image width="2.5rem" height="100%" :src="endicon" fit="contain" />
            </div>
            <div id="picker-pack-mask" class="picker-pack__mask"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRef, toRefs } from 'vue';
export default defineComponent({
    name: 'PickerPack',
    props: {
        finished: {
            type: Boolean,
        },
        customStyle: [String, Array, Object],
    },
    components: {},
    setup(props) {
        const endicon = ref();
        onMounted(() => {
            endicon.value = require('@/assets/svg/end.svg');
            //
        });
        return { ...props, onMounted, endicon };
    },
});
</script>

<style lang="less" scoped>
.picker-pack {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 6px;
}

.picker-pack::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: none;
    background-image: linear-gradient(to bottom,
            rgba(#f7f8fa, 0),
            rgba(#c9ceda, 0) 15%,
            rgba(#f7f8fa, 0) 85%,
            rgba(#f7f8fa, 1) 100%);
    width: 100%;
    height: 100%;
}

.picker-pack__content {
    position: relative;
    width: 100%;
    height: 100%;
    padding-right: 0.2rem;
    background: transparent;
    overflow-y: scroll;
    overflow-x: hidden;
}

.picker-pack__content::-webkit-scrollbar {
    display: none;
}

.picker-pack__finished {
    color: gray;
    width: 100%;
    line-height: 1rem;
    vertical-align: middle;
    text-align: center;
}
</style>
