<template>
<div class="content flex-c">
    <div class="content__pack flex-center"></div>
    <div class="content__foot flex-r-3"></div>
</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
export default defineComponent({
    name: '',
    props: {},
    emits: [],
    components: {},
    setup(props, ctx) {
        const state = reactive({});
        return {...toRefs(state)};
    },
});
</script>

<style lang="less" scoped>
</style>
