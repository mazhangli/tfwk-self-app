<template>
  <div class="content flex-c">
    <div class="content__pack flex-center">
      <div class="content flex-r-4">
        <div class="line flex-r-s">
          <div class="flex-r">
            <van-icon name="contact" color="#1989fa" size="0.7rem" />
            <p class="font-l"> {{ patient.patname }}</p>
          </div>
          <div class="flex-r">
            <van-icon name="idcard" color="#1989fa" size="0.7rem" />
            <p class="font-l" :style="{ float: 'right' }"> 身份证号:{{ patient.idcard }}</p>
          </div>
        </div>
        <div :style="{ width: '82%', height: 'calc(100% - 1.2rem)' }">
          <picker-row :finished="true" line-height="0.9rem">
            <div class="title font-m">流行病学史调查表</div>
            <p class="font-m forminfo">
              重要提示：为进一步做好新型冠状病毒感染的肺炎防控工作，保障您和医护人员的安全，请您认真填写流调表，如隐瞒事实造成疫情扩散，将依照《中华人民共和国传染病防治法》规定：隐瞒疫区旅游史或接触史者要承担相应法律责任，谢谢您的合作！
            </p>
            <van-cell size="large" v-for="(item, index) in list" :key="index">
              <template #icon>
                <van-icon name="star" class="search-icon" color="red" size="10px" />
              </template>
              <template #title>
                <p>{{ item.question }}</p>
              </template>
              <template #extra>
                <van-radio-group v-model="item.result" direction="horizontal">
                  <van-radio name="1" icon-size="0.6rem">是</van-radio>
                  <van-radio name="2" icon-size="0.6rem">否</van-radio>
                </van-radio-group>
              </template>
            </van-cell>
          </picker-row>
        </div>
      </div>
    </div>
    <div class="content__foot flex-r-3">
      <van-checkbox class="margin" v-model="checked" icon-size="1rem"
        >我承诺:我已详细阅读以上内容并理解，且以上内容如实填写。</van-checkbox
      >
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="success"
        icon-position="left"
        @click="onConfirm"
        :disabled="!checked"
        >确认提交
      </van-button>
      <van-button
        v-preventReClick="2000"
        class="btn-size-normal font-s btn__foot margin"
        type="primary"
        icon="revoke"
        icon-position="left"
        @click="onCancel"
        >取消
      </van-button>
      <timer-button :total="300" class="margin" ref="RefItimer" size="1.1rem" :finish="onCancel" />
    </div>
  </div>
</template>

