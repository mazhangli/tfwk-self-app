<!-- 胶片报告缴费：选择医嘱 -> 选择胶片项目 -> 确认缴费 -->

<template>
  <patient-container>
    <template v-slot:default>
      <advice-step
        v-if="active === 0"
        @select-advice="onSelectAdvice"
        @next="goItem"
      />
      <item-step
        v-else-if="active === 1"
        :advice-id="selectedAdvice ? selectedAdvice.itemId : ''"
        :advice-info="selectedAdvice"
        @select-item="onSelectItem"
        @prev="goAdvice"
        @next="goConfirm"
      />
      <confirm-step
        v-else
        :selected-advice="selectedAdvice"
        :selected-item="selectedItem"
        :submitting="submitting"
        @prev="goItem"
        @submit="handleSubmit"
      />
    </template>
    <template v-slot:stepper>
      <mat-steps :active="active" :steps="steps" />
    </template>
  </patient-container>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { Toast } from 'vant';
  import PatientContainer from '@/views/terminal/Container/PatientContainer.vue';
  import MatSteps from '@/components/Steps/MatSteps.vue';
  import AdviceStep from './components/Advice.vue';
  import ItemStep from './components/Item.vue';
  import ConfirmStep from './components/Confirm.vue';
  import { createFilmAdvice } from '@/trans/server/his/film';
  import { getStore } from '@/utils/cache/storage';
  import { appRouteEnum, pushRouteWithoutParam } from '@/router/router';
  import { Close, Open } from '@/utils/loading';
  export default defineComponent({
    name: 'FilmPay',
    props: {},
    components: { PatientContainer, MatSteps, AdviceStep, ItemStep, ConfirmStep },
    setup() {
      const state = reactive({
        steps: [
          { id: 0, name: '选择医嘱', remark: '' },
          { id: 1, name: '选择胶片项目', remark: '' },
          { id: 2, name: '确认缴费', remark: '' },
        ],
        active: 0,
        selectedAdvice: null as any,
        selectedItem: null as any,
        submitting: false,
      });

      // 子组件选择回调
      const onSelectAdvice = function (advice: any) {
        state.selectedAdvice = advice;
      };
      const onSelectItem = function (item: any) {
        state.selectedItem = item;
      };

      // 步骤跳转
      const goAdvice = function () {
        state.active = 0;
      };
      const goItem = function () {
        if (!state.selectedAdvice) {
          Toast('请先选择医嘱');
          return;
        }
        state.active = 1;
      };
      const goConfirm = function () {
        if (!state.selectedItem) {
          Toast('请先选择胶片项目');
          return;
        }
        state.active = 2;
      };

      // 提交缴费
      const handleSubmit = async function () {
        if (!state.selectedAdvice || !state.selectedItem) {
          Toast('请完善信息');
          return;
        }
        console.log(state.selectedAdvice);
        const patientId = getStore('history')?.patientid || '';
        const empId = getStore('system')?.empId || '';
        state.submitting = true;
        Open('正在提交,请稍等...');
        try {
          const result = await createFilmAdvice({
            patientId: patientId,
            adviceId: state.selectedAdvice.adviceId,
            pacsItemId: state.selectedItem.id,
            operator: empId,
          });
          if (result) {
            Toast.success('缴费成功');
            // 缴费成功后跳转到缴费路由
            pushRouteWithoutParam(appRouteEnum.Payment);
          } else {
            Toast.fail('缴费失败');
          }
        } catch (error: any) {
          Toast.fail(error?.message || '提交失败,请重试');
        } finally {
          state.submitting = false;
          Close();
        }
      };

      return {
        ...toRefs(state),
        onSelectAdvice,
        onSelectItem,
        goAdvice,
        goItem,
        goConfirm,
        handleSubmit,
      };
    },
  });
</script>

<style lang="less" scoped></style>