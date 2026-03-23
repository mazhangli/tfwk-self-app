<template>
  <div class="patientpad flexbox justify-start flexbox-col">
    <el-form>
      <el-form-item label="姓名" class="relabel">
        <span class="patientName font-xl bloder">{{ info.patname }}</span>
      </el-form-item>
      <el-form-item label="门诊号" class="relabel">
        <span class="font-m vertical">{{ info.historyid }}</span>
      </el-form-item>
      <el-form-item label="性别" class="relabel">
        <span class="font-m vertical">{{ info.sex }}</span>
      </el-form-item>
      <el-form-item label="出生日期" class="relabel">
        <span class="font-m vertical">{{ info.birthday }}</span>
      </el-form-item>
      <el-form-item label="身份证" class="relabel">
        <span class="font-m vertical">{{ identity }}</span>
      </el-form-item>
      <el-form-item label="登录卡号" class="relabel">
        <span class="font-m vertical">{{ info.patcard }}</span>
      </el-form-item>
      <el-form-item label="定点医院" class="relabel">
        <span class="font-m vertical">是定点医院</span>
      </el-form-item>
      <el-form-item label="红名单" class="relabel">
        <span class="font-m vertical">在红名单内</span>
      </el-form-item>
      <el-form-item label="账户余额" class="relabel">
        <span class="font-m vertical">{{ info.balance }}</span>
      </el-form-item>
    </el-form>
    <!-- <el-form>
      <el-form-item
        label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;:&nbsp;"
        class="relabel"
      >
        <span class="patientName font-xl blod">{{ info.patientname }}</span>
      </el-form-item>
      <el-form-item label="门&nbsp;&nbsp;诊&nbsp;&nbsp;号&nbsp;:&nbsp;" class="relabel">
        <span class="font-m vertical">{{ info.historyid }}</span>
      </el-form-item>
      <el-form-item
        label="性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别&nbsp;:&nbsp;"
        class="relabel"
      >
        <span class="font-m vertical">{{ info.sex }}</span>
      </el-form-item>
      <el-form-item label="出生日期&nbsp;:&nbsp;" class="relabel">
        <span class="font-m vertical">{{ info.birthday }}</span>
      </el-form-item>
      <el-form-item label="身&nbsp;&nbsp;份&nbsp;&nbsp;证&nbsp;:&nbsp;" class="relabel">
        <span class="font-m vertical">{{ identity }}</span>
      </el-form-item>
      <el-form-item label="登录卡号&nbsp;:&nbsp;" class="relabel">
        <span class="font-m vertical">{{ info.cardno }}</span>
      </el-form-item>
      <el-form-item label="定点医院&nbsp;:&nbsp;" class="relabel">
        <span class="font-m vertical">是</span>
      </el-form-item>
      <el-form-item label="红&nbsp;&nbsp;名&nbsp;&nbsp;单&nbsp;:&nbsp;" class="relabel">
        <span class="font-m vertical">是</span>
      </el-form-item>
      <el-form-item label="账户余额&nbsp;:&nbsp;" class="relabel">
        <span class="font-m vertical">{{ info.balance }}</span>
      </el-form-item>
    </el-form> -->
  </div>
</template>

<script lang="ts">
import { getStore } from '@/utils/cache/storage';
import { computed, defineComponent, onMounted, reactive, ref, toRef, toRefs } from 'vue';
export default defineComponent({
  name: 'AppPatient',
  props: {},
  components: {},
  setup() {
    const info = ref({ idcard: '' });
    const identity = ref('');
    const cardno = ref('');
    onMounted(() => {
      info.value = getStore('history');
      if (info.value.idcard && info.value.idcard.length > 10) {
        identity.value =
          info.value.idcard.substring(0, 3) +
          '***' +
          info.value.idcard.substring(info.value.idcard.length - 4);
      }
    });
    return { info, identity };
  },
});
</script>

<style lang="less" scoped>
.patientpad {
  padding: 0.3rem;
  padding-top: 1rem;
  overflow: hidden;
}

.patientName {
  overflow: hidden;
  vertical-align: baseline;
  //font-size: 0.7rem;
  overflow: hidden;
  font-style: italic;
  //text-shadow: 1px 1px 0px #212121;
  color: #5e5f61;
  //font-weight: 550;
}
.relabel /deep/ .el-form-item__label {
  margin-left: 0.15rem;
  width: 1.55rem;
  vertical-align: middle;
  text-align-last: justify;
  //重新定义的CSS属性
  font-size: 0.33rem;
  color: #333333;
  //text-shadow: 1px 0px 0px #333333;
}
.vertical {
  text-align: left;
  vertical-align: middle;
  color: #5e5f61;
  text-shadow: 1px 0px 0px #5e5f61;
}
/deep/ .el-form-item {
  margin-bottom: 0.2rem;
}
</style>