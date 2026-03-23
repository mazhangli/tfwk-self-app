<template>
<patient-container>
    <template v-slot:default>
        <schedule-order @onRegist="onRegist" v-if="active === 0" />
        <register-end :printContent="registOrder.printContent" v-if="active === 1" />
    </template>
    <template v-slot:stepper>
        <app-stepper :active="0" :steps="steps" />
    </template>
</patient-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import PatientContainer from '@/views/terminal/Container/PatientContainer.vue';
import ScheduleOrder from './Schedule.order.vue';
import RegisterEnd from '@/views/terminal/Regist/Register.end.vue';
import AppStepper from '@/components/Steps/Stepper.vue';
import { registerSchedule } from '@/trans/server';
import { Close, Open } from '@/utils/loading';
export default defineComponent({
    name: 'Scheduling',
    props: {},
    components: { PatientContainer, AppStepper, ScheduleOrder, RegisterEnd },
    setup(props) {
        const steps = [
            { id: 0, name: '选择号源', remark: '' },
            { id: 1, name: '打印凭证', remark: '' },
        ];
        const state = reactive({
            branch: null as any,
            schedule: null as any,
            registOrder: null as any,
            active: 0,
        });
        const onReturn = function (val: any) {
            console.log('onReturn');
            if (state.active > 0) state.active--;
        };
        const onRegist = async function (schedule: any) {
            //   state.registOrder = await registerSchedule(1, schedule.id);
            state.registOrder = await registerSchedule(schedule.id);
            console.log(state.registOrder);
            if (state.registOrder) {
                state.active = 1;
            }
            Close();
        };
        return { ...toRefs(state), steps, onReturn, onRegist };
    },
});
</script>

<style lang="less" scoped>
</style>
