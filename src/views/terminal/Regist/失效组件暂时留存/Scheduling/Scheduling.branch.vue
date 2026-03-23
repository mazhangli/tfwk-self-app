<template>
  <div class="scheduling-branch flex-r-2">
    <picker-pack style="width: 1.6rem" :finished="false">
      <picker-cell
        v-for="(item, index) in match"
        :key="index"
        :value="item"
        :center="true"
        :active="index === active"
        @click="onChange(index, item)"
      />
    </picker-pack>
    <picker-pack style="width: 14rem" :finished="true">      
      <picker-cell
        v-for="(item, index) in branchShow"
        :key="index"
        :value="item.branchName"
        :center="false"
        :active="index === active2"
        @click="onSelect(index, item)"
      />
    </picker-pack>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import PickerCell from '@/components/Picker/Picker.cell.vue';
import PickerPack from '@/components/Picker/Picker.pack.vue';
import { schedulingBranch } from '@/trans/server/index';
import { Open, Close } from '@/utils/loading';
export default defineComponent({
  name: 'SchedulingBranch',
  props: {},
  emits: ['change'], //回调函数
  components: { PickerCell, PickerPack },
  setup(props, ctx) {
    const state = reactive({
      match: ['全部'],
      branch: [{ branchCode: '', branchName: '', branchSpell: '' }],
      branchShow: [],
      active: 0,
      active2: 0,
    });

    onMounted(async () => {
      //
      Open('');
      state.branch = await schedulingBranch();
      state.branchShow = [];
      state.branch.forEach((item) => {
        var spell = item.branchSpell.substring(0, 1);
        if (
          state.match.find((s) => {
            return s === spell;
          })
        ) {
        } else {
          if (spell) state.match.push(spell);
        }
      });
      if (state.branch) ctx.emit('change', state.branch[0]);
      state.branchShow = state.branch;
      console.log(state.branchShow);
      state.match.sort().splice(state.match.indexOf('全部'), 1);
      Close();
    });
    const onChange = function (index: number, item: string) {
      state.active = index;
      state.branchShow = state.branch.filter((branchItem) => {
        return branchItem.branchSpell.startsWith(item);
      });
    };
    const onSelect = function (index: number, branch: any) {
      state.active2 = index;
      if (branch) ctx.emit('change', branch);
    };
    return {
      ...props,
      ...toRefs(state),
      onMounted,
      onChange,
      onSelect,
    };
  },
});
</script>

<style  lang="less" scoped>
.scheduling-branch {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
