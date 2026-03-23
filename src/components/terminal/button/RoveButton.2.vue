<template>
    <div class="roveing" ref="moveDiv"  @mousedown="down" @touchstart="down" @mousemove="move" 
        @touchmove="move" @mouseup="end" @touchend="end"><!-- :style="position" -->
        <van-button block round type="success" size="large" color="rgb(88, 94, 170)"
            :style="{ width: '100%', height: '100%' }" @click="onClick" v-preventReClick="2000">
            <template #default>
                <div class="flex-c">
                    <h2 class="font-l" style="color: #fff">退卡</h2>
                </div>
            </template>
        </van-button>
    </div>
</template>

<script lang="ts">
import { eject } from '@/trans/driver/src/other';
import { computed, defineComponent, nextTick, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import { useRect } from '@vant/use';
export default defineComponent({
    name: 'RoveButton',
    props: {
        // 通过position来设置初始定位
        // position: {
        //     type: Object,
        //     default: {
        //         bottom: '25%',
        //         right: '3%',
        //     }
        // },
        // 通过fixed来禁用自由移动
        fixed: {
            type: Boolean,
            default: false,
        },
    },
    emits: [],
    components: {},
    setup(props, ctx) {
        const state = reactive({
            flags: false,
            positionTemp: { x: 0, y: 0 }, // 记录手指点击的位置
            nx: 0,
            ny: 0,
            dx: 0,
            dy: 0,
            xPum: 0,
            yPum: 0,
            home: false,
            // position:{
            //     bottom: '25%',
            //     right: '3%',
            // },
        });
        onMounted(() => {
            const rect = useRect(document.querySelector('#root') as Element);
            // console.log(rect); // -> 元素的大小及其相对于视口的位置
            moveDiv.value.style.top = `${rect.bottom - 200}px`;   // 计算之后的高度和宽度直接设置给元素即可
            moveDiv.value.style.left = `${rect.width - 300}px`;
        });
        const moveDiv = ref(null) as any;
        const down = function (event: any) {
            if (!props.fixed) return;
            state.flags = true;
            var touch;
            // 该if判断是用touch还是mouse来移动
            if (event.touches) {
                touch = event.touches[0];
            } else {
                touch = event;
            }
            state.positionTemp.x = touch.clientX; // 手指点击后的位置
            state.positionTemp.y = touch.clientY;

            state.dx = moveDiv.value.offsetLeft; // 移动的div元素的位置
            state.dy = moveDiv.value.offsetTop;

            // console.log("moveDiv.value.offsetLeft", moveDiv.value.offsetLeft)
            // console.log("touch.clientX", touch.clientX)
        };
        const move = function (event: any) {
            if (state.flags) {
                var touch;
                if (event.touches) {
                    touch = event.touches[0];
                } else {
                    touch = event;
                }
                state.nx = touch.clientX - state.positionTemp.x; // 手指移动的变化量
                state.ny = touch.clientY - state.positionTemp.y;

                state.xPum = state.dx + state.nx; // 移动后，div元素的位置
                state.yPum = state.dy + state.ny;

                let windowWidth = document.documentElement.clientWidth;
                let windowHeight = document.documentElement.clientHeight;
                // console.log("window.clientWidth", windowWidth)
                // console.log(this.xPum)
                // console.log(" moveDiv.value.clientWidth", moveDiv.value.clientWidth)

                if (state.xPum > 0 && state.xPum + moveDiv.value.clientWidth < windowWidth) {
                    // movediv的左右边，未出界
                    moveDiv.value.style.left = state.xPum + 'px';
                } else if (state.xPum <= 0) {
                    // 左边出界，则左边缘贴边
                    moveDiv.value.style.left = 0 + 'px';
                } else if (state.xPum + moveDiv.value.clientWidth >= windowWidth) {
                    // 右边缘出界
                    moveDiv.value.style.left = windowWidth - moveDiv.value.clientWidth + 'px';
                    // console.log("dx", windowWidth - moveDiv.value.clientWidth)
                }
                // 上下未出界
                if (state.yPum > 0 && state.yPum + moveDiv.value.clientHeight < windowHeight) {
                    moveDiv.value.style.top = state.yPum + 'px';
                } else if (state.yPum <= 0) {
                    // 上边缘出界
                    moveDiv.value.style.top = 0 + 'px';
                } else if (state.yPum + moveDiv.value.clientHeight >= windowHeight) {
                    // 下边缘
                    // console.log("windowHeight:", windowHeight)
                    // console.log("moveDiv.value.clientHeight:", moveDiv.value.clientHeight)
                    // console.log(this.yPum + moveDiv.value.clientHeight)
                    moveDiv.value.style.top = windowHeight - moveDiv.value.clientHeight + 'px';
                }

                // 阻止页面的滑动默认事件，为了只让悬浮球滑动，其他部分不滑动；如果碰到滑动问题，1.2 请注意是否获取到 touchmove, 系统默认passive: true，无法使用preventDefault
                // document.addEventListener("touchmove", function(){
                //  event.preventDefault();
                // }, { passive: false });
                // document.addEventListener("mousemove", function(){
                //   event.preventDefault();
                // }, { passive: false });
                document.addEventListener('touchmove', preventDefault, { passive: false });
                document.addEventListener('mousemove', preventDefault, { passive: false });
            }
        };
        const end = function (event: any) {
            state.flags = false;
            // 注意事项，在添加和删除监听事件时，其function必须是同名的函数，不能为匿名函数。
            document.removeEventListener('touchmove', preventDefault, false);
            document.removeEventListener('mousemove', preventDefault, false);
            // 下面两句是保证在移除监听事件后，除了悬浮球的部分还能够滑动，如果不添加，则无法滑动
            document.addEventListener('touchmove', function (e) {
                event.returnValue = true;
            });
            document.addEventListener('mousemove', function (e) {
                event.returnValue = true;
            });
        };
        const preventDefault = function (e: any) {
            e.preventDefault();
        };
        const onClick = async function () {
            // console.log('退卡');
            await eject();
        };
        return { ...toRefs(state), moveDiv, down, move, end, preventDefault, onClick };
    },
});
</script>
<style lang="less" scoped>
.roveing {
    /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
    z-index: 999;
    position: fixed; // 这里的定位方式有待考量，fixed的话存在未知设置不合理，跑出屏幕不显示的问题
    width: 3rem;
    height: 3rem;
    padding: 10px;
    opacity: 1;
    filter: progid:DXImageTransform.Microsoft.alpha(opacity=100);
}

.roveing:hover {
    opacity: 0.7;
    filter: progid:DXImageTransform.Microsoft.alpha(opacity=70);
}
</style>
