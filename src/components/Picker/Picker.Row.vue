<template>
<div class="picker-pack">
    <div class="picker-pack__content">
        <!-- <div id="picker-pack__cell">  -->
        <slot v-if="!list || list.length === 0" />
        <span v-if="list && list.length > 0">
            <van-cell :center='true' :clickable='true' v-for="(item, index) in list" :key="index" :class="active === index?['cell__active']:['cell__inactive']" @click="onClick(index, item)">
                <template #title>
                    <div :class="align === 'center'?['vancell_title__my','vancell_title__center']:['vancell_title__my']">{{item}}</div>
                </template>
            </van-cell>
        </span>
        <!-- </div> -->
        <div class="picker-pack__finished" v-show="finished">
            <van-image width="2.5rem" height="100%" :src="endicon" fit="contain" />
        </div>
        <div class="picker-pack__mask"></div>
    </div>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRef, toRefs } from 'vue';
export default defineComponent({
    name: 'PickerRow',
    props: {
        align: {
            type: String,
            default: 'center'
        },
        finished: {
            type: Boolean,
        },
        list: Array,
        lineHeight: {
            type: String,
            default: '1rem',
        },
    },
    emits: ['select'],
    components: {},
    setup(props, ctx) {
        const active = ref(0);
        const endicon = ref();
        onMounted(() => {
            endicon.value = require('@/assets/svg/end.svg');
        });
        const onClick = function (index: number, val: string) {
            active.value = index;
            if (val) {
                ctx.emit('select', index, val);
            }
        };
        return { ...toRefs(props), onMounted, endicon, active, onClick };
    },
});
</script>

<style lang="less" scoped>
.picker-pack {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    padding-bottom: 0.1rem;
    // padding-left: 0.1rem;
    // padding-right: 0.1rem;
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
    background: transparent;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 0.2rem;
}

.picker-pack__content::-webkit-scrollbar {
    display: none;
}

.picker-pack__cell {
    width: 100%;
    height: ~'calc(100% - 1rem)';
}

.picker-pack__finished {
    width: 100%;
    line-height: 1rem;
    height: 1rem;
    vertical-align: middle;
    text-align: center;
}

.vancell_title__my {
    span {
        width: 100%;
        height: 100%;
    }
}

.vancell_title__center {
    vertical-align: middle;
    text-align: center;
}

/deep/ .van-cell {
    height: v-bind(lineHeight);
    -webkit-box-shadow: 10px 10px 10px rgba(rgb(150, 149, 149), 0.2);
    -moz-box-shadow: 10px 10px 10px rgba(rgb(146, 145, 145), 0.2);
    box-shadow: 10px 10px 10px rgba(rgb(173, 173, 173), 0.2);
}

.cell__active {
    color: #fff !important;
    background-color: #1989fa !important;
    height: v-bind(lineHeight);
}

.cell__inactive {
    color: #333 !important;
    background-color: #fff !important;
    height: v-bind(lineHeight);
}
</style>
