<template>
<div class="content flex-r">
    <span v-for="(item,index) in steps" :key="index" :style="{height: '1.2rem',padding: '0,10px'}" class="flex-r">
        <span :style="{height: '40%',width :'0.7rem'}" class="flex-r-c" v-if="index != 0">
            <!-- <el-divider direction="vertical" class="rotate"></el-divider> -->
            <van-image :src="arrow" height="80%" />
        </span>
        <span :class="index === active? ['flex-c-3','is__active']: index < active? ['flex-c-3','is__finish']:['flex-c-3','is__inactive']">
            <p>{{item.name}}</p>
        </span>
    </span>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, reactive, ref, toRef, toRefs, watch } from 'vue';
export default defineComponent({
    name: 'MatSteps',
    props: {
        active: {
            type: Number,
            default: 0
        },
        steps: Array,
        activecolor: {
            type: String,
            default: '#333',
        },
        inactivecolor: {
            type: String,
            default: '#969799',
        }
    },
    components: {},
    setup(props) {
        const arrow = require('@/assets/svg/steps-arrow.svg');
        return { ...toRefs(props), arrow };
    },
});
</script>

<style lang="less" scoped>
p {
    font-size: 0.34rem;
}

.is__finish {
    p {
        font-weight: bold;
        color: #5e5f61;
    }
}

.is__active {
    p {
        font-weight: bold;
        color: v-bind(activecolor);
    }
}

.is__inactive {
    p {
        color: v-bind(inactivecolor);
    }
}

.rotate {
    transform: rotate(18deg);
    -ms-transform: rotate(18deg);
    /* Internet Explorer */
    -moz-transform: rotate(18deg);
    /* Firefox */
    -webkit-transform: rotate(18deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(18deg);
    /* Opera */
}

/deep/.el-divider {
    background-color: darkslategray;
}
</style>
