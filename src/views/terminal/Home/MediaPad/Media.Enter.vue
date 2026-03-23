<template>
<div class="content flex-c">
    <div class="content flex-r-c padding-border">
        <div class="head">
            <p class="font-xl">{{medium.title}}</P>
        </div>
        <div class="body padding-border">
            <van-form>
                <van-cell-group inset>
                    <van-cell :center="true">
                        <van-field :colon="true" :center="true" readonly label="患者姓名">
                            <template #input>
                                <van-field v-model="patientname" :center="true" placeholder="请输入就诊人姓名" :rules="[{ required: true, message: '请填写患者姓名' }]" @click="onName">
                                    <template #right-icon>
                                        <van-image :src="keyicon" width="0.5rem" />
                                    </template>
                                </van-field>
                            </template>
                        </van-field>
                    </van-cell>
                    <van-cell :center="true">
                        <van-field :colon="true" :center="true" readonly label="手机号">
                            <template #input>
                                <van-field v-model="phone" :center="true" placeholder="请输入手机号码" :rules="[{ required: true, message: '请输入手机号码' }, { validator: asyncValidator, message: '手机号码格式异常' }]" @click="onPhone">
                                    <template #right-icon>
                                        <van-image :src="keyicon" width="0.5rem" />
                                    </template>
                                </van-field>
                            </template>
                        </van-field>
                    </van-cell>
                    <van-cell :center="true">
                        <van-field :colon="true" :center="true" readonly label="证件信息">
                            <template #input>
                                <idcard-cell @change="onIdentity" />
                            </template>
                        </van-field>
                    </van-cell>
                    <van-cell :center="true">
                        <van-field :colon="true" :center="true" readonly label="联系地址">
                            <template #input>
                                <address-cell @change="onArea" />
                            </template>
                        </van-field>
                    </van-cell>
                </van-cell-group>
            </van-form>
            <div style="margin: 16px;">
                <van-button v-preventReClick="2000" round block type="success" native-type="submit" @click="onSubmit">
                    下一步
                </van-button>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Toast } from 'vant';
import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue';
import { Show, Hide } from '@/utils/terminal/keyboard/keyboard';
import { Lang } from '@/utils/terminal/keyboard/keyboard';
import AddressCell from '@/components/Label/AddressCell.vue';
import IdcardCell from '@/components/Label/IdcardCell.vue';
import { pushAppHome } from '@/router/router';
import { useEventListener } from '@vant/use';
import { isMobile, isPhoneNumber } from '@/utils/is';
import { setStore } from '@/utils/cache/storage';
export default defineComponent({
    name: 'PatientCreateInfo',
    props: { medium: null as any, },
    emits: ['onCallend'],
    components: { AddressCell, IdcardCell },
    setup(props, ctx) {
        const state = reactive({
            patientname: '',
            cardtype: '',
            cardno: '',
            phone: '',
            address: '',
            keyicon: null as any,
            show: false,
        });
        onMounted(() => {
            state.keyicon = require('@/assets/svg/keyboard.svg');
        });
        onBeforeUnmount(() => {
            Hide();
        });

        const value = ref('')
        const onfocus = function () {
            onClicked();
        };
        const onClicked = function () {
            console.log('click');
            showPicker.value = true;
        };
        let showPicker = ref(false);
        const onSelect = (action: { text: any, value: string }) => {
            state.cardtype = action.text;
        };
        const onName = function () {
            state.patientname = '';
            Show(Lang.Write);
        };
        const onPhone = function () {
            state.phone = '';
            Show(Lang.Number);
        };
        const onIdentity = function (type: string, no: string) {
            console.log(type, no);
            state.cardtype = type;
            state.cardno = no;
        }
        const onArea = function (val1: string, val2: string) {
            console.log(val1, val2);
            state.address = val1 + val2;
        }
        const onCancel = function () {
            pushAppHome();
        }
        // 校验函数可以返回 Promise，实现异步校验
        const asyncValidator = (code: string) =>
            new Promise((resolve) => {
                console.log(code);
                resolve(isPhoneNumber(code));
            });
        useEventListener(
            'click',
            (e: any) => {
                if (e.target.localName === 'input' || e.target.localName === 'textarea') {
                    if (e.target.autofocus === false && e.target.disabled === false) {
                        console.log('autofocus');
                        e.target.autofocus = true;
                    }
                }
            }, { target: document.body }
        );
        const onSubmit = function () {
            console.log('onSubmit');
            setStore('login', {
                cardtype: '录入',
                enter: {
                    idtype: state.cardtype,
                    code: state.cardno,
                    name: state.patientname,
                    phone: state.phone,
                }
            });

            console.log('当前患者登录成功', '登录方式', props.medium.mediumcode);
            if (ctx) ctx.emit('onCallend', true);
        }
        return { ...toRefs(state), value, showPicker, onClicked, onSelect, onfocus, onName, onPhone, onIdentity, onArea, onCancel, asyncValidator, onSubmit };
    },
});
</script>

<style lang="less" scoped>
.head {
    background: rgba(#428DF5);
    color: white;
    width: 100%;
    height: 1.5rem;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;

    p {
        line-height: 1.5rem;
        text-align: center;
        vertical-align: bottom;
    }
}

.body {
    width: 100%;
    height: calc(100% - 1.5rem);
    background: rgba(white);
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
}

.padding-border {
    padding-left: 10%;
    padding-right: 10%;
    padding-top: 2%;
    padding-bottom: 2%;
}

.dark {
    background: transparent;
}

/deep/ .van-popover__wrapper {
    width: 100%;
}

/deep/ .el-select {
    width: 100%;
}

/deep/ .el-input__inner {
    //border:#9ACCFF 1px solid;
    border: rgba(rgb(80, 80, 80), 0.1) 1px solid;
    padding: 0 3px;
    color: black;
}

/deep/ .el-select .el-input.is-focus .el-input__inner {
    border-color: rgba(rgb(80, 80, 80), 0.1);
}

/deep/.el-select .el-input__inner:focus {
    border-color: rgba(rgb(80, 80, 80), 0.1);
}

/deep/.van-popover {
    width: 12rem;
}

/dee/.van-popup {
    min-width: 6rem;
}

/deep/.van-picker {
    background: transparent !important;
}

/deep/.van-popover__content {
    width: 8rem !important;
}

/deep/ .van-picker__toolbar {
    min-width: 8rem;
    width: max-content;
}

/deep/ .van-cell {
    padding: 10px 16px;
}

/deep/.van-cell:after {
    border-bottom: none; //medium solid var(--van-cell-border-color)
}
</style>
