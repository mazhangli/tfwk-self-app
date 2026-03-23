<template>
    <div class="content flex-c">
        <div class="content__pack flex-r-c margin-rl">
            <div class="content__foot">
                <div class="content__nav flex-r-s">
                    <div class="flex-r">
                        <van-icon name="contact" color="#1989fa" size="0.7rem" />
                        <p class="font-l"> {{ patient.patname }}</p>
                    </div>
                    <el-button-group>
                        <el-button type="primary" :style="{ width: '2rem', height: '1rem' }" size="large"
                            :disabled="type === '00'" @click="onSelect('00')">挂号</el-button>
                        <el-button type="primary" :style="{ width: '2rem', height: '1rem' }" size="large"
                            :disabled="type === '10'" @click="onSelect('10')">缴费</el-button>
                    </el-button-group>
                    <div class="flex-r">
                        <van-icon name="idcard" color="#1989fa" size="0.7rem" />
                        <p class="font-l" :style="{ float: 'right' }">
                            档案号:{{ patient.historyid }}</p>
                    </div>
                </div>
            </div>
            <div class="content__pack">
                <div class="content__nav">
                    <van-cell :style="{ width: '100%' }">
                        <template #default>
                            <div class="flex-r-c">
                                <van-button type="success" :style="{ 'width': '5%', float: 'left' }"
                                    @click="onSelectAll">全选</van-button>
                                <van-icon name="label" color="#1989fa" size="0.7rem" />
                                <p :style="{ 'width': '15%' }" class="van-ellipsis">交易时间</p>
                                <p :style="{ 'width': '10%' }" class="van-ellipsis">医保结算</p>
                                <p :style="{ 'width': '10%' }" class="van-ellipsis">支付金额</p>
                                <p :style="{ 'width': '10%' }" class="van-ellipsis">统筹金额</p>
                                <p :style="{ 'width': '10%' }" class="van-ellipsis">自付金额</p>
                                <p :style="{ 'width': '10%' }" class="van-ellipsis">个人账户</p>
                            </div>
                        </template>
                    </van-cell>
                </div>
                <div class="itempad">
                    <van-list class="content" v-model:loading="loading" :finished="finished" finished-text="没有更多了~"
                        v-model:error="error" error-text="请求失败,点击重新加载" @load="onLoad">
                        <van-cell v-for="(item, index) in datalist" :key="index">
                            <template #default>
                                <div class="flex-r-c">
                                    <van-checkbox :style="{ 'width': '5%' }" v-model="item.selected"
                                        shape="square"></van-checkbox>
                                    <van-icon name="label" color="#1989fa" size="0.7rem" />
                                    <p :style="{ 'width': '15%' }" class="van-ellipsis">{{ item.payTime }}</p>
                                    <span :style="{ 'width': '10%' }">
                                        <van-tag type="primary" v-if="item.insState === '1'">是</van-tag>
                                        <van-tag color="#ffe1e1" text-color="#ad0000"
                                            v-if="item.insState === '0'">否</van-tag>
                                    </span>
                                    <p :style="{ 'width': '10%' }" class="van-ellipsis">¥ {{ item.cost }}</p>
                                    <p :style="{ 'width': '10%' }" class="van-ellipsis">¥ {{ item.pubCost }}</p>
                                    <p :style="{ 'width': '10%' }" class="van-ellipsis">¥ {{ item.payCost }}</p>
                                    <p :style="{ 'width': '10%' }" class="van-ellipsis">¥ {{ item.cardCost }}</p>
                                </div>
                            </template>
                        </van-cell>
                    </van-list>
                </div>
            </div>
        </div>
        <div class="content__pack flex-r-c mat-empty__description" v-if="hasInfo === false">
            <van-empty :image="empty" description="没有可打印的单据" image-size="5rem" />
        </div>
        <div class="content__foot flex-r-3">
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary" icon="replay"
                icon-position="left" @click="onRefresh">刷&nbsp;&nbsp;&nbsp;&nbsp;新
            </van-button>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="certificate" icon-position="left" @click="onConfirm">打&nbsp;&nbsp;&nbsp;&nbsp;印
            </van-button>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="wap-home" icon-position="left" @click="onQuit">返回主页
            </van-button>
            <timer-button :total="hasInfo === false ? 5 : 300" class="margin" ref="RefItimer" size="1.1rem"
                :finish="onQuit" />
        </div>
    </div>
</template>
  
<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, reactive, ref, toRefs, unref } from 'vue';
import PickerRow from '@/components/Picker/Picker.Row.vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { appRouteEnum, pushAppHome, pushRouteWithParam } from '@/router/router';
import { Close, Open } from '@/utils/loading';
import { invoice$lis$page, invoice$state } from '@/trans/server/his/invoice';
import { getStore, setStore } from '@/utils/cache/storage';

