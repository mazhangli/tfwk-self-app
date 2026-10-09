<template>
    <div class="content flex-c">
        <div class="content__pack flex-r-2" style="padding: 1%;" v-show="empty === false">
            <div class="content__nav flex-r-s">
                <div class="flex-r">
                    <van-icon name="contact" color="#1989fa" size="0.7rem" />
                    <p class="font-l">{{ patientName }}</p>
                </div>

                <div class="flex-r">
                    <van-icon name="idcard" color="#1989fa" size="0.7rem" />
                    <p class="font-l" :style="{ float: 'right' }">
                        病案号:{{ idcard }}</p>
                </div>
            </div>
            <picker-pack
                style="width: 100%;height: calc(100% - 1rem);background: rgba(#f0ecec,0.7); padding: 1%; border-radius: 1em;"
                :finished="true" class="" custom-style="flex direction_row direction_row wrap_yes">
                <el-card
                    style="height: max-content;background: #fff;margin-bottom: 1%;border-radius: 1em; flex-basis: 49%; margin-right: 1%;"
                    class="box-card" shadow="never" v-for="(item, index) in patients">
                    <template #header>
                        <div class="card-header">
                            <span v-if="item.state === '0'" class="font-m bloder" style="color: #1989FA;">{{ item.indate
                            }}入院, 目前在院</span>
                            <span v-if="item.state === '1'" class="font-m bloder off_lock" style="color: #1989FA;">{{
                                    item.outdate
                            }}出院</span>
                        </div>
                    </template>
                    <span :class="item.state === '0' ? '' : 'off_lock'">
                        <van-field v-model="item.branchName" label="科   别" :colon="true" :readonly="true" />
                        <van-field v-model="item.indate" label="入院日期" :colon="true" :readonly="true" />
                        <van-field v-model="item.balance" label="押金总额" :colon="true" :readonly="true" />
                        <van-field v-model="item.allCost" label="费用总额" :colon="true" :readonly="true" />
                    </span>
                    <span class="flex direction_row justify_between align-items_center align-content_center btn__foot"
                        style="height: 1.2rem">
                        <van-button type="success" icon="notes-o"
                            :class="item.state === '0' ? 'btn-size-normal btn__foot' : 'btn-size-normal btn__foot off_lock'"
                            @click="onOneDay(item)">每日一单</van-button>
                        <van-button type="success" icon="balance-list" class="btn-size-normal btn__foot"
                            @click="onDetail(item)">费用清单</van-button>
                    </span>
                </el-card>
            </picker-pack>
        </div>
        <van-empty v-if="empty === true" class="content__pack" :image="require('@/assets/svg/empty.3.svg')"
            image-size="4rem" description="没有查询到住院记录,或查询失败。" />
        <div class="content__foot flex-r-3">
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="wap-home" icon-position="left" @click="onHome">返回主页
            </van-button>
            <timer-button class="margin" ref="RefItimer" size="1.3rem" :total="300" :finish="onHome" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome, pushRouteWithoutParam, appRouteEnum } from '@/router/router';
import PickerPack from '@/components/Picker/Picker.pack.vue'
import { Toast, ToastOptions } from 'vant';
import { getStore, setStore, removeStore } from '@/utils/cache/storage';
export default defineComponent({
    name: 'InHospitalRecord',
    props: {
    },
    components: { TimerButton, PickerPack },
    setup(props) {
        const state = reactive({
            image: null,
            number: '',
            empty: true,
            patients: [] as any[],
            patientName: '',
            idcard: '',
            info: [] as any[],
        });
        onMounted(() => {
            state.patients = getStore('patients');
            if (state.patients) {
                console.log(state.patients);
                state.patientName = state.patients[0].patientName;
                state.idcard = state.patients[0].patientid;
                state.empty = false;
            }
            else {
                state.empty = true;
            }
        });
        const onHome = function () {
            pushAppHome();
        };
        const onRefresh = function () {

        };
        const onOneDay = async function (item: any) {
            if (item.state === '0') {
                setStore('patient', item);
                await pushRouteWithoutParam(appRouteEnum.OneDay);
            } else {
                Toast('非在院患者不支持每日一单查询');
            }
        };
        const onDetail = async function (item: any) {
            setStore('patient', item);
            await pushRouteWithoutParam(appRouteEnum.Inventory);
        };
        return { ...toRefs(state), onHome, onRefresh, onOneDay, onDetail };
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
    background-position: 65% 50% !important;
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

.off_lock {
    filter: progid:DXImageTransform.Microsoft.BasicImage(graysale=1);
    -webkit-filter: grayscale(100%);
}

/deep/ .van-empty__description {
    font-size: 0.34rem;

}

/deep/.el-card {
    border: none;
}

/deep/.van-cell {
    background: transparent;
}

/deep/.van-cell__value {
    color: #000 !important;
    font-size: larger;
}
</style>
