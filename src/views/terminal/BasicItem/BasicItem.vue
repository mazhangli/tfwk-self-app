<template>
  <div :style="{ padding: '1% 5%' }" class="content">
    <div class="content__foot flex-r" id="BasicItem__content">
      <el-select v-model="itemtype" placeholder="筛选项目类别" class="itemtype padd" @change="onSelect">
        <el-option v-for="item in option" :key="item.text" :label="item.text" :value="item.text">
        </el-option>
      </el-select>
      <en-keyboard class="itemspell padd" @confirm="onInput" />
      <van-button v-preventReClick="2000" class="btnsize font-s btn__foot padd" type="primary" icon="replay"
        icon-position="left" @click="reLoad">刷&nbsp;&nbsp;&nbsp;&nbsp;新
      </van-button>
      <van-button v-preventReClick="2000" class="btnsize font-s btn__foot padd" type="primary" icon="wap-home"
        icon-position="left" @click="onCancel">返回主页
      </van-button>
      <timer-button class="padd" ref="RefItimer" size="1.1rem" :total="360" :finish="onCancel" />
    </div>
    <div class="content__pack flex-r-2">
      <div class="itempad" v-if="detail === true">
        <basic-item-d @back="onBack" :item="choose" />
      </div>
      <div class="itempad" v-if="detail === false">
        <van-list class="content" v-model:loading="loading" :finished="finished" finished-text="没有更多了~"
          v-model:error="error" error-text="请求失败,点击重新加载" @load="onLoad">
          <van-cell v-for="(item, index) in datalist" :key="index">
            <template #default>
              <div class="flex-r-c">
                <van-icon name="label" color="#1989fa" size="0.55rem" />
                <span class="flex-r-c" :style="{ width: 'calc(100% - 0.8rem)', 'justify-content': 'flex-start' }"
                  v-if="item.type === '药品'">
                  <p :style="{ width: '10%' }" class="van-ellipsis">{{ item.itemCode }}</p>
                  <p :style="{ width: '35%' }" class="van-ellipsis">{{ item.itemName }}</p>
                  <p :style="{ width: '10%' }" class="van-ellipsis">¥ {{ item.itemPrice }}</p>
                  <p :style="{ width: '15%' }" class="van-ellipsis">{{ item.itemSpec }}</p>
                  <p :style="{ width: '10%' }" class="van-ellipsis">{{ item.norms }}</p>
                  <p :style="{ width: '10%' }" class="van-ellipsis">{{ item.payClass }}</p>
                  <van-button plain icon="more" type="primary" @click="onClick(item)">
                    查看详情...
                  </van-button>
                </span>
                <!-- <span class="flex-r-c" :style="{width: 'calc(100% - 1.8rem)', 'justify-content': 'flex-start' }" v-if="item.type === '药品'">  
                  <p :style="{ width: '30%' }" class="van-ellipsis">{{ item.sccj }}</p>                                  
                  <p :style="{ width: '20%' }" class="van-ellipsis">{{ item.approval_number }}</p>
                  <p :style="{ width: '50%' }" class="van-ellipsis">{{ item.excluded_content }}</p>
                </span> -->
                <span class="flex-r-c" :style="{ width: 'calc(100% - 0.8rem)', 'justify-content': 'flex-start' }"
                  v-if="item.type === '诊疗' || item.type === '耗材'">
                  <p :style="{ width: '10%' }" class="van-ellipsis">{{ item.itemCode }}</p>
                  <p :style="{ width: '35%' }" class="van-ellipsis">{{ item.itemName }}</p>
                  <p :style="{ width: '10%' }" class="van-ellipsis">¥ {{ item.itemPrice }}</p>
                  <p :style="{ width: '15%' }" class="van-ellipsis">{{ item.itemSpec }}</p>
                  <p :style="{ width: '10%' }" class="van-ellipsis">{{ item.norms }}</p>
                  <p :style="{ width: '10%' }" class="van-ellipsis">{{ item.payClass }}</p>
                  <van-button plain icon="more" type="primary" @click="onClick(item)">
                    查看详情...
                  </van-button>
                </span>
                <!-- <span class="flex-r-c" :style="{width: 'calc(100% - 1.8rem)', 'justify-content': 'flex-start' }" v-if="item.type === '诊疗'">  
                  <p :style="{ width: '30%' }" class="van-ellipsis">{{ item.sccj }}</p>                                  
                  <p :style="{ width: '20%' }" class="van-ellipsis">{{ item.approval_number }}</p>
                  <p :style="{ width: '50%' }" class="van-ellipsis">{{ item.excluded_content }}</p>
                </span> -->
              </div>
            </template>
          </van-cell>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import EnKeyboard from '@/components/EnKeyboard/EnKeyboard.vue';
  import { pushAppHome } from '@/router/router';
  import { queryBasicitem } from '@/trans/server/his/query';
  import BasicItemD from './BasicItem.D.vue';
  export default defineComponent({
    name: 'BasicItem',
    props: {},
    emits: [],
    components: { TimerButton, EnKeyboard, BasicItemD },
    setup(props, ctx) {
      const state = reactive({
        itemtype: '药品',
        itemspell: '',
        loading: false,
        finished: false,
        error: false,
        datalist: [] as any[],
        lines: 50,
        page: 0,
        detail: false,
        choose: {} as any,
      });
      const option = [
        { text: '药品', value: 0 },
        { text: '诊疗', value: 1 },
        { text: '耗材', value: 2 },
      ];
      const Container = ref(null as any);
      onMounted(() => {});
      const onCancel = function () {
        pushAppHome();
      };
      const onData = function (page: Number) {
        return queryBasicitem(state.itemtype, page, state.lines, state.itemspell);
      };
      const onSelect = function () {
        state.itemspell = '%';
        reLoad();
      };
      const onInput = function (spell: any) {
        state.itemspell = '%' + spell + '%';
        reLoad();
      };
      const onClick = function (item: any) {
        state.choose = item;
        state.detail = true;
      };
      const onLoad = async function () {
        // 异步更新数据
        state.loading = true;
        var data: any[] = [];
        //while (page === 0 || (data && data.length > 0)) {
        state.page++;
        data = await onData(state.page);
        if (data === null || data.length === 0) {
          if (data === null) {
            state.error = true;
          } else {
            state.finished = true;
          }
        } else {
          state.datalist = state.datalist.concat(data);
        }
        //}
        // 加载状态结束
        state.loading = false;
      };
      const onBack = function () {
        state.choose = {};
        state.detail = false;
      };
      const reLoad = function () {
        state.loading = false;
        state.finished = false;
        state.error = false;
        state.datalist = [];
        state.page = 0;
        onLoad();
      };
      return {
        ...toRefs(state),
        option,
        Container,
        onCancel,
        onData,
        onSelect,
        onInput,
        onLoad,
        onClick,
        onBack,
        reLoad,
      };
    },
  });
