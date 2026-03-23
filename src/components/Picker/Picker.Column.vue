<template>
<div class="picker-column-pack">
    <div :class="locked === true? ['picker-column__loacked','picker-column-pack__content']:['picker-column-pack__content']">
        <div id="picker-column-pack__content">
            <slot v-if="!list || list.length === 0" />
            <div v-if="list && list.length > 0" class="flex-r-c column__number">
                <div v-for="(item, index) in list" :key="index">
                    <van-cell :center='true' :clickable='true' :class="active === index?['cell__active']:['cell__inactive']" @click="onClick(index, item)">
                        <template #title>
                            <div :class="align === 'center'?['vancell_title__my','vancell_title__center']:['vancell_title__my']">{{item}}</div>
                        </template>
                    </van-cell>
                </div>
            </div>
        </div>
        <div class="picker-column-pack__finished" v-show="finished">
            <van-image width="2.5rem" height="100%" :src="endicon" fit="contain" />
        </div>
        <!-- <div class="picker-column-pack__mask"></div> -->
    </div>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRef, toRefs } from 'vue';
export default defineComponent({
    name: 'PickerColumn',
    props: {
        align: {
            type: String,
            default: 'center'
        },
        finished: {
            type: Boolean,
        },
        list: Array,
        columns: {
            type: Number,
            default: 5,
        },
        locked: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['select'],
    components: {},
    setup(props, ctx) {
        const active = ref(0);
        let colnum = ref(0);
        const endicon = ref();
        onMounted(() => {
            endicon.value = require('@/assets/svg/end.svg');
            colnum.value = props.columns;
            //
        });
        const onClick = function (index: number, val: string) {
            active.value = index;
            if (val) {
                ctx.emit('select', val);
            }
        };
        return { ...toRefs(props), onMounted, endicon, colnum, active, onClick };
    },
});
</script>

<style lang="less" scoped>
.picker-column-pack {
    position: relative;
    width: 100%;
    height: 100%;
    padding-right: 0.2rem;
    border-radius: 16px;
    padding: 0 2%;
}

.picker-column-pack::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: none;
    background-image: linear-gradient(to right,
            rgba(#f7f8fa, 0),
            rgba(#c9ceda, 0) 15%,
            rgba(#f7f8fa, 0) 85%,
            rgba(#f7f8fa, 1) 100%);
    width: 100%;
    height: 100%;
}

.picker-column-pack__content {
    position: relative;
    width: 100%;
    height: 100%;
    background: transparent;
    overflow-x: scroll;
    overflow-y: hidden;
}

.picker-column-pack__content::-webkit-scrollbar {
    display: none;
}

.picker-column-pack__finished {
    color: gray;
    height: 100%;
    width: 0.5rem;
    vertical-align: middle;
    text-align: center;
}

.vancell_title__my {
    span {
        width: 100%;
        height: 100%;
    }
}

.vancell_title__center {
    vertical-align: middle;
    text-align: center;
}

.picker__loacked {
    filter: progid:DXImageTransform.Microsoft.BasicImage(graysale=1);
    -webkit-filter: grayscale(100%);
}

/deep/ .van-cell {
    -webkit-box-shadow: 10px 10px 10px rgba(rgb(150, 149, 149), 0.2);
    -moz-box-shadow: 10px 10px 10px rgba(rgb(146, 145, 145), 0.2);
    box-shadow: 10px 10px 10px rgba(rgb(173, 173, 173), 0.2);
}

.cell__active {
    color: #fff !important;
    background-color: #1989fa !important;
    margin-bottom: 2px;
}

.cell__inactive {
    color: #333 !important;
    background-color: #fff !important;
    margin-bottom: 2px;
}
</style>
