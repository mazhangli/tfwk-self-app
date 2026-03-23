<template>
    <div class="content flex-c">
        <creator-fund v-if="active === 0" @confirm="onCardinfo" />
        <creator-card :type="type" v-if="active === 1" @confirm="onConfirmInfo" />
        <creator-info v-if="active === 2" @confirm="onConfirm" />
</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import CreatorFund from './model/Creator.Fund.vue';
import CreatorCard from './model/Creator.Card.vue';
import CreatorInfo from './model/Creator.Info.vue';
import { Close, Open } from '@/utils/loading';
import { getStore } from '@/utils/cache/storage';
import { createHistory } from '@/trans/server/his/patient';
import { appRouteEnum, pushAppHome, pushRouteWithoutParam, pushRouteWithParam } from '@/router/router';

export default defineComponent({
    name: 'PatientCreate',
    props: {},
    emits: [],
    components: { CreatorFund, CreatorCard, CreatorInfo },
    setup(props, ctx) {
        const state = reactive({
            active: 0,
            type: '',
            isSuccess: false,
        });

        const onCardinfo = function (type: string) {
            console.log(type);
            state.type = type;
            state.active = 1;
        };

        const onConfirmInfo = function () {
            state.active = 2;
        }

        const onConfirm = async function () {
            Open('');
            state.isSuccess = await createHistory(getStore('creator'));
            if (state.isSuccess === true)
                await pushRouteWithParam(appRouteEnum.CompleteS, { state: 'success', description: ['建档成功,即将返回首页', '请您继续办理其他业务'] });
            else
                await pushRouteWithParam(appRouteEnum.CompleteS, { state: 'faild', description: ['建档失败,即将返回首页', '你可以尝试重启操作,或联系工作人员协助'] });
            Close();
        }
        return { ...toRefs(state), onCardinfo, onConfirmInfo, onConfirm };
    },
});
</script>

<style lang="less" scoped></style>
