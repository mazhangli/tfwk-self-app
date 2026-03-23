<template>
    <div class="content flex-c">
        <div class="content__pack flex-center">
            <span class="title__sub mat-header font-l blod">请选择适合您的档案类型</span>
            <span style="width: 100%;height: calc(100% - 2rem)" class="flex-r-c">
                <span style="width: 40% ;height: 100%; margin: 10px">
                    <van-button type="primary" block style="width: 100%; height: 100%; border-radius: 0.3rem" square
                        color="#ffffff" @click="onClick('医保')">
                        <template #default>
                            <div style="border-radius: 0.3rem" class="ground">
                                <div style="width: 100%;height: 15%;" class="flex-c-c radius-top">
                                    <p style="width: 100%; height: 50%;color: #C88400" class="font-l bloder flex-c-c">
                                        医保身份</p>
                                </div>
                                <div style="width: 100%; height: 75%;background-color: rgba(208,224,251,0.8); padding: 0.3rem;"
                                    class="radius-top">
                                    <div class="cardpad flex-r-c">
                                        <van-icon class="iconfont" class-prefix="mat-icon" name="medicarecard"
                                            size="1.2rem" />
                                        <div style="width: 60%; height: 100%; margin-left: 0.5rem" class="flex-r-c">
                                            <p class="blod font-l" style="width: 100%;height: 0.7rem;text-align: left;">
                                                社会保障卡</p>
                                            <p class="blod font" style="width: 100%;height: 0.5rem;text-align: left;">
                                                8888****888</p>
                                        </div>
                                    </div>
                                    <div class="cardpad2 flex-r-c">
                                        <van-icon class="iconfont" class-prefix="mat-icon"
                                            name="yibaodianzipingzhengbeifen" size="1.5rem" />
                                        <div style="width: 60%; height: 100%; margin-left: 0.5rem" class="flex-r-c">
                                            <p class="blod font-l" style="width: 100%;height: 0.7rem;text-align: left;">
                                                医保电子凭证</p>
                                            <p class="blod font" style="width: 100%;height: 0.5rem;text-align: left;">
                                                8888****888</p>
                                        </div>
                                    </div>
                                </div>
                                <div style="width: 100%;height: 10%; background-color: #F6F6F6; border-radius: #333 1 solid;"
                                    class="flex-c-c radius-bottom">
                                    <!-- <p style="width: 100%; height: 50%;color: #C88400" class="font-l bloder flex-c-c">
                                        医保身份</p> -->
                                    <p style="width: 100%; height: 50%;color: #000" class="font-m blod flex-c-c">
                                        请提前准备好: 北京社保卡/北京医保电子凭证、居民身份证</p>
                                </div>
                            </div>
                        </template>
                    </van-button>
                </span>
                <span style="width: 40% ;height: 100%; margin: 10px">
                    <van-button type="primary" block style="width: 100%; height: 100%; border-radius: 0.3rem" square
                        color="#ffffff" @click="onClick('自费')">
                        <template #default>
                            <div style="border-radius: 0.3rem" class="ground flex-r-c">
                                <div style="width: 100%;height: 15%;" class="flex-c-c radius-top">
                                    <p style="width: 100%; height: 50%;color: #4FC08D" class="font-l bloder flex-c-c">
                                        自费就诊</p>
                                </div>
                                <div style="width: 100%; height: 75%;background-color: rgba(208,224,251,1); padding: 0.3rem;"
                                    class="radius-top flex-r-c">
                                    <div class="cardpad flex-r-c">
                                        <van-icon class="iconfont" class-prefix="mat-icon" name="idcard"
                                            size="1.2rem" />
                                        <div style="width: 60%; height: 100%; margin-left: 0.5rem" class="flex-r-c">
                                            <p class="blod font-l" style="width: 100%;height: 0.7rem;text-align: left;">
                                                居民身份证</p>
                                            <p class="blod font" style="width: 100%;height: 0.5rem;text-align: left;">
                                                8888****888</p>
                                        </div>
                                    </div>
                                </div>
                                <div style="width: 100%;height: 10%;background-color: #F6F6F6;"
                                    class="flex-c-c radius-bottom">
                                    <!-- <p style="width: 100%; height: 50%;color: #4FC08D" class="font-l bloder flex-c-c">
                                    自费就诊</p> -->
                                    <p style="width: 100%; height: 50%;color: #000" class="font-m blod flex-c-c">
                                        请提前准备好: 居民身份证</p>
                                </div>
                            </div>
                        </template>
                    </van-button>

                </span>
            </span>
        </div>
        <div class="content__foot flex-r-3">
            <van-button v-preventReClick="2000" class="btn-size-normal font-s btn__foot margin" type="primary"
                icon="wap-home" icon-position="left" @click="onCancel">返回主页
            </van-button>
            <timer-button class="margin" ref="RefItimer" size="1.1rem" :total="300" :finish="onCancel" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { pushAppHome } from '@/router/router';
export default defineComponent({
    name: 'CreatorFund',
    props: {},
    emits: ['confirm'],
    components: { TimerButton },
    setup(props, ctx) {
        const onCancel = function () {
            pushAppHome();
        };
        const onClick = function (type: string) {
            if (ctx) ctx.emit('confirm', type);
        };
        return { onCancel, onClick };
    },
});
</script>

<style lang="less" scoped>
.ground {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding: 0.2rem;

    img {
        position: relative;
        width: 100%;
        height: 100%;
    }
}

.cardpad {
    //background-color:linear-gradient(-180deg, rgba(#323dd4,0.5) 0%, #323dd4 30%);// linear-gradient(to bottom, #323dd4, rgba(50, 61, 212, 0.4));
    background-image: linear-gradient(120deg, rgb(51, 129, 247) 0%, rgba(51, 129, 247, 0.5) 70%);
    margin-bottom: 0.2rem;
    width: 100%;
    height: 49%;
    // border-radius: 0.2rem;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    align-self: center;
    display: flex-item;
}

.cardpad2 {
    //background-color:linear-gradient(-180deg, rgba(#323dd4,0.5) 0%, #323dd4 30%);// linear-gradient(to bottom, #323dd4, rgba(50, 61, 212, 0.4));
    background-image: linear-gradient(120deg, rgb(112, 170, 116) 0%, rgba(112, 170, 116, 0.5) 70%);
    margin-bottom: 0.2rem;
    width: 100%;
    height: 49%;
    // border-radius: 0.2rem;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    align-self: center;
    display: flex-item;
}

.cardpad3 {
    //background-color:linear-gradient(-180deg, rgba(#323dd4,0.5) 0%, #323dd4 30%);// linear-gradient(to bottom, #323dd4, rgba(50, 61, 212, 0.4));
    background-image: linear-gradient(120deg, rgb(112, 170, 116) 0%, rgba(112, 170, 116, 0.5) 70%);
    margin-bottom: 0.2rem;
    width: 100%;
    height: 100%;
    // border-radius: 0.2rem;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    align-self: center;
    display: flex-item;
}

.radius-top {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
}

.radius-bottom {
    border-bottom-left-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
</style>
