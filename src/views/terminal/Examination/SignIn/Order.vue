<template>
  <div class="content flex-c">
    <div class="content__pack flex-center">
      <p class="font-l">请浏览确认下列信息是否无误</p>
      <van-form :style="{ width: '80%' }" @submit="onSubmit">
        <van-cell-group inset v-if="loaded === true">
          <van-field readonly v-model="info.name" label="姓  名" size="large" label-width="40%" />
          <van-field
            readonly
            v-model="info.companyGroupName"
            name="预选的单位分组名称"
            label="预选的单位分组名称"
            label-width="40%"
          />
          <van-field
            v-model="info.companyname"
            readonly
            name="单位名称"
            label="单位名称"
            label-width="40%"
          />
          <van-field
            v-model="info.payType"
            readonly
            name="预选的付款类型"
            label="预选的付款类型"
            label-width="40%"
          />
          <van-field
            v-model="info.petype"
            readonly
            name="体检类型"
            label="体检类型 "
            label-width="40%"
          />
          <van-field
            v-model="info.regdate"
            readonly
            name="预约日期"
            label="预约日期"
            label-width="40%"
          />
          <van-field v-model="info.regnum" readonly name="号序" label="号序" label-width="40%" />
          <van-field
            v-model="info.timeslice"
            readonly
            name="预约时段"
            label="预约时段"
            label-width="40%"
          />
          <van-field
            v-model="info.tradeno"
            readonly
            name="微信订单流水号"
            label="微信订单流水号"
            label-width="40%"
          />
          <van-field
            v-model="info.tjId"
            readonly
            name="关联体检编号"
            label="关联体检编号"
            label-width="40%"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit"> 确认 </van-button>
        </div>
      </van-form>
    </div>
    <div class="content__foot flex-r-3" :style="{ padding: '0 10% 0' }">
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="wap-home"
        icon-position="left"
        @click="onQuit"
        >返回主页
      </van-button>
      <timer-button :total="90" class="margin" ref="RefItimer" size="1.1rem" :finish="onQuit" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
  import { findPesNotesPlan, preRationByPesNotesPlanId } from '@/trans/server/his/examination';
  import { speak } from '@/trans/driver/src/speech';
  import TimerButton from '@/components/terminal/button/TimerButton.vue';
  import { pushAppHome } from '@/router/router';
  import { Close, Open } from '@/utils/loading';
  export default defineComponent({
    name: 'ExaminationOrder',
    props: {},
    emits: ['budget', 'cancel'],
    components: { TimerButton },
    setup(props, ctx) {
      const state = reactive({
        info: null as any,
        loaded: false,
      });
      onBeforeMount(async () => {
        Open('正在获取体检中心数据,请稍后....');
        state.info = await findPesNotesPlan();
        Close();
        if (state.info) {
          console.log(state.info);
          speak('请核查基本信息无误后点击确认');
          state.loaded = true;
        } else {
          speak('通过身份证未查询到今日体检预约记录,即将返回首页');
          await onCancel();
        }
      });
      const onSubmit = async function () {
        console.log('用户提交表单', state.info.id);
        Open('正在计算费用,请稍后....');
        var data = await preRationByPesNotesPlanId(state.info.id);
        console.log(data);
        if (ctx) {
          ctx.emit('budget', data);
        }
        Close();
      };
      const onQuit = async function () {
        console.log('返回首页');
        await pushAppHome();
        Close();
      };
      const onCancel = async function(){
        if(ctx){ctx.emit('cancel');};
      };
      return { ...toRefs(state), onSubmit, onQuit, onCancel };
    },
  });
</script>

<style lang="less" scoped></style>
