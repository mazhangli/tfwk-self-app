<template>
    <div class="content">
        <div class="content__pack flex-r-2" style="padding: 1%;" v-show="empty === false">
            <div class="content__nav flex-r-s">
                <div class="flex-r">
                    <van-icon name="contact" color="#1989fa" size="0.7rem" />
                    <p class="font-l">{{ patient.patientName }}</p>
                </div>

                <div class="flex-r">
                    <van-icon name="idcard" color="#1989fa" size="0.7rem" />
                    <p class="font-l" :style="{ float: 'right' }">
                        病案号:{{ patient.patientid }}</p>
                </div>
            </div>
            <div
                style="height: calc(100% - 1rem);width: 100%;background: #fff;border-radius: 1em;overflow: hidden;padding: 1%">
                <div class="content flex-r" style="overflow:hidden;">
                    <div style="height: 100%;width: 20%; overflow-y: scroll;">
                        <lazy-component>
                            <van-sidebar v-model="active" style="width: 100%;" @change="onDayChange">
                                <van-sidebar-item v-for="(item, index) in info_1" :title="onFormat(item)"
                                    :key="index" />
                            </van-sidebar>
                        </lazy-component>
                    </div>
                    <div style="height: 100%;width: 20%; overflow-y: scroll;">
                        <lazy-component>
                            <van-sidebar v-model="active2" style="width: 100%;" @change="onClassChange">
                                <van-sidebar-item v-for="(item, index) in info_2" :title="item" :key="index" />
                            </van-sidebar>
                        </lazy-component>
                    </div>
                    <div style="height: 100%;width: 60%; overflow-y: scroll;">
                        <lazy-component>
                            <span style="padding-left: 0.5rem; padding-right: 0.5rem;" class="flex-r-s">
                                <van-icon size="1rem" :name="require('@/assets/svg/sum.svg')" />
                                <span class="font-m bloder money">合计: 0.00元</span>
                            </span>
                            <van-cell v-for="(item, index) in info_3" :key="index">
                                <template #icon>
                                    <span style="margin: 0.1rem 0.3rem;" class="flex-center">
                                        <van-image width="1rem" height="1rem"
                                            :src="require('@/assets/svg/itemTotal.svg')" />
                                    </span>
                                </template>
                                <template #title>
                                    <div style="height: 50%;">
                                        {{ item.itemName }}
                                    </div>
                                </template>
                                <template #label>
                                    <div class="flex direction_row justify_between">
                                        <div class="text-middle">单位: {{ item.itemUnit }}</div>
                                        <div class="text-middle">规格: {{ item.itemSpec || 'null' }}</div>
                                        <div
                                            class="flex direction_column justify_between align-items_center align-content_center">
                                            <div>x{{ item.itemCount }}</div>
                                            <div class="money"> ¥{{ item.itemAmount
                                            }}</div>
                                        </div>
                                    </div>
                                </template>
                            </van-cell>
                        </lazy-component>
                    </div>
                </div>
            </div>
        </div>
        <van-empty v-if="empty === true" class="content__pack" :image="require('@/assets/svg/empty.3.svg')"
            image-size="4rem" description="没有查询到费用记录,或查询失败,可尝试[刷新]" />
        <div class="content__foot flex-r-3">
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="replay" icon-position="left" @click="onRefresh">刷&nbsp;&nbsp;&nbsp;&nbsp;新
            </van-button>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="wap-home" icon-position="left" @click="onCancel">返回主页
            </van-button>
            <timer-button class="margin" ref="RefItimer" size="1.3rem" :total="300" :finish="onCancel" />
        </div>
    </div>
