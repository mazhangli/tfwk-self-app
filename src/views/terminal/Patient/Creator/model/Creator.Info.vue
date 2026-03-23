<template>
    <div class="content flex-c">
        <div class="content__pack flex-c-c">
            <van-form style="width: 10rem;">
                <div class="head">
                    <p class="font-l">请确认以下信息为患者本人信息</P>
                </div>
                <van-cell-group inset>
                    <van-field v-model="data.patname" :colon="true" label="姓名" input-align="right" readonly />
                    <van-field v-model="data.idcard" :colon="true" label="证件号" input-align="right" readonly />
                    <van-field v-model="data.phoneno" :colon="true" label="手机号" input-align="right" readonly />
                </van-cell-group>
                <div style="margin: 16px;">
                    <van-button v-preventReClick="2000" round block type="success" native-type="submit" @click="onSubmit">
                        确认本人信息
                    </van-button>
                </div>
            </van-form>
        </div>
        <div class="content__foot flex-r-3">
            <van-button v-preventReClick="2000" class="btn-size-small font-s margin" type="primary" icon="wap-home"
                icon-position="left" @click="onCancel">返回主页
            </van-button>
            <timer-button :total="120" class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
        </div>
</div>
</template>
    
<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { appRouteEnum, pushAppHome, pushRouteWithoutParam } from '@/router/router';
import { useRoute } from 'vue-router';
import { getStore } from '@/utils/cache/storage';
export default defineComponent({
    name: 'CreatorInfo',
    props: {},
    emits: ['confirm'],
    components: { TimerButton },
    setup(props, ctx) {
        const state = reactive({
            data: null as any,
        });

        const onCancel = async function () {
            await pushAppHome();
        };

        onBeforeMount(() => {
            state.data = getStore('creator');
        });

        const onSubmit = async function () {
            console.log('onSubmit');
            if(ctx) ctx.emit('confirm')
        };
        return { ...toRefs(state), onCancel, onSubmit };
    },
});
</script>
    
<style lang="less" scoped>
.head {
    background: rgba(#428DF5);
    color: white;
    width: 100%;
    height: 1.2rem;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;

    p {
        line-height: 1.2rem;
        text-align: center;
        vertical-align: bottom;
    }
}

/deep/.van-cell-group--inset {
    margin: 0;
}

/deep/.van-cell {
    padding-bottom: 0.3rem;
    padding-top: 0.3rem;
}
</style>
    