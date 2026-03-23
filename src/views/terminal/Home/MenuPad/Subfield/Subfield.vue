<template>
    <div class="content">
        <div class="content__pack flex justify_center  align-content_center align-items_center">
            <div
                style="display: grid; grid-template-columns: repeat(10, 10%); grid-template-rows: repeat(4, 25%); gap: 4px 4px; width: 90%; height: 90%;">
                <div class="subfield__pack" v-for="(subfield, index) in subfields">
                    <!-- <menu-subfield-item :subfield="subfield" :key="index" /> -->
                    <button v-preventReClick="2000" :key="index"
                        style="width: 100%; height: 100%; border-radius: 1em; overflow: hidden;" class="mat-button"
                        color="transparent" @click="onClick(subfield)">
                        <div class="content" :style="setClass(subfield)">
                            <div class="subfield__item flex direction_column justify_start align-items_start align-content_start"
                                style="padding-top: 4%;padding-left: 5%;">
                                <div class="flex direction_column justify_start align-items_start align-content_start">
                                    <van-image :src="require('@/assets/svg/button/' + subfield.menuicon)" width="1rem"
                                        style="padding-bottom: 0.2rem ; border-bottom: 2px solid #fff" />
                                </div>
                                <div class="flex direction_column justify_start align-items_start align-content_start"
                                    style="width: 100% !important;align-self:flex-start;align-items:flex-start;">
                                    <p class="font-l blod" style="color:#fff;">{{
                                            subfield.menuname
                                    }}
                                    </p>
                                    <p class="font" style="color:#fff;">{{
                                            subfield.english
                                    }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div class="content__foot flex-r-e-s">
            <van-button v-preventReClick="2000" type="primary" class="btn-size-normal font-l btn__foot margin"
                icon="wap-home" icon-position="left" @click="onCancel">&nbsp;返&nbsp;&nbsp;&nbsp;回
            </van-button>
            <timer-button v-show="false" class="margin" ref="RefItimer" size="1.1rem" :total="30" :finish="onCancel" />
        </div>
    </div>
</template>
    
<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import { appRouteEnum, pushRouteWithoutParam, pushRouteWithParam } from '@/router/router';
import MenuSubfieldItem from './Subfield.Item.vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';
import { hexToRGBo } from '@/utils/color';
import { setStore } from '@/utils/cache/storage';
export default defineComponent({
    name: 'MenuSubfield',
    props: {
        subfields: null as any
    },
    emits: ['cancel'],
    components: { TimerButton, MenuSubfieldItem },
    setup(props, ctx) {
        const onCancel = function () {
            if (ctx) ctx.emit('cancel');
        };
        const onClick = function (subfield: any) {
            console.log('点击');
            setStore('last', { menuCode: subfield.menucode });
            switch (subfield.menucode) {
                case 'account':
                    pushRouteWithoutParam(appRouteEnum.PatientCreate);
                    break;
                case 'charge.standards':
                    pushRouteWithoutParam(appRouteEnum.BasicItem);
                    break;
                case 'staff.nuclein':
                case 'nosocomial.nuclein':
                    pushRouteWithParam(appRouteEnum.userLoginMedia, {
                        menucode: subfield.menucode?.toLowerCase(),
                    });
                    break;
                default:
                    pushRouteWithParam(appRouteEnum.userLogin, {
                        mediums: JSON.stringify(subfield.mediums),
                        menucode: subfield.menucode?.toLowerCase(),
                    });
                    break;
            }
        };
        const setClass = function (subfield: any) {
            let less: string[] = [];
            if (subfield) {
                const rgb = hexToRGBo(subfield.menucolor);
                less = [
                    'background-image: linear-gradient(-120deg, rgba(' + rgb + ', 0.7), rgba(' + rgb + ', 0.9) 50%, rgb(' + rgb + '))',
                ];
            } else {
                less = ['display:none'];
            }
            return less;
        };

        return { onCancel, onClick, setClass };
    },
});
</script>
    
<style lang="less" scoped>
.subfield__pack {
    height: 100%;
    border-radius: 0.3em !important;
    overflow: hidden;
    align-content: flex-start;
    align-self: flex-start;

    .subfield__item {
        height: 100%;
        width: 100%;

        background-repeat: no-repeat;
        background-size: auto 50%;
        background-position: calc(100%) calc(100%);
        background-image: url('~@/assets/img/ground.12.png') !important;
    }
}

.subfield__pack:nth-child(1) {
    border-top-left-radius: 2em;
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 1;
    grid-column-end: 5;
}

.subfield__pack:nth-child(2) {
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 5;
    grid-column-end: 8;
}

.subfield__pack:nth-child(3) {
    grid-row-start: 1;
    grid-row-end: 2;
    grid-column-start: 8;
    grid-column-end: 11;
}

.subfield__pack:nth-child(4) {
    grid-row-start: 2;
    grid-row-end: 3;
    grid-column-start: 8;
    grid-column-end: 11;
}

.subfield__pack:nth-child(5) {
    grid-row-start: 3;
    grid-row-end: 5;
    grid-column-start: 1;
    grid-column-end: 3;
}

.subfield__pack:nth-child(6) {
    grid-row-start: 3;
    grid-row-end: 5;
    grid-column-start: 3;
    grid-column-end: 5;
}

.subfield__pack:nth-child(7) {
    grid-row-start: 3;
    grid-row-end: 5;
    grid-column-start: 5;
    grid-column-end: 7;
}

.subfield__pack:nth-child(8) {
    grid-row-start: 3;
    grid-row-end: 5;
    grid-column-start: 7;
    grid-column-end: 9;
}

.subfield__pack:nth-child(9) {
    grid-row-start: 3;
    grid-row-end: 5;
    grid-column-start: 9;
    grid-column-end: 11;
}
// .subfield__pack:nth-child(5) {
//     border-bottom-left-radius: 2em;
//     flex-basis: 6rem !important;
// }

// .subfield__pack:nth-child(6) {
//     flex-basis: 4rem !important;
// }

// .subfield__pack:nth-child(4) {
//     border-top-right-radius: 2em;
// }

// .subfield__pack:nth-child(8) {
//     border-bottom-right-radius: 2em;
// }

.subfield__pack:nth-child(3n+1) {
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: calc(80%) calc(80%);
    background-image: url('~@/assets/img/ground.8.png') !important;
}

.subfield__pack:nth-child(3n+2) {
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: calc(80%) calc(80%);
    background-image: url('~@/assets/img/ground.9.png') !important;
}

.subfield__pack:nth-child(3n+3) {
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: calc(80%) calc(80%);
    background-image: url('~@/assets/img/ground.10.png') !important;
}



.mat-button {
    // transition: opacity 0.2s;
    box-sizing: border-box;
    transition: background 0.2s linear;
    background-repeat: no-repeat;
    background-size: auto 150%;
    background-position: calc(100%) calc(0);
    background-color: transparent;
    border-style: none;
}

.mat-button:active {
    background-color: rgba(deeppink, 0.5);
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

/deep/.van-button__content {
    width: 100% !important;
    height: 100% !important;
}

/deep/.van-button__text {
    font-size: 0.37rem;
    // font-weight: bold;
}

/deep/.van-button__icon {
    font-size: 0.5rem;
}
</style>
    