export default defineComponent({
    name: 'InvoiceList',
    props: {},
    emits: ['confirm'],
    components: { TimerButton, PickerRow },
    setup(props, ctx) {
        const state = reactive({
            patient: null as any,
            empty: null as any,
            loading: false,
            error: false,
            datalist: [] as any[],
            lines: 50,
            page: 0,
            type: "00",
            finished: false,
            hasInfo: true,
            btnText: '全选'
        });
        onBeforeMount(() => {
            state.patient = getStore('history');
        });
        onMounted(async () => {
            state.empty = require('@/assets/svg/report.none.svg');
        });
        const onData = function () {
            return invoice$lis$page(state.type, state.page, state.lines);
        };
        const onLoad = async function () {
            // 异步更新数据
            state.loading = true;
            var data: any[] = [];
            //while (page === 0 || (data && data.length > 0)) {
            state.page++;
            data = await onData();
            if (data === null || data.length === 0) {
                if (data === null) {
                    state.error = true;
                } else {
                    state.finished = true;
                }
            } else {
                state.datalist = state.datalist.concat(data);
                state.hasInfo = true;
            }
            //}
            // 加载状态结束
            state.loading = false;
        };

        const onRefresh = async function () {
            Open('');
            Close();
        };


        const onQuit = async function () {
            await pushAppHome();
        };
        const onSelect = function (type: string) {
            state.type = type;
            state.datalist = [];
            // 清空列表数据
            state.finished = false;
            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            state.loading = true;
            state.page = 0;
            onLoad();
        }
        const onSelectAll = function () {
            if (state.datalist.find(s => s.selected === false || s.selected === 0)) {
                state.datalist.forEach(el => {
                    el.selected = true;
                });
                state.btnText = '全消';
            } else {
                state.datalist.forEach(el => {
                    el.selected = false;
                });
                state.btnText = '全选';
            }
        }
        const onConfirm = function () {
            var info = state.datalist.filter(s => s.selected != false);
            const count = info.length;
            if (ctx && count > 0) ctx.emit('confirm', info);
        }
        return { ...toRefs(state), onRefresh, onQuit, onLoad, onSelect, onConfirm, onSelectAll };
    },
});
</script>
  
<style lang="less" scoped>
.mat-empty__description /deep/ .van-empty__description {
    font-size: 0.34rem;
}

.content__picker {
    padding-right: 10%;
    padding-left: 10%;
}

.van-cell__title {
    margin-bottom: 0.1rem;
    //padding-right: 1.5rem;
    padding-left: 1.5rem;
}

.van-cell__mat {
    margin-bottom: 0.2rem;
}

.margin-rl {
    padding-left: 5%;
    padding-right: 5%;
}

// .margin-rl p {
//     font-size: 0.33rem;
//     font-weight: bold;
// }

.line {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
}

.title {
    width: 100%;
    height: 1.3rem;
    line-height: 1.3rem;
    vertical-align: middle;
    text-align: center;
    font-size: 0.34rem;
    font-weight: blod;
}

.unfinished {
    -webkit-box-shadow: 5px 5px 10px 0px #f2990d !important;
    -moz-box-shadow: 5px 5px 10px 0px #f2990d !important;
    box-shadow: 5px 5px 10px 0px #f2990d !important;
}

.header {
    color: coral;
    font-size: 0.4rem;
    font-weight: bolder;
    line-height: 2rem;
    height: 2rem;
    vertical-align: middle;
}

.footer {
    color: coral;
    font-size: 0.4rem;
    font-weight: bolder;
    line-height: 1rem;
    height: 1rem;
    vertical-align: middle;
}

.count {
    color: #05afc8;
    font-size: 0.4rem;
}

.consult {
    -webkit-box-shadow: 5px 5px 10px 0px rgb(26, 158, 182) !important;
    -moz-box-shadow: 5px 5px 10px 0px rgb(26, 158, 182) !important;
    box-shadow: 5px 5px 10px 0px rgb(26, 158, 182) !important;
}

.lab {
    text-align: center;

    p {
        text-align: center;
    }

    &__name {
        flex-basis: 40%;
    }

    &__date {
        flex-basis: 20%;
    }

    &__lab {
        flex-basis: 20%;
    }
}

.margin {
    margin-left: 0.2rem;
}



.itempad {
    width: 100%;
    height: calc(100% - 1rem);
    overflow-y: scroll;
    //height: ~'calc(100% - 1.1rem)';
    //padding-top: 1%;
    padding-right: 2%;
    padding-left: 2%;
    border-radius: 2%;
    background-color: white;
}

.itempad::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: none;
    background-image: linear-gradient(to bottom,
            rgba(#f7f8fa, 0),
            rgba(#c9ceda, 0) 15%,
            rgba(#f7f8fa, 0) 85%,
            rgba(#f7f8fa, 1) 100%);
    width: 100%;
    height: 100%;
}
</style>
  