<template>
  <div class="reg-Scheduling">
    <div id="SchedulingPad" class="reg-Scheduling-pad flex-r-2">
      <van-sidebar
        id="SchedulingSidebar"
        v-model="active"
        style="width: 2.3rem; height: 100%"
        @change="onChange"
      >
        <van-sidebar-item title="就诊日期" :badge="regDate" />
        <van-sidebar-item title="就诊科室" :badge="regDate" />
        <van-sidebar-item title="就诊医师" :badge="regDate" />
      </van-sidebar>
      <calendar class="reg-calendar" :dateRange="list3" v-show="active === 0" />
      <picker class="enbar" :list="list" v-show="active === 1"></picker>
      <picker class="reg-branch" :list="list2" v-show="active === 1"></picker>
      <picker class="enbar" :list="list" v-show="active === 2"></picker>
      <picker class="reg-branch" :list="list4" v-show="active === 2"></picker>
    </div>
    <div class="reg-Scheduling-foot flex-r-3">
      <van-button
        class="btn-size-small font-s margin"
        type="primary"
        icon="wap-home"
        icon-position="left"
        @click="onClick()"
        >返回主页
      </van-button>
      <timer-button class="margin" ref="RefItimer" size="1.1rem" :finish="onClick" />
    </div>
  </div>
  <!-- <van-popup
    v-model:show="show"
    round
    position="left"
    :style="{ position: 'absolute', height: '100%', width: '80%' }"
    teleport="#SchedulingSidebar"
  ></van-popup> -->
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import Calendar from '@/components/Calendar/Calendar.vue';
import Picker from '@/components/Picker/Picker.vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { Toast } from 'vant';
export default defineComponent({
  name: 'Scheduling',
  props: {},
  components: { Calendar, Picker, TimerButton },
  setup(props) {
    const state = reactive({
      list: [
        '全部',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'H',
        'I',
        'G',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'T',
        'Z',
      ],
      list2: ['不限科室', '消化内科', '骨外科', '脊柱外科', '妇科', '产科', '儿科'],
      list4: ['不限医师', '李时珍', '孙思邈', '华佗', '张三', '李四', '王五'],
      list3: [
        '2021-03-29',
        '2021-03-30',
        '2021-03-31',
        '2021-04-01',
        '2021-04-02',
        '2021-04-03',
        '2021-05-01',
        '2021-05-02',
        '2021-05-03',
      ],
      myContainer: { type: HTMLElement },
    });
    const show = ref(false);
    const active = ref(0);
    const left = ref('');
    const tabPosition = ref('left');
    const regDate = ref('2021-06-18');
    const regBranch = ref('');
    const regDoctor = ref('');
    let dom = ref();
    const getLeft = function (obj: HTMLElement | null) {
      var el = null;
      if (obj) {
        el = obj;
      } else {
        el = document.getElementById('SchedulingSidebar');
        console.log(el);
      }
      if (el) {
        var offset = el.offsetLeft;
        if (el.offsetParent != null) {
          offset += getLeft(el.offsetParent as HTMLElement);
        }
        return offset;
      } else {
        return 0;
      }
    };
    onMounted(() => {
      var el = document.getElementById('SchedulingSidebar');
      if (el) {
        dom.value = el;
      }
    });
    const onChange = (index: number) => {
      active.value = index;
      show.value = true;
    };

    return {
      ...props,
      ...toRefs(state),
      onMounted,
      active,
      show,
      tabPosition,
      onChange,
      regDate,
      regBranch,
      regDoctor,
      left,
      dom,
    };
  },
});
</script>

<style  lang="less" scoped>
.reg-Scheduling {
  position: relative;
  width: 100%;
  height: 100%;
  //margin: 2% 2%;
  //padding: 2% 1%;
  border-left: 1px rgba(#333, 0.5) solid;
  &-pad {
    height: ~'calc(100% - 1.5rem)';
  }
  &-foot {
    height: 1.5rem;
  }
}
.enbar {
  width: 3rem;
}
.reg-branch {
  width: 5rem;
}
.reg-calendar {
  width: 7rem;
}
/deep/.van-sidebar-item {
  background-color: rgba(#fff, 0.1);
  border-radius: 2px;
  border-right: 1px rgba(#333, 0.1) solid;
  box-shadow: 1px 7px 8px -6px rgba(#333, 0.2);
}
/deep/.van-sidebar-item.van-sidebar-item--select {
  background-color: rgba(#fff, 0.2);
}

/deep/.van-badge {
  width: max-content;
  background-color: #1989fa;
}
/deep/.van-sidebar-item--select::before {
  background-color: #1989fa;
}
/deep/.van-overlay {
  background-color: rgba(#fff, 0.1);
}
/deep/.van-popup--left.van-popup--round {
  border-radius: 0 3px 3px 0;
}

// /deep/.el-tabs--border-card {
//   background-color: transparent;
// }
// /deep/.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
//   background-color: transparent;
// }

// /deep/.el-tabs--left.el-tabs--border-card .el-tabs__header.is-left {
//   border: none;
//   background: transparent;
// }
// /deep/.el-tabs--left.el-tabs--border-card .el-tabs__item.is-left.is-active {
//   border-color: #d1dbe5 transparent;
//   color: #1989fa;
// }
// /deep/.el-tabs--left.el-tabs--border-card .el-tabs__item.is-left {
//   border: 1px #d1dbe5 solid;
//   line-height: 1rem;
//   height: 1rem;
//   color: #333;
// }

// /deep/ .el-tabs__item.is-left.el-tabs__item.is-active::before {
//   position: absolute;
//   top: 98%;
//   left: 35%;
//   width: 30%;
//   height: 5px;
//   background-color: #1989fa;
//   content: '';
// }
</style>
