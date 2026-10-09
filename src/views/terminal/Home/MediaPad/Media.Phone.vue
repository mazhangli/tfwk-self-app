<template>
    <div class="content flex-c divtip">
        <div class="mat_fill__header font-l blod">
            <van-icon class="iconfont" class-prefix="mat-icon" name="wode-yibaoka" size="0.5rem" /> {{ medium.title }}
        </div>
        <div class="mat_fill__pack flex direction_column wrap_no justify_center align-content_center align-items_center"
            style="padding-left: 10%; padding-right: 10%" v-if="hide === false">
            <span style="width: 100%; padding-bottom: 0.3rem; padding-top: 0.3rem">
                <van-form ref="telform" style="width: 100%;">
                    <van-field v-model="tel" :center="true" placeholder="请输入手机号"
                        :rules="[{ required: true, message: '请输入手机号' }, { validator: asyncValidator, message: '手机号格错误' }]"
                        class="field">
                        <template #left-icon>
                            <van-icon class="iconfont" class-prefix="mat-icon" name="phoneNo" size="0.5rem" />
                        </template>
                    </van-field>
                </van-form>
            </span>
            <number-keyboard theme="custom" @input="onChange" @confirm="onLoading" :maxlength="11" />
        </div>
    </div>
</template>

<script lang="ts">
import { Open } from '@/utils/loading';
import { defineComponent, nextTick, onMounted, reactive, ref, watch, toRefs, onActivated, onDeactivated, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue';
import NumberKeyboard from '@/components/Keyboard/NumberKeyboard/src/index.vue';
import { setStore } from '@/utils/cache/storage';
import { isPhoneNumber } from '@/utils/is';

// ============================================================
// 图标/动画解析（与 AppMenu、Medium 保持一致）
// 支持三种来源：
//   1. 远程 URL：http://、https://、//
//   2. 绝对路径：/uploads/xxx.gif（后端返回的地址）
//   3. 本地文件：相对于 baseDir 的本地打包资源
// ============================================================
const resolveIcon = (ic: string | undefined | null, baseDir: string): string => {
  if (!ic) return '';
  if (/^(https?:)?\/\//.test(ic) || ic.startsWith('/')) return ic;
  try {
    return require(baseDir + ic);
  } catch (e) {
    return ic;
  }
};

export default defineComponent({
    name: 'MediaPhone',
    props: {
        medium: null as any,
    },
    emits: ['onCallend'],
    components: { NumberKeyboard },
    setup(props, ctx) {
        const state = reactive({
            caption: null as any,
            longined: false,
            live: false,
            tel: '',
            hide: false,
        });

        onMounted(() => {
            console.log('onMounted');
            state.caption = resolveIcon(props.medium.caption, '@/assets/img/gif/');
            console.log(state.caption);
            state.live = true;
        });

        onUnmounted(async () => {
            console.log('onUnmounted');
            //await calldrive(DeviceEnum.SPEAKER, 'speak', [props.medium.title], 0);
        });

        onBeforeMount(() => {
            console.log('onBeforeMount');
        });

        onBeforeUnmount(() => {
            console.log('onBeforeUnmount');
            state.live = false;
        });
        const telform = ref(null) as any;
        const onLoading = async function () {
            //state.longined = await login$only(props.medium.mediumcode as string, 0, val) as boolean;
            //if (state.longined === true && state.live === true) {
            telform.value.validate();
            if (await asyncValidator() === false) return;
            if (state.live === true) {
                if (state.tel) {
                    if (ctx) ctx.emit('onCallend', state.tel);
                }
            }
        };
        const onChange = function (val: any) {
            state.tel = val;
        };
        // 校验函数可以返回 Promise，实现异步校验
        const asyncValidator = function () {
            return new Promise((resolve, reject) => {
                try {
                    if (isPhoneNumber(state.tel) === true)
                        resolve(true);
                    else
                        resolve(false);
                } catch (err) {
                    reject();
                }
            });
        };
        return { ...toRefs(state), ...props, onLoading, onChange, asyncValidator, telform };
    },
});
</script>

<style lang="less" scoped>
// .divtip {
//     background-color: white !important;
// }

.field {
    z-index: 2022;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 20%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 20%);
    border-radius: 0.5em;
    width: 100%;
    margin: 0;
    font-weight: bold;
    height: auto;
}
</style>
