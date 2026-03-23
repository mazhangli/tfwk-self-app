<template>
    <invoice-list @confirm="onConfirm" v-if="active === 0"></invoice-list>
    <invoice-print :datalist="data" v-if="active === 1"></invoice-print>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import InvoiceList from '@/views/terminal/Invoice/Invoice.List.vue';
import InvoicePrint from '@/views/terminal/Invoice/Invoice.Print.vue';
import { Close, Open } from '@/utils/loading';
import { pushRouteWithoutParam, appRouteEnum, pushRouteWithParam } from '@/router/router';
export default defineComponent({
    name: 'Invoice',
    props: {

    },
    components: { InvoiceList, InvoicePrint },
    setup(props) {

        const state = reactive({
            active: 0,
            data: [] as any[],
        });
        onBeforeMount(() => {

        });
        onMounted(() => {

        });
        const onConfirm = function (data: any) {
            state.data = data;
            state.active = 1;
        };
        return { ...toRefs(state), onConfirm };
    },
});
</script>

<style lang="less" scoped></style>
