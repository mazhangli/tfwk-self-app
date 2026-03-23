<template>
<div class="content">
    <div class="content__pack flex-r">
        <div class="schedule__filter">
            <picker-row :list="filter" />
        </div>

        <div class="schedule__branch">
            <picker-row :list="filter" :finished='true' />
        </div>
        <div class="schedule__info flex-c">
            <div class="schedule__days"></div>
            <div class="schedule__schedling flex-r">
                <div class="schedule__doctor"></div>
            </div>
        </div>
    </div>
    <div class="content__foot flex-r-3">

    </div>
</div>
<van-empty v-show="empty" description="描述文字" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import PickerRow from '@/components/Picker/Picker.Row.vue';
import PickerColumn from '@/components/Picker/Picker.Column.vue';
import { schedulingSchedule } from '@/trans/server';
import { Close, Open } from '@/utils/loading';
export default defineComponent({
    name: 'Schedule',
    props: {

    },
    components: { PickerRow, PickerColumn },
    setup(props) {
        const state = reactive({
            info: {} as any,
            empty: false,
        });

        onMounted(() => {
            console.log('register.schedule');
            onRefresh();
        });
        const onRefresh = async function () {
            Open('');
            state.info = await schedulingSchedule('', '');
            Close();
        };
        const filter = computed(() => {
            if (state.info && state.info.branch) {
                var newarray = state.info.branch
                    .map((item: { branchSpell: any }) => item.branchSpell)
                    .filter(function (val: string) {
                        return val != '';
                    });
                newarray.sort();
                return ['全部', ...Array.from(new Set(newarray))];
            } else {
                return [];
            }
        });
        return { ...toRefs(props), ...toRefs(state), onMounted, onRefresh, filter, };
    },
});
</script>

<style lang="less" scoped>
.schedule {
    position: relative;
    padding: 0.1rem;

    &__filter {
        width: 2rem;
        height: 100%;
    }

    &__branch {
        width: 3rem;
        height: 100%;
    }
    &__info {
        width: ~'calc(100% -  5rem)';
        height: 100%;
    }

    &__days {
        height: 1rem;
        width: 100%;
    }

    &__schedling {
        height: ~'calc(100% - 1rem)';
        width: 100%;
    }


    &__doctor {
        width: ~'calc(100% - 3rem)';
        height: 100%;
    }
}
</style>
