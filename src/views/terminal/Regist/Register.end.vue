<template>
    <div class="content flex-c">
        <div class="content__pack flex-center">
            <van-empty :image="require('@/assets/img/gif/ticket.gif')" description="请取走挂号凭据,并妥善留存" />
        </div>
        <div class="content__foot flex-r-3">
            <van-button v-preventReClick="2000" class="btn-size-normal font-s margin" type="primary" icon="wap-home" icon-position="left"
                @click="onEnd">返回主页
            </van-button>
            <timer-button :total="15" class="margin" ref="RefItimer" size="1.1rem" :finish="onEnd" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';
import { print } from '@/trans/driver/src/thermal';
export default defineComponent({
    name: 'RegisterEnd',
    props: {
        printContent: String,
    },
    components: { TimerButton },
    setup(props) {
        const state = reactive({
            image: null,
        });
        onMounted(async () => {
            await print({ context: props.printContent });
        });
        const onEnd = function () {
            pushAppHome();
        };
        return { ...toRefs(state), onEnd };
    },
});
</script>

<style lang="less" scoped>
/deep/ .van-empty__description {
    font-size: 0.34rem;
}

</style>
