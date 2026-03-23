<template>
<div id="Scanning">
    <!-- <van-field id="scannerfield" v-model="scannerfieldtext" rows="1" :autosize="false" type="textarea" :placeholder="placeholder" :autofocus="true" clear-trigger="always" right-icon="scan" :clearable="true" :border="true" :center="true" class="field" ref="scannerfield" @blur="refocus" @keyup.enter="close" /> -->
    <el-input :placeholder="placeholder" :rows=1 suffix-icon="el-icon-search" v-model="scannerfieldtext" :autofocus="true" :clearable="true" class="field" ref="scannerfield" @keyup.enter="close">
    </el-input>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useEventListener } from '@vant/use';
export default defineComponent({
    name: 'Scanning',
    props: {
        placeholder: String,
    },
    emits: ['callback'], //回调函数
    components: {},
    setup(props, ctx) {
        const state = reactive({
            scannerfieldtext: '',
        });
        const close = function () {
            const context = state.scannerfieldtext.replace(/\n|\r/g, "");
            console.log(context);
            if (context) ctx.emit('callback', context);
            state.scannerfieldtext = '';
        };
        const Container = ref(null as any);
        onMounted(() => {
            //Container.value = document.getElementById('scannerfield');
            console.dir(Container.value);
        });

        useEventListener(
            'click',
            () => {
                Container.value.focus();
            }, { target: document.body }
        );
        return { ...props, ...toRefs(state), close, Container };
    },
});
</script>

<style lang="less" scoped>
#Scanning {
    width: 100%;
    height: 100%;
    z-index: 2021;
}

.field {
    position: relative;
    z-index: 999;
    //border: rgba(gray, 0.3) solid 1px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    border-radius: 0.5em;
    width: 95%;
    margin: 2.5%;
}

/deep/ .van-icon {
    font-size: 0.5rem !important;
}

/deep/ .el-input__icon {
    width: 0.5rem !important;
    line-height: 0.5rem !important;
}
</style>
