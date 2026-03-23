<template>
<span style="width: -webkit-fill-available">
    <van-form>
        <van-cell-group>
            <van-popover v-model:show="shownPiker" placement="bottom-start">
                <template #default>
                    <van-area v-if="shownPiker === true" :title="title" toolbar-position="bottom" :visible-item-count="5" :area-list="areaList" :columns-placeholder="['请选择', '请选择', '请选择']" :swipe-duration="200" :key="key" @change="onAreaChange">
                        <template #confirm>
                            <van-button type="success" icon="success" @click="onAreaConfirm" :disabled="able">确定</van-button>
                        </template>
                        <template #cancel>
                            <van-button type="success" icon="revoke" @click="onAreaCancel">取消</van-button>
                        </template>
                        <template #columns-top>
                            <span style="padding-bottom: 2%">
                                <van-row justify="space-around">
                                    <van-col span="6" class="flex-r-c">
                                        <span class="choice">{{!province ? '请选择':province}}</span>
                                    </van-col>
                                    <van-col span="6" class="flex-r-c">
                                        <span class="choice">{{!city ? '请选择':city}}</span>
                                    </van-col>
                                    <van-col span="6" class="flex-r-c">
                                        <span class="choice">{{!district ? '请选择':district}}</span>
                                    </van-col>
                                </van-row>
                            </span>
                        </template>
                    </van-area>
                </template>
                <template #reference>
                    <van-field v-model="result" :center="true" size="large" :border="true" placeholder="省/市/区县" :rules="[{ required: true, message: '请选择省/市/区县' }]" @click-input="onShown" is-link />
                    <!-- <van-field style="height: 1rem" v-model="result" placeholder="省/市/区县"  readonly is-link /> -->
                </template>
            </van-popover>
            <van-field v-model="result2" left-icon="location-o" rows="2" autosize label="详细地址" type="textarea" maxlength="50" placeholder="请输入详细地址(具体到门牌号)" show-word-limit @update:model-value="onInput" :rules="[{ required: true, message: '请输入详细地址' }]" @click-input="onKeyboard" />
        </van-cell-group>
    </van-form>
</span>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
// import { areaList } from '@vant/area-data';
import { Show, Hide } from '@/utils/terminal/keyboard/keyboard';
import { province, city, district } from '@/trans/server/self/dictionary';
import { Lang } from '@/utils/terminal/keyboard/keyboard';
import { Close, Open } from '@/utils/loading';
export default defineComponent({
    name: 'AddressCell',
    props: {
        placeholder: String,
    },
    emits: ['change'],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            token: 0,
            shownPiker: false,
            title: '',
            result: '',
            result2: '',
            options: {},
            province: '',
            city: '',
            district: '',
            able: true,
            areaList: null as any,
        });
        const onShown = function () {
            state.token++;
            state.province = "";
            state.city = "";
            state.district = "";
            state.result = "";
        };
        onBeforeMount(async () => {
            Open('');
            var jsonString = '';
            var province_list = await province();
            province_list.forEach((item: any) => {
                if (jsonString === '')
                    jsonString += '"' + item.adcode + '":"' + item.name + '"';
                else
                    jsonString += ',"' + item.adcode + '":"' + item.name + '"';
            });
            jsonString = "{" + jsonString + "}";
            console.log(jsonString);

            var jsonString2 = '';
            var city_list = await city('');
            city_list.forEach((item: any) => {
                if (jsonString2 === '')
                    jsonString2 += '"' + item.adcode + '":"' + item.name + '"';
                else
                    jsonString2 += ',"' + item.adcode + '":"' + item.name + '"';
            });
            jsonString2 = "{" + jsonString2 + "}";
            console.log(jsonString2);

            var jsonString3 = '';
            var county_list = await district('');
            county_list.forEach((item: any) => {
                if (jsonString3 === '')
                    jsonString3 += '"' + item.adcode + '":"' + item.name + '"';
                else
                    jsonString3 += ',"' + item.adcode + '":"' + item.name + '"';
            });
            jsonString3 = "{" + jsonString3 + "}";
            console.log(jsonString3);

            state.areaList = {
                province_list: JSON.parse(jsonString),
                city_list: JSON.parse(jsonString2),
                county_list: JSON.parse(jsonString3),
            };

            Close();
        });
        onMounted(() => {});
        const onAreaChange = function (val: any) {
            if (val && val[0]) state.province = !val[0].name ? "请选择" : val[0].name;
            if (val && val[1]) state.city = !val[1].name ? "请选择" : val[1].name;
            if (val && val[2]) state.district = !val[2].name ? "请选择" : val[2].name;
            if (state.province === "请选择" || state.city === "请选择" || state.district === "请选择")
                state.able = true;
            else
                state.able = false;
            // state.result = state.province + "/" + state.city + "/" + state.district;
        };
        const onAreaConfirm = function () {
            state.shownPiker = false;
            state.result = state.province + "/" + state.city + "/" + state.district;
            onData();
        };
        const onAreaCancel = function () {
            state.shownPiker = false;
            state.province = "";
            state.city = "";
            state.district = "";
        };
        const onInput = function () {
            onData();
        };
        const onData = function () {
            if (ctx) ctx.emit('change', state.province + state.city + state.district, state.result2);
        };
        const onKeyboard = function () {
            Show(Lang.Write);
        };

        let field = window.document.getElementById('CreatorInfoPad');
        return { ...toRefs(state), field, onShown, onAreaChange, onAreaConfirm, onAreaCancel, onInput, onData, onKeyboard };
    },
});
</script>

<style lang="less" scoped>
.padding {
    padding: 2%;
}

.o2 {
    width: 2rem;
}

.other {
    width: 10rem;
}

.choice {
    color: #ee0a24;
    font-weight: bold;
    width: max-content;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    vertical-align: middle;
    border-bottom: #ee0a24 medium solid;
    overflow: hidden;
}

/deep/.van-picker__columns {
    width: 10rem;
}

/deep/.van-popover__wrapper {
    height: -webkit-fill-available;
    width: -webkit-fill-available;
}

/deep/.van-hairline--top-bottom:after {
    border-width: thin 0 thin 0;
    border-top-color: rgb(188, 188, 189);
    border-bottom-color: rgb(188, 188, 189);
}
</style>
