<template>
<div class="content flex-c">
    <van-form class="content">
        <van-cell-group inset id="inputform" width="100%">
            <van-cell>
                <van-field v-model="patientname" :colon="true" label="患者姓名" placeholder="请输入就诊人姓名" @click="onName">
                    <template #right-icon>
                        <van-image :src="keyicon" width="0.5rem" />
                    </template>
                </van-field>
            </van-cell>
            <van-popover v-model:show="showPicker" placement="bottom" :actions="columns" @select="onSelect" @focus="onfocus">
                <template #reference>
                    <van-cell @click-input="onClicked">
                        <van-field v-model="cardtype" :colon="true" readonly is-link label="证件类型" placeholder="请选择就诊人使用的证件类型" :autofocus="false" />
                    </van-cell>
                </template>
            </van-popover>
            <van-cell>
                <van-field v-model="cardno" :colon="true" label="证 件 号" placeholder="请输入就诊人证件号" @click="onIdentity">
                    <template #right-icon>
                        <van-image :src="keyicon" width="0.5rem" />
                    </template>
                </van-field>
            </van-cell>
            <van-popover v-model:show="show" placement="top" theme="dark" :overlay="true">
                <template #reference>
                    <van-cell @click-input="show = true">
                        <van-field v-model="cardtype" :colon="true" readonly is-link label="地址" placeholder="选择省市区" :autofocus="false" />
                    </van-cell>
                </template>
                <van-picker title="" :columns="citys">
                    <template #confirm>
                        <van-button type="primary" icon="success">确定</van-button>
                    </template><template #cancel>
                        <van-button type="primary" hairline icon="revoke">取消</van-button>
                    </template>
                </van-picker>
            </van-popover>
        </van-cell-group>
    </van-form>
</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue';
import { Show, Hide } from '@/utils/terminal/keyboard/keyboard';
import { Lang } from '@/utils/terminal/keyboard/keyboard';
export default defineComponent({
    name: 'MediaEnter',
    props: {},
    emits: [],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            patientname: '',
            cardtype: '',
            cardno: '',
            lock: false,
            keyicon: null as any,
            show: false,
        });
        let socket = null as any;
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
        const columns = [
            { text: '居民身份证', value: 'idcard' },
            { text: '护照', value: 'Ningbo' },
            { text: '军官证', value: 'Wenzhou' },
            { text: '无卡建档', value: 'Shaoxing' },
        ];
        let showPicker = ref(false);
        const onSelect = (action: { text: any, value: string }) => {
            state.cardtype = action.text;
        };
        const onName = function () {
            state.lock = true;
            state.patientname = '';
            Show(Lang.English);
        };
        const onIdentity = function () {
            state.lock = true;
            state.cardno = '';
            Show(Lang.Identity);
        }
        const citys = [{
                text: '浙江',
                value: 'Zhejiang',
                children: [{
                        text: '杭州',
                        value: 'Hangzhou',
                        children: [
                            { text: '西湖区', value: 'Xihu' },
                            { text: '余杭区', value: 'Yuhang' },
                        ],
                    },
                    {
                        text: '温州',
                        value: 'Wenzhou',
                        children: [
                            { text: '鹿城区', value: 'Lucheng' },
                            { text: '瓯海区', value: 'Ouhai' },
                        ],
                    },
                ],
            },
            {
                text: '福建',
                value: 'Fujian',
                children: [{
                        text: '福州',
                        value: 'Fuzhou',
                        children: [
                            { text: '鼓楼区', value: 'Gulou' },
                            { text: '台江区', value: 'Taijiang' },
                        ],
                    },
                    {
                        text: '厦门',
                        value: 'Xiamen',
                        children: [
                            { text: '思明区', value: 'Siming' },
                            { text: '海沧区', value: 'Haicang' },
                        ],
                    },
                ],
            },
        ];
        return { ...toRefs(state), value, columns, showPicker, onClicked, onSelect, onfocus, onName, onIdentity, citys };
    },
});
</script>

<style lang="less" scoped>
.head {
    background: rgba(#07C261, 0.8);
    color: white;
    width: 100%;
    height: 3rem;
    border-top-left-radius: 1.5em;
    border-top-right-radius: 1.5em;

    p {
        line-height: 3rem;
        text-align: center;
        vertical-align: bottom;
    }
}

.body {
    width: 100%;
    height: calc(100% - 3rem);
    background: rgba(white, 60%);
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
}

.padding-border {
    padding-left: 15%;
    padding-right: 15%;
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

/deep/.van-picker {
    background: transparent !important;
}

/deep/ .van-picker__toolbar {
    min-width: 6rem;
    width: max-content;
}
</style>
