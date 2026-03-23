<template>
    <div class="info__context flex-c">
        <van-cell-group class="title__sub">
            <van-cell title-class="cell__title doctortitle" value-class="cell__value doctor" title="就诊人"
                :value="info.patientName || ''" />
            <van-cell title-class="cell__title" value-class="cell__value" title="病历号号" :value="info.patientId || ''" />
            <van-cell title-class="cell__title" value-class="cell__value paycost" title="应缴金额" :value="'¥' + info.payCost" />
        </van-cell-group>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
export default defineComponent({
    name: 'DepositInfo',
    props: {
        info: {} as any,
    },
    components: {},
    setup(props, ctx) {
        return {};
    },
});
</script>

<style lang="less" scoped>
.info__context {
    padding: 5%;
    width: 7rem;
    height: 7.5rem;
}

.register__payoff {
    width: 100%;
    height: 1.2rem;
}

/deep/.cell__title {
    width: 1rem;
    //text-align-last: justify;
    text-align: left;
    color: #333;
}

/deep/.cell__value {
    text-align: right;

    span {
        color: #1989fa;
        font-weight: bold;
    }
}

/deep/.van-cell-group__title {
    font-size: 0.35rem;
    font-weight: bold;
    line-height: 0.7rem;
    padding: 16px 16px 16px;
    color: #333 !important;
    text-align: center;
    vertical-align: middle;
}

/deep/ .van-cell {
    background-color: transparent;
    font-size: 0.3rem;
    // padding: 2% 1%;
}

/deep/.van-cell-group {
    background-color: rgba(#fcfcfc, 0.4);
}

/deep/.doctortitle span {
    font-size: 0.45rem !important;
    font-weight: bold;
}

/deep/.doctor span {
    font-size: 0.45rem !important;
    color: #1989fa;
    font-weight: bold;
}

/deep/ .discount span {
    opacity: 0.7;
    //color: gray;
    text-decoration: line-through;
}

/deep/ .paycost span {
    //font-size: 0.35rem !important;
    font-weight: bolder;
    color: orangered !important;
}

/deep/ .topay span {
    //font-size: 0.35rem !important;
    color: orangered !important;
}

/deep/.van-cell::after {
    border: none;
}

/deep/[class*='van-hairline']::after {
    border: none;
}

/deep/.van-cell__title span {
    width: 1rem;
}
</style>
