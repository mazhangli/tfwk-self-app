<template>
    <div class="content">
        <div class="content__pack flex-r-2" style="padding: 1%;" v-show="empty === false">
            <div class="content__nav flex-r-s">
                <div class="flex-r">
                    <van-icon name="contact" color="#1989fa" size="0.7rem" />
                    <p class="font-l">{{patient.patname}}</p>
                </div>

                <div class="flex-r">
                    <van-icon name="idcard" color="#1989fa" size="0.7rem" />
                    <p class="font-l" :style="{ float: 'right' }">
                        证件号:{{ patient.idcard }}</p>
                </div>
            </div>
            <picker-pack
                style="width: 100%;height: calc(100% - 1rem);background: rgba(#f0ecec,0.7); padding: 1%; border-radius: 1em;"
                :finished="true" class="" custom-style="flex direction_row direction_row wrap_yes">
                <el-card
                    style="height: max-content;background: #fff;margin-bottom: 1%;border-radius: 1em; flex-basis: 49%; margin-right: 1%;"
                    class="box-card" shadow="never" v-for="(item, index) in info" :key="index">
                    <template #header>
                        <div class="card-header">
                            <span class="font-m bloder">{{ item.branchName }}</span>
                            <van-button type="success" class="btn-size-small" icon="newspaper-o"
                                style="border-radius: 0.5em" @click="onPrint(item)">补打单据</van-button>
                        </div>
                    </template>
                    <van-field v-model="item.doctorName" label="就诊医生" :colon="true" :readonly="true" />
                    <van-field v-model="item.registClass" label="挂号类型" :colon="true" :readonly="true" />
                    <van-field v-model="item.registDate" label="就诊日期" :colon="true" :readonly="true" />
                    <van-field v-model="item.timeSpan" label="预约时段" :colon="true" :readonly="true" />
                    <van-field v-model="item.empName" label="终    端" :colon="true" :readonly="true" />
                    <!-- <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div> -->
                </el-card>

            </picker-pack>
        </div>
        <van-empty v-if="empty === true" class="content__pack" :image="require('@/assets/svg/empty.3.svg')"
            image-size="4rem" description="没有查询到预约记录,或查询失败,可尝试[刷新]" />
        <div class="content__foot flex-r-3">
            <div class="font-m text"
                style="color:#1989fa; width: 30%;text-align: right; margin-right: 1rem;">仅显示有效且未就诊记录</div>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="replay" icon-position="left" @click="onRefresh">刷&nbsp;&nbsp;&nbsp;&nbsp;新
            </van-button>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="wap-home" icon-position="left" @click="onCancel">返回主页
            </van-button>
            <timer-button class="margin" ref="RefItimer" size="1.3rem" :total="300" :finish="onCancel" />
            <!-- :finish="onCancel" -->
        </div>
    </div>
</template>
    
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { Close, Open } from '@/utils/loading';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';
import { queryAppointment } from '@/trans/server/his/query';
import PickerPack from '@/components/Picker/Picker.pack.vue'
import { encode } from 'js-base64';
import { print } from '@/trans/driver/src/thermal';
import { Dialog } from 'vant';
import { getStore } from '@/utils/cache/storage';
export default defineComponent({
    name: 'QueryAppointment',
    props: {},
    emits: [],
    components: { TimerButton, PickerPack },
    setup(props, ctx) {
        const state = reactive({
            patient: {} as any,
            info: {} as any,
            empty: false,
            appointment: null,
            data: null as any,
        });
        onMounted(async () => {
            state.patient = getStore('history');
            state.data = '123123';
            state.appointment = require('@/assets/svg/appointment.svg');
            await onRefresh();
        });
        const onRefresh = async function () {
            Open('');
            state.info = await queryAppointment();
            console.log(state.info);
            if (!state.info || state.info.length === 0) {
                state.empty = true;
            } else {
                state.empty = false;
            }
            console.log(state.empty);
            Close();
        };
        const onCancel = function () {
            pushAppHome();
        };
        const onPrint = async function (data: any) {
            await print({ context: encode(data.printContent) });
        };
        return { ...toRefs(state), onCancel, onMounted, onRefresh, onPrint };
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
    background-image: url("~@/assets/img/ground.201.png") !important;
}

.box-card:nth-child(3n+2) {
    background-image: url("~@/assets/img/ground.202.png") !important;
}

.box-card:nth-child(3n+3) {
    background-image: url("~@/assets/img/ground.203.png") !important;
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

/deep/.van-cell {
    background: transparent;
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
</style>
    