<script lang="ts">
import { getStore, setStore } from '@/utils/cache/storage';
import PickerRow from '@/components/Picker/Picker.Row.vue';
import TimerButton from '@/components/terminal/button/TimerButton.vue';
import { defineComponent, nextTick, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import { Dialog } from 'vant';
import { appRouteEnum, pushAppHome, pushRouteWithParam } from '@/router/router';
import { covidSurvey } from '@/trans/server/his/other';
import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'Survey',
  props: {},
  emits: [],
  components: { PickerRow, TimerButton },
  setup(props, ctx) {
    const state = reactive({
      patient: null as any,
      list: [
        { question: '您近7天内，是否有过发热（体温≥37.3℃）？', result: '2' },
        {
          question:
            '您近7天内，是否有发热、鼻塞、流涕、干咳、乏力、肌痛、咽痛、腹泻、味觉异常、嗅觉减退、结膜炎等11类症状？',
          result: '2',
        },
        {
          question:
            '您7天内，是否有国内外中高风险地区及有陆路边境口岸所在县旅居史？或您是否到访过新冠病毒感染者风险点位？',
          result: '2',
        },
        { question: '您近10天内，您及同住人员是否有境外旅居史？', result: '2' },
        { question: '您近7天内，是否有新冠肺炎病例报告社区的旅住史？', result: '2' },
        { question: '您近7天内，是否接触过新冠肺炎感染者（核酸检测阳性者）？', result: '2' },
        {
          question:
            '您近7天内，所在小范围如家庭、办公室、学校班级等场所,是否出现2例及以上发热或呼吸道症状的病例？',
          result: '2',
        },
        {
          question:
            '您或家人、同事是否从事高风险职业（接诊发热或感染性疾病的医务人员，口岸，冷链，隔离场所，农贸市场等)？',
          result: '2',
        },
        {
          question:
            '您和家属是否因被判定为新冠肺炎病例的密接、次密接等，被要求集中或居家隔离（含社区封控、管控状态等）？',
          result: '2',
        },
      ],
      iconp: null as any,
      checked: false,
      routerParam: null as any,
    });
    onBeforeMount(() => {
      /*路由*/
      const route = useRoute();
      state.routerParam = route.query;
      state.iconp = require('@/assets/svg/patient.svg');
      state.patient = getStore('history');
    });
    const onConfirm = async function () {
      if (state.checked == true) {
        console.log('校验');
        let err = 'false';
        state.list.forEach((element) => {
          if (element.result != '2') {
            err = 'true';
          }
        });
        if (err === 'true') {
          Dialog.confirm({
            title: '提示',
            message:
              '因疫情风险管控措施,请您不要使用自助机办理业务,请前往发热门诊就诊\r\n确认后返回首页',
            closeOnPopstate: true,
            className: 'mat-vant__dialog',
            theme: 'round-button',
          }).then(() => {
            onCancel();
          });
        } else {
          //上报
          await covidSurvey(state.list);
          state.patient.isHasSurvey = true;
          setStore('history', state.patient);
          pushRouteWithParam(appRouteEnum.Register, state.routerParam);
        }
      }
    };
    const onCancel = async function () {
      Dialog.close();
      await pushAppHome();
    };
    return { ...toRefs(state), onConfirm, onCancel };
  },
});
</script>

<style lang="less" scoped>
.content__pack_scroll {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}

.line {
  margin-left: 10%;
  margin-right: 10%;
  width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
}

.line2 {
  margin-left: 10%;
  margin-right: 10%;
  width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
}

.title {
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  color: #fff;
  font-weight: bold;
  background: #007aff;
  background: linear-gradient(120deg, #0350ca, #2a8fff);
  text-align: center;
  vertical-align: middle;
  border-bottom: 4px solid #0051a7;
  line-break: strict;
  border-radius: 1em;
}

.search-icon {
  font-size: 0.5rem;
  line-height: inherit;
}

.input-info {
  padding: 0.1rem;
}

.forminfo {
  width: 100%;
  color: #d48404;
  margin: 0.1rem;
}

.margin {
  margin-left: 0.2rem;
}

/deep/.van-cell__title {
  width: 60%;
}

// /deep/.van-checkbox__label{
//     color: red;
// }

/deep/.van-checkbox__label {
  font-family: 'Audiowide';
  text-align: center;
  color: red;
  font-size: 0.38rem;
  // -webkit-transition: all 1.5s ease;
  //         transition: all 1.5s ease;
  -webkit-animation: Glow 1.5s ease infinite alternate;
  animation: Glow 1.5s ease infinite alternate;
}

// /deep/.van-checkbox__label:hover {
//     color: red;
//     -webkit-animation: Glow 1.5s ease infinite alternate;
//             animation: Glow 1.5s ease infinite alternate;

// }
@-webkit-keyframes Glow {
  from {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #00a67c, 0 0 70px #00a67c,
      0 0 80px #00a67c, 0 0 100px #00a67c, 0 0 150px #00a67c;
  }

  to {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #00a67c, 0 0 35px #00a67c,
      0 0 40px #00a67c, 0 0 50px #00a67c, 0 0 75px #00a67c;
  }
}

@keyframes Glow {
  from {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #00a67c, 0 0 70px #00a67c,
      0 0 80px #00a67c, 0 0 100px #00a67c, 0 0 150px #00a67c;
  }

  to {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #00a67c, 0 0 35px #00a67c,
      0 0 40px #00a67c, 0 0 50px #00a67c, 0 0 75px #00a67c;
  }
}
</style>