</template>
    
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, onBeforeMount } from 'vue';
import { Close, Open } from '@/utils/loading';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';
import { daycost$query } from '@/trans/server/his/inhospital';
import PickerPack from '@/components/Picker/Picker.pack.vue'
import { getStore } from '@/utils/cache/storage';
import { useRoute } from 'vue-router';
import moment from 'moment';
import { AnyARecord } from 'dns';
export default defineComponent({
    name: 'OneDay',
    props: {},
    emits: [],
    components: { TimerButton, PickerPack },
    setup(props, ctx) {
        const state = reactive({
            patient: {} as any,
            info: {} as any,
            info_1: {} as any,
            info_2: {} as any,
            info_3: {} as any,
            day: null,
            itemClass: '',
            empty: false,
            active: 0,
            active2: 0,
            emptyimg: null,
        });
        onBeforeMount(() => {
        });
        onMounted(async () => {
            state.patient = getStore('patient');
            await onRefresh();
        });
        const onRefresh = async function () {
            Open('');
            state.info = await daycost$query();
            Close();
            if (!state.info || state.info.length === 0) {
                state.empty = true;
            } else {
                var info2 = state.info.map((s: any) => s.day);
                state.info_1 = noRepeat(info2);
                onDayChange(0);
                state.empty = false;
            }
        };
        const onCancel = function () {
            pushAppHome();
        };
        const noRepeat = function (arr: any[]) {
            var newArr = [...new Set(arr)]; //利用了Set结构不能接收重复数据的特点
            return newArr;
        };
        const onDayChange = function (index: number) {
            state.day = state.info_1[index];
            var info2 = state.info.filter((t: any) => t.day === state.day).map((s: any) => s.itemClass);
            state.info_2 = noRepeat(info2);
            state.active2 = 0;
            onClassChange(0);
        };
        const onFormat = function (item: Date) {
            return moment(item).format('yyyy年MM月DD日');
        };
        const onClassChange = function (index: number) {
            state.itemClass = state.info_2[index];
            state.info_3 = state.info.filter((t: any) => t.day === state.day && t.itemClass === state.itemClass);
            console.log(state.info_3);
        };
        return { ...toRefs(state), onCancel, onMounted, onRefresh, noRepeat, onDayChange, onFormat, onClassChange };
    },
});
</script>
    
<style lang="less" scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.item {
    margin-bottom: 0px;
}

.box-card {
    border: none;
    background-position: 95% 95% !important;
    background-size: auto 40% !important;
    background-repeat: no-repeat !important;
}

.box-card:nth-child(3n+1) {
    background-image: url("~@/assets/img/ground.7.png") !important;
}

.box-card:nth-child(3n+2) {
    background-image: url("~@/assets/img/ground.5.png") !important;
}

.box-card:nth-child(3n+3) {
    background-image: url("~@/assets/img/ground.6.png") !important;
}

.margin {
    margin-left: 0.2rem;
}

.grayscale {
    filter: progid:DXImageTransform.Microsoft.BasicImage(graysale=1);
    -webkit-filter: grayscale(100%);
}

/deep/.el-card {
    border: none;
}

// /deep/.van-cell {
//     background: transparent;
// }

/deep/.van-cell__title {
    width: calc(100% - 2.5rem);
}

/deep/.van-cell__value {
    color: #000 !important;
    font-size: larger;
}

.text {
    background-image: -webkit-linear-gradient(left, blue, #66ffff 10%, #cc00ff 20%, #CC00CC 30%, #CCCCFF 40%, #00FFFF 50%, #CCCCFF 60%, #CC00CC 70%, #CC00FF 80%, #66FFFF 90%, blue 100%);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-background-size: 200% 100%;
    -webkit-animation: masked-animation 4s linear infinite;
}

@keyframes masked-animation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -100% 0;
    }
}

/*定义滚动条样式（高宽及背景）*/
::-webkit-scrollbar {
    width: 0.2rem;
    background: #F0F3FF;
    border-radius: 8px;
}

/*定义滑块 样式*/
::-webkit-scrollbar-thumb {
    border-radius: 1em;
    height: 100px;
    /* 滚动条滑块长度 */
    background-color: #ccc;
}
</style>
    