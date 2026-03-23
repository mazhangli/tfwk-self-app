<template>
  <div class="scheduling-branch flex-c">
    <div class="scheduling-branch-pad flex-r-2">
      <div style="width: 1.5rem; height: 100%">
        <picker-pack :finished="false">
          <picker-cell
            v-for="(item, index) in match"
            :key="index"
            :value="item"
            :center="true"
            :active="index === active"
            @click="onChange(index, item)"
          />
        </picker-pack>
      </div>
      <div class="grid-list">
        <picker-pack :finished="true">
          <van-grid :column-num="3" :center="false" :gutter="10">
            <van-grid-item
              v-for="(item, index) in branchShow"
              :key="index"
              @click="onSelect(index, item)"
            >
              <van-image :src="branchIco" height="0.8rem" width="0.6rem" /><p
                class="item-branch van-multi-ellipsis--l2"
                >{{ item.branchName }}</p
              >
            </van-grid-item>
          </van-grid>
        </picker-pack>
      </div>
    </div>
    <div class="scheduling-branch-foot flex-r-3">
      <van-button
        class="btn-size-small font-s margin"
        type="primary"
        icon="replay"
        icon-position="left"
        @click="onRefresh"
        >刷&nbsp;&nbsp;&nbsp;&nbsp;新
      </van-button>
      <!-- <van-button
        class="btn-size-small font-s margin"
        type="primary"
        :icon="payicon"
        icon-position="left"
        >确&nbsp;&nbsp;&nbsp;&nbsp;定
      </van-button> -->
      <van-button
        class="btn-size-small font-s margin"
        type="primary"
        icon="wap-home"
        icon-position="left"
        @click="onCancel()"
        >返回主页
      </van-button>
      <timer-button class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import PickerCell from '@/components/Picker/Picker.cell.vue';
import PickerPack from '@/components/Picker/Picker.pack.vue';
import { schedulingBranch } from '@/trans/server/index';
import { Open, Close } from '@/utils/loading';
import { pushAppHome } from '@/router/router';
export default defineComponent({
  name: 'SchedulingBranch',
  props: {},
  emits: ['change'], //回调函数
  components: { PickerCell, PickerPack, TimerButton },
  setup(props, ctx) {
    const state = reactive({
      match: ['全部'],
      branch: [] as any[],
      branchShow: [] as any[],
      active: 0,
      active2: 0,
      branchIco: null,
    });

    onMounted(async () => {
      state.branchIco = require('@/assets/svg/branch.svg');
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
      //if (state.branch) ctx.emit('change', state.branch[0]);
      state.branchShow = state.branch;
      // state.match.sort();
      state.match.sort().splice(state.match.indexOf('全部'), 1);
      Close();
    });
    const onChange = function (index: number, item: string) {
      state.active = index;
      if (state.active === 0) {
        state.branchShow = state.branch;
      } else {
        state.branchShow = state.branch.filter((branchItem) => {
          return branchItem.branchSpell.startsWith(item);
        });
      }
    };
    const onSelect = function (index: number, branch: any) {
      state.active2 = index;
      if (branch) ctx.emit('change', branch);
    };
    const onRefresh = async function () {
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
      //if (state.branch) ctx.emit('change', state.branch[0]);
      state.branchShow = state.branch;
      // state.match.sort();
      state.match.sort().splice(state.match.indexOf('全部'), 1);
      Close();
    };
    const onCancel = async function () {
      pushAppHome();
    };
    return {
      ...props,
      ...toRefs(state),
      onMounted,
      onChange,
      onSelect,
      onRefresh,
      onCancel,
    };
  },
});
</script>

<style  lang="less" scoped>
.scheduling-branch {
  position: relative;
  width: 100%;
  height: 100%;
  &-pad {
    height: ~'calc(100% - 1.5rem)';
    width: 100%;
  }
  &-foot {
    height: 1.5rem;
    width: 100%;
  }
}
.grid-list {
  position: relative;
  width: ~'calc(100% - 1.5rem)';
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  overflow-x: hidden;
  overflow-y: scroll;
}
.grid-list-pad {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.item-branch {
  padding-left: 0.2rem;
}
.margin {
  margin-right: 0.2rem;
}
/deep/.van-grid-item__content {
  background-color: rgba(#fff, 0.6);
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  align-items: center;
  -webkit-box-shadow: 0 0 10px rgba(#333, 0.2);
  -moz-box-shadow: 0 0 10px rgba(#333, 0.2);
  box-shadow: 0 0 10px rgba(#333, 0.2);
}
/deep/.van-grid-item__content:hover {
  background-color: #1989fa;
  color: #fff;
}
</style>
