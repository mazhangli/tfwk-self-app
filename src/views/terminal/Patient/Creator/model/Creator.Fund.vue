<template>
    <div class="content flex-c">
        <div class="content__pack flex-center">
            <span class="title__sub mat-header font-l blod">请选择适合您的档案类型</span>
            <span class="card-scene flex-r-c">
                <!-- 左侧医保身份卡片 -->
                <span class="card-outer">
                    <van-button type="primary" block class="card-btn" color="#ffffff" @click="onClick('医保')">
                        <template #default>
                            <div class="ground">
                                <div class="card-header">
                                    <p class="font-l bloder">医保身份</p>
                                </div>
                                <div class="card-body">
                                    <div class="cardpad flex-r-c">
                                        <van-icon class="iconfont" class-prefix="mat-icon" name="medicarecard"
                                            size="1.2rem" />
                                        <div class="card-text flex-r-c">
                                            <p class="blod font-l">社会保障卡</p>
                                            <p class="blod font">8888****888</p>
                                        </div>
                                    </div>
                                    <div class="cardpad2 flex-r-c">
                                        <van-icon class="iconfont" class-prefix="mat-icon"
                                            name="yibaodianzipingzhengbeifen" size="1.5rem" />
                                        <div class="card-text flex-r-c">
                                            <p class="blod font-l">医保电子凭证</p>
                                            <p class="blod font">8888****888</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <p class="font-m blod">
                                        请提前准备好: 北京社保卡/北京医保电子凭证、居民身份证
                                    </p>
                                </div>
                            </div>
                        </template>
                    </van-button>
                </span>
                <!-- 右侧自费就诊卡片 -->
                <span class="card-outer">
                    <van-button type="primary" block class="card-btn" color="#ffffff" @click="onClick('自费')">
                        <template #default>
                            <div class="ground">
                                <div class="card-header">
                                    <p class="font-l bloder">自费就诊</p>
                                </div>
                                <div class="card-body">
                                    <div class="cardpad3 flex-r-c">
                                        <van-icon class="iconfont" class-prefix="mat-icon" name="idcard"
                                            size="1.2rem" />
                                        <div class="card-text flex-r-c">
                                            <p class="blod font-l">居民身份证</p>
                                            <p class="blod font">8888****888</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <p class="font-m blod">请提前准备好: 居民身份证</p>
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
.content__pack {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 0.4rem;
    box-sizing: border-box;

    .title__sub {
        margin-bottom: 0.4rem;
    }
}

.card-scene {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 0.4rem;
}

/* 卡片外层 */
.card-outer {
    width: 42%;
    aspect-ratio: 4 / 3;
    max-height: 60vh;
}

/* 清除van-button默认padding，关键！ */
:deep(.card-btn) {
    padding: 0 !important;
    border-radius: 0.3rem;
}

.card-btn {
    width: 100%;
    height: 100%;
}

.ground {
    width: 100%;
    height: 100%;
    /* 去掉ground的padding，防止双重内边距挤压 */
    padding: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

/* 顶部标题：固定高度，文字居中，防止溢出 */
.card-header {
    flex: 0 0 auto;
    width: 100%;
    padding: 0.3rem 0.2rem;
    display: flex;
    align-items: center;
    color: #333;
    justify-content: center;
    font-size: 0.33rem;

    p {
        margin: 0;
        font-size: 0.33rem;
        line-height: 1;
        white-space: nowrap;
    }
}

/* 中间卡片外浅蓝背景 */
.card-body {
    flex: 1;
    width: 100%;
    background-color: rgba(208, 224, 251, 0.8);
    padding: 0.3rem;
    border-radius: 0.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-height: 0;
    box-sizing: border-box;
}

/* 底部说明栏，自适应高度 */
.card-footer {
    flex: 0 0 auto;
    width: 100%;
    background-color: #F6F6F6;
    padding: 0.3rem 0.2rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    p {
        margin: 0;
        text-align: center;
        color: #222;
        line-height: 1.35;
    }
}

.card-text {
    margin-left: 0.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
        margin: 0;
        color: #ffffff;
    }
}

/* 医保蓝色卡片 */
.cardpad {
    background-image: linear-gradient(120deg, #2578ed 0%, #74b0f8 100%);
    width: 100%;
    flex: 1;
    min-height: 2rem;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    padding: 0.2rem;
    color: #fff;
    box-sizing: border-box;
}

/* 医保绿色卡片 */
.cardpad2 {
    background-image: linear-gradient(120deg, #489b58 0%, #8bc396 100%);
    width: 100%;
    flex: 1;
    min-height: 2rem;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    padding: 0.2rem;
    color: #fff;
    box-sizing: border-box;
}

/* 自费蓝色卡片 */
.cardpad3 {
    background-image: linear-gradient(120deg, #2578ed 0%, #74b0f8 100%);
    width: 100%;
    flex: 1;
    min-height: 2rem;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    padding: 0.2rem;
    color: #fff;
    box-sizing: border-box;
}

/* 竖屏媒体查询 */
@media (orientation: portrait) {
    .card-scene {
        gap: 0.6rem;
    }

    .card-outer {
        width: 44%;
        aspect-ratio: 4/3;
        max-height: 50vh;
    }

    .card-header p {
        font-size: 1.15rem;
    }
}
</style>
