<template>
    <!-- <van-button v-preventReClick="2000" style="width: 100%; height: 100%; border-radius: 1em; overflow: hidden;" block native-type="submit" class="mat-button"
        @click="onClick"> -->
    <button v-preventReClick="2000" style="width: 100%; height: 100%; border-radius: 0.5em; overflow: hidden;"
        class="mat-button" @click="onClick">
        <div class="menu-subfield__item" :style="setClass">
            <div class="menu-subfield__item2 flex direction_column justify_start align-items_start align-content_start"
                style="padding: 5%">
                <div class="flex direction_column justify_start align-items_start align-content_start">
                    <!-- <van-icon class="iconfont" class-prefix="mat-icon" name="record" color="#fff" size="1rem"
                        style="padding-bottom: 0.3rem ; border-bottom: 3px solid #fff" /> -->
                    <van-image :src="(/^https?:\/\//.test(subfield.menuicon) || (subfield.menuicon||'').startsWith('//')) ? subfield.menuicon : require('@/assets/svg/button/' + subfield.menuicon)" height="0.8rem"
                        width="0.8rem" />
                </div>
                <div class="flex direction_column justify_start align-items_start align-content_start"
                    style="width: 100% !important;align-self:flex-start;align-items:flex-start;">
                    <p class="font-l blod" style="color:#fff;height: 1rem;line-height: 1rem;">{{ subfield.menuname }}
                    </p>
                    <p class="font" style="color:#fff;height: 0.5rem;line-height: 0.5rem;">{{ subfield.english }}
                    </p>
                </div>
            </div>
        </div>
    </button>
    <!-- </van-button> -->
</template>
    
<script lang="ts">
import { appRouteEnum, pushRouteWithoutParam, pushRouteWithParam } from '@/router/router';
import { setStore } from '@/utils/cache/storage';
import { hexToRGBo } from '@/utils/color';
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
export default defineComponent({
    name: 'MenuSubfieldItem',
    props: { subfield: null as any },
    emits: ['cancel'],
    components: {},
    setup(props, ctx) {
        onMounted(() => {
            console.log(props.subfield);
        });
        const onCancel = function () {
            if (ctx) ctx.emit('cancel');
        };
        const onClick = function () {
            console.log('点击');
            setStore('last', { menuCode: props.subfield.menucode });
            switch (props.subfield.menucode) {
                case 'account':
                    pushRouteWithoutParam(appRouteEnum.PatientCreate);
                    break;
                case 'charge.standards':
                    pushRouteWithoutParam(appRouteEnum.BasicItem);
                    break;
                case 'staff.nuclein':
                case 'nosocomial.nuclein':
                    pushRouteWithParam(appRouteEnum.userLoginMedia, {
                        menucode: props.subfield.menucode?.toLowerCase(),
                    });
                    break;
                default:
                    pushRouteWithParam(appRouteEnum.userLogin, {
                        mediums: JSON.stringify(props.subfield.mediums),
                        menucode: props.subfield.menucode?.toLowerCase(),
                    });
                    break;
            }
        };
        const setClass = computed((): any => {
            let less: string[] = [];
            if (props.subfield) {
                const rgb = hexToRGBo(props.subfield.menucolor);
                less = [
                    'background-image: linear-gradient(-120deg, rgba(' + rgb + ', 0.7), rgba(' + rgb + ', 0.9) 50%, rgb(' + rgb + '))',
                ];
            } else {
                less = ['display:none'];
            }
            return less;
        });

        return { onCancel, onClick, setClass };
    },
});
</script>
    
<style lang="less" scoped>
.menu-subfield__item {
    width: 100% !important;
    height: 100% !important;
    top: 0;
    left: 0;
}

.menu-subfield__item2 {
    height: 100%;
    width: 100%;

    background-repeat: no-repeat;
    background-size: auto 60%;
    background-position: calc(100%) calc(100%);
}

.menu-subfield__item2:nth-child(3n) {
    background-image: url('~@/assets/img/ground.8.png');
}

.menu-subfield__item2:nth-child(3n+1) {
    background-image: url('~@/assets/img/ground.9.png');
}

.menu-subfield__item2:nth-child(3n+2) {
    background-image: url('~@/assets/img/ground.10.png');
}

.mat-button {
    // transition: opacity 0.2s;
    box-sizing: border-box;
    transition: background 0.2s linear;
}

.mat-button:active {
    background: deeppink;
}

/deep/ .van-button--default {
    border: none;
    padding: 0;
}

/deep/ .van-button__content {
    width: 100%;
    height: 100%;
    padding: 0;
}
</style>