</script>

<style lang="less" scoped>
.itemtype {
  width: 3rem;
  /* Element Plus 通过该 CSS 变量控制组件整体高度 */
  --el-component-size: 1.1rem;
}

.itemspell {
  width: 5rem;
}

.padd {
  margin-right: 0.2rem;
}

.btnsize {
  width: 2.3rem;
  height: 1.1rem;
}

.itempad {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  //height: ~'calc(100% - 1.1rem)';
  //padding-top: 1%;
  padding-right: 2%;
  padding-left: 2%;
  border-radius: 2%;
  background-color: white;
}

.itempad::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
  background-image: linear-gradient(to bottom,
      rgba(#f7f8fa, 0),
      rgba(#c9ceda, 0) 15%,
      rgba(#f7f8fa, 0) 85%,
      rgba(#f7f8fa, 1) 100%);
  width: 100%;
  height: 100%;
}

.pagination {
  width: 100%;
  height: 1.1rem;
}

.maxcontent {
  width: 50%;
}

/* Vue 3 只支持 :deep()，旧的 /deep/ 规则会被整条丢弃 */
:deep(.el-input__wrapper) {
  height: 1.1rem;
  font-size: 0.25rem;
}

:deep(.el-input__inner) {
  font-size: 0.25rem;
  height: 1.1rem;
  line-height: 1.1rem;
}

:deep(.van-list__finished-text) {
  height: 1.5rem;
  font-size: 0.34rem;
}

:deep(.el-select-dropdown__item) {
  height: 1.2rem !important;
}
</style>
