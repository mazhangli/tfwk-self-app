<template>
  <div class="appContainer flexbox flexbox-center flexbox-row">
    <app-patient class="patient" :type="type" />
    <span style="height: 95%; vertical-align: middle;">
      <!-- <el-divider
        style="background-image:linear-gradient(to bottom, rgba(27,122,186,0), rgba(27,122,186,1),rgba(27,122,186,0));width: 1px;"
        direction="vertical" dashed></el-divider> -->
      <el-divider
        style="background-image: linear-gradient(to bottom, rgba(27,122,186,0), rgba(27,122,186,1),rgba(27,122,186,0)); width: 1px; height: 95%;"
        dashed></el-divider>
    </span>
    <div class="slot">
      <div class="slot-stepper">
        <slot name="stepper" />
      </div>
      <div class="slot-container">
        <slot name="default" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppPatient from '@/views/terminal/Patient/AppPatient.vue';
export default defineComponent({
  name: 'PatientContainer',
  props: {
    type:{
      type: String,
      default: 'mz',
    }
  },
  components: { AppPatient },
  setup(props) {
    return { ...props };
  },
});
</script>

<style lang="less"  scoped>
.appContainer {
  width: 100%;
  height: 100%;
  position: relative;
}

.patient {
  width: 26%;
  height: 100%;
  overflow: hidden;
}

.slot {
  width: ~'calc(74%)';
  height: 100%;
  padding: 0 1% 0 1%;
  border-radius: 10px;
  color: #000000;

  //background: rgba(#fff, 0.6);
  //border: #fcfcfc 1px solid;
  &-stepper {
    width: 100%;
    height: 1.2rem;
    //padding: 2% 0 2% 0;
  }

  &-container {
    height: ~'calc(100% - 1.2rem)';
    padding: 1% 0;
    width: 100%;
  }
}

/deep/ .el-divider--vertical {
  width: 2px;
  height: 100%;
}
</style>