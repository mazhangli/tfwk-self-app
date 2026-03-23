<template>
    <div class="content flex-c">
        <div class="content__pack flex-c-s">
            <div class="content flex-c-c">
                <media-medicare-card @onCallend="onMedicareCard" v-if="active === 0" :key="token" :medium="medicareCard" />
                <media-medicare-barcode @onCallend="onMedicareQR" v-if="active === 1" :key="token" :medium="medicareQr" />
                <media-identity @onCallend="onIdentity" v-if="active === 2" :key="token" :medium="identity" />
                <media-phone @onCallend="onPhone" v-if="active === 3" :key="token" :medium="phone" />
            </div>
        </div>
        <div class="content__foot flex-r-3">
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin iconfont" type="primary"
                v-if="active === 1" icon="exchange" icon-position="left" @click="active = 0">使用医保卡
            </van-button>
            <p class="font-m blod" v-if="active === 0">如您未携带医保卡,可使用电子凭证</p>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin iconfont" type="primary"
                v-if="active === 0" icon="exchange" icon-position="left" @click="active = 1">医保电子凭证
            </van-button>
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="wap-home" icon-position="left" @click="onCancel">返回主页
            </van-button>
            <timer-button class="margin" ref="RefItimer" size="1.1rem" :total="300" :finish="onCancel" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, toRefs, onBeforeMount } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import MediaIdentity from '@/views/terminal/Home/MediaPad/Media.Identity.vue';
import MediaMedicareCard from '@/views/terminal/Home/MediaPad/Media.Medicare.Card.vue';
import MediaMedicareBarcode from '@/views/terminal/Home/MediaPad/Media.Medicare.QR.vue';
import MediaPhone from '@/views/terminal/Home/MediaPad/Media.Phone.vue';
import { read as idcard } from '@/trans/driver/src/idcard';
import { pushAppHome } from '@/router/router';
import { callinsapi } from '@/trans/driver/src/insapi/index';
import { getPeronInfoObject } from '@/trans/driver/src/insapi/capinfo';
import { MethodEnum } from '@/trans/driver';
import { getStore, setStore } from '@/utils/cache/storage';
import { Close } from '@/utils/loading';
import { history$confined } from '@/trans/server/his/patient';
import { Dialog, Toast } from 'vant';

export default defineComponent({
    name: 'CreatorCard',
    props: {
        type: String,
    },
    emits: ['confirm'],
    components: { TimerButton, MediaIdentity, MediaMedicareCard, MediaMedicareBarcode, MediaPhone },
    setup(props, ctx) {
        const state = reactive({
            token: 0,
            active: 0,
            identity: null as any,
            medicareCard: null as any,
            medicareQr: null as any,
            phone: null as any,
        });
        onBeforeMount(() => {
            state.active = props.type === '医保' ? 0 : 2;
            var medias = getStore('medias');
            state.identity = medias.filter((item: any) => {
                return item.mediacode === 'IDENTITY';
            })[0];
            state.medicareCard = medias.filter((item: any) => {
                return item.mediacode === 'MEDICARE.CARD';
            })[0];
            state.medicareQr = medias.filter((item: any) => {
                return item.mediacode === 'MEDICARE.BARCODE';
            })[0];
            state.phone = medias.filter((item: any) => {
                return item.mediacode === 'PHONE';
            })[0];
            state.phone.title = '请输入常用手机号码';
        });
        const onCancel = function () {
            pushAppHome();
        };
        const onMedicareCard = async function () {
            state.token++;
            var readed = await callinsapi(MethodEnum.READ);
            console.log('medicare', readed);
            if (readed === true) {
                if (await history$confined('capinfo', 'capinfo', getStore('capinfo'), 'account') === true) {
                    Close();
                    Toast.loading({
                        forbidClick: true,
                        message: '此医保卡号在本院存在档案记录...',
                        className: 'mat_vant__toast',
                        icon: require("@/assets/toast.mat.svg"),
                        duration: 3000,
                        overlay:true,
                    });
                    onCancel();
                } else {
                    Close();
                    state.active = getStore('machine').hospitalcode === "bjftyy" ? 3 : 2;
                }
            } else {
                Close();
                onCancel();
            }
        };
        const onMedicareQR = async function (isAlive: Boolean, context: String) {
            state.token++;
            console.log(context);
            var readed = await callinsapi(MethodEnum.READ, context);
            console.log('medicare', readed);
            if (readed === true) {
                if (await history$confined('capinfo', 'capinfo', getStore('capinfo'), 'account') === true) {
                    Close();
                    Toast.loading({
                        forbidClick: true,
                        message: '此医保卡号在本院存在档案记录...',
                        className: 'mat_vant__toast',
                        icon: require("@/assets/toast.mat.svg"),
                        duration: 3000,
                        overlay:true,
                    });
                    onCancel();
                } else {
                    Close();
                    state.active = getStore('machine').hospitalcode === "bjftyy" ? 3 : 2;
                }
            } else {
                Close();
                onCancel();
            }
        };
        const onIdentity = async function () {
            state.token++;
            var readed = await idcard();
            console.log('identity', readed);
            if (readed === true) {
                if (await history$confined('身份证', getStore('identity').Code, {}, 'account') === true) {
                    Close();
                    Toast.loading({
                        forbidClick: true,
                        message: '此身份证号在本院存在档案记录...',
                        className: 'mat-van-toast',
                        icon: require("@/assets/toast.mat.svg"),
                        duration: 3000,
                        overlay:true,
                    });
                    onCancel();
                } else {
                    Close();
                    state.active = 3;
                }
            } else {
                Close();
                onCancel();
            }
        };
        const onPhone = async function (tel: String) {
            console.log('phone', tel);
            var medicare = props.type === '医保' ? getPeronInfoObject() : null;
            console.log(medicare);
            setStore('creator', {
                cardtype: props.type === '医保' ? "医保卡" : "身份证",
                cardno: props.type === '医保' ? (medicare.ic.Person_manage ? medicare.ic.id_no : medicare.ic.ic_no) : getStore('identity').Code,
                patname: props.type === '医保' ? medicare.ic.personname : getStore('identity').Name,
                sex: props.type === '医保' ? medicare.ic.sex : getStore('identity').Gender,
                birthday: props.type === '医保' ? medicare.ic.birthday : getStore('identity').Birthday,
                idcard: props.type === '医保' ? medicare.ic.id_no : getStore('identity').Code,
                phoneno: tel,
                address: props.type === '医保' ? "待补充" : getStore('identity').Address,
            });
            if (ctx) ctx.emit('confirm', null);
        };
        return { ...props, ...toRefs(state), onCancel, onIdentity, onMedicareCard, onMedicareQR, onPhone };
    },
});
</script>

<style lang="less" scoped>
.margin {
    margin-left: 0.2rem;
}
</style>
