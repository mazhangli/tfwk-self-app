<template>
<!-- <div class="content flex-c divtip"> -->
<van-dialog v-model:show="show" :closeOnPopstate="true" className="bg" :show-cancel-button="false" :show-confirm-button="true" width="9rem" :overlay="true" overlayClass="van-overlay-white" theme="round-button" confirm-button-text="取消" message-align="center" @closed="onCalled">
    <!-- <p class="title__sub font-l blod">请将患者身份证放置在感应区</p>
    <van-image width="8rem" height="8rem" radius="1em" fit="contain" position="center" :src="captiongif" /> -->
    <medium-identity :medium="medium" v-if="medium.mediumcode === 'IDENTITY'" />
    <medium-medicareQR :medium="medium" v-if="medium.mediumcode === 'MEDICARE.BARCODE'" />
    <medium-scanner :medium="medium" v-if="medium.mediumcode === 'SCANNING'" />
    <medium-medical :medium="medium" v-if="medium.mediumcode === 'MEDICAL'" />
    <medium-medicare-card :medium="medium" v-if="medium.mediumcode === 'MEDICARE.CARD'" />
</van-dialog>
<!-- </div> -->
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref, toRefs, onActivated, onDeactivated, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue';
import MediumIdentity from './Identity.vue';
import MediumMedicareQR from './Medicare.QR.vue';
import MediumScanner from './Scanner.vue';
import MediumMedical from './Medical.vue';
import MediumMedicareCard from './Medicare.Card.vue';
export default defineComponent({
    name: 'MediumIndex',
    props: {
        menucode: String,
        medium: null as any,
        key: null as any,
    },
    emits: ['onCalled'],
    components: { MediumIdentity, MediumMedicareQR, MediumScanner, MediumMedical, MediumMedicareCard },
    setup(props, ctx) {
        const state = reactive({
            captiongif: null as any,
            show: false,
        });
        onMounted(() => {
            state.captiongif = require('@/assets/img/gif/identity.gif');
            state.show = true;
        });
        onUnmounted(() => {
            console.log('onUnmounted');
        });
        onBeforeMount(() => {
            console.log('onBeforeMount');
        });
        onBeforeUnmount(() => {
            console.log('onBeforeUnmount');
        });
        const onCalled = function () {
            state.show = false;
            ctx.emit('onCalled');
        };
        return { ...toRefs(state), onCalled };
    },
});
</script>

<style lang="less" scoped>
</style>
