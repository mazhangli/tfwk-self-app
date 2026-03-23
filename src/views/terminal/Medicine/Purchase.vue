<template>
  <patient-container>
    <template v-slot:default>
      <payment-prescription />
    </template>
    <template v-slot:stepper>
      <app-stepper :active="0" :steps="steps" />
    </template>
  </patient-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import PatientContainer from '@/views/terminal/Container/PatientContainer.vue';
import PaymentPrescription from '@/views/terminal/Payment/Prescription/Prescription.vue';
import AppStepper from '@/components/Steps/Stepper.vue';
export default defineComponent({
  name: 'Purchase',
  props: {},
  components: { PatientContainer, PaymentPrescription, AppStepper },
  setup() {
    const steps = [
      { id: 1, name: '待缴费处方信息', remark: '' },
      { id: 2, name: '医师服务费分解', remark: '' },
      { id: 3, name: '处方预分解信息', remark: '' },
    ];
    return { steps };
  },
});
</script>

<style lang="less" scoped>
</style>