<template>
    <registry-mhyy />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import RegistryMhyy from '@/views/terminal/Registry/Registry.mhyy.vue';
import { Close, Open } from '@/utils/loading';
import { registCancel, registCommit, registDivde } from '@/trans';
import { useRoute } from 'vue-router';
import { encode } from 'js-base64';
import { getStore } from '@/utils/cache/storage';
import { regist$schedule } from '@/trans/server/his/register';
import { pushRouteWithoutParam, appRouteEnum, pushRouteWithParam } from '@/router/router';
import { print } from '@/trans/driver/src/thermal';
export default defineComponent({
    name: 'Registry',
    props: {

    },
    components: { RegistryMhyy },
    setup(props) {

        const state = reactive({
            
        });
        onBeforeMount(() => {
            
        });
        onMounted(() => {
            
        });
        
        return { ...toRefs(state) };
    },
});
</script>

<style lang="less" scoped></style>
