<template>
  <div class="content">
    <!-- 中间内容区：展示核心业务数据，对应C# Item类属性名 -->
    <div class="content__pack flex-r-2">
      <!-- 顶部导航：展示类型（对应C#的type属性） -->
      <div class="content__nav flex-r">
        <span class="mat_fill__header font-l blod">{{ item.type || '未知类型' }}</span>
      </div>
      <div
        class="flex-c-r"
        :style="{ 'margin-top': '0.5rem', width: '100%', height: 'calc(100% - 2rem)' }"
      >
        <van-form label-width="150" class="item-form">
          <van-row gutter="16">
            <van-col span="8">
              <van-form-item label="项目编码">
                <van-field
                  label-class="item_label"
                  label="项目编码:"
                  v-model="item.itemCode"
                  readonly
                  placeholder="无编码"
                />
              </van-form-item>
            </van-col>
            <van-col span="16">
              <van-form-item label="项目名称">
                <van-field
                  label="项目名称:"
                  v-model="item.itemName"
                  readonly
                  placeholder="无名称"
                />
              </van-form-item>
            </van-col>
          </van-row>

          <van-row gutter="16">
            <van-col span="8">
              <van-form-item label="项目单位">
                <van-field
                  label="项目单位:"
                  v-model="item.itemUnit"
                  readonly
                  placeholder="无单位"
                />
              </van-form-item>
            </van-col>
            <van-col span="8">
              <van-form-item label="项目规格">
                <van-field
                  label="项目规格:"
                  v-model="item.itemSpec"
                  readonly
                  placeholder="无规格"
                />
              </van-form-item>
            </van-col>
            <van-col span="8" v-if="item.type === '药品'">
              <van-form-item label="剂型/类别">
                <van-field label="药品剂型:" v-model="item.norms" readonly placeholder="无信息" />
              </van-form-item>
            </van-col>
          </van-row>

          <van-row gutter="16">
            <van-col span="8">
              <van-form-item label="拼音编码">
                <van-field
                  label="拼音编码:"
                  v-model="item.pinyinCode"
                  readonly
                  placeholder="无拼音码"
                />
              </van-form-item>
            </van-col>
            <van-col span="8">
              <van-form-item label="支付类别">
                <van-field
                  label="支付类别:"
                  v-model="item.payClass"
                  readonly
                  placeholder="无支付类别"
                />
              </van-form-item>
            </van-col>
            <van-col span="8">
              <van-form-item label="项目价格">
                <van-field
                  label="项目价格:"
                  v-model="item.itemPrice"
                  readonly
                  placeholder="0.00"
                  suffix="元"
                />
              </van-form-item>
            </van-col>
          </van-row>

          <!-- 第五行：生产厂家（sccj）和批准文号（approval_number） -->
          <van-row gutter="16">
            <van-col span="12" v-if="item.type === '药品'">
              <van-form-item label="产地">
                <van-field label="产地:" v-model="item.Origin" readonly placeholder="无产地信息" />
              </van-form-item>
            </van-col>
            <van-col span="12">
              <van-form-item label="批准文号">
                <van-field
                  label="批准文号:"
                  v-model="item.approval_number"
                  readonly
                  placeholder="无批准文号"
                />
              </van-form-item>
            </van-col>
          </van-row>

          <!-- 第六行：产地（Origin） -->
          <van-row gutter="16">
            <van-col span="24" v-if="item.type === '药品'">
              <van-form-item label="生产厂家">
                <van-field
                  label="生产厂家:"
                  v-model="item.sccj"
                  readonly
                  placeholder="无生产厂家"
                />
              </van-form-item>
            </van-col>
          </van-row>
          <van-row gutter="16">
            <van-col span="24">
              <van-form-item label="医保说明">
                <van-field
                  label="医保说明:"
                  v-model="item.insurancePrompt"
                  readonly
                  placeholder="无医保说明信息"
                />
              </van-form-item>
            </van-col>
          </van-row>

          <van-row gutter="16">
            <van-col span="24">
              <van-form-item label="医院说明">
                <van-field
                  label="医院说明:"
                  v-model="item.hospitalPrompt"
                  readonly
                  placeholder="无医院说明信息"
                />
              </van-form-item>
            </van-col>
          </van-row>

          <van-row gutter="16">
            <van-col span="24">
              <van-form-item label="排除内容">
                <van-field
                  label="排除内容:"
                  v-model="item.excluded_content"
                  readonly
                  placeholder="无排除内容信息"
                />
              </van-form-item>
            </van-col>
          </van-row>
        </van-form>
      </div>
    </div>

    <!-- 底部区域：返回按钮 -->
    <div class="content__foot flex-r-2">
      <van-button
        type="primary"
        size="large"
        icon="revoke"
        block
        round
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        @click="onCancel"
        >返回上一级</van-button
      >
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue';

  // 定义与C# Item类对应的TS接口，保证类型一致性
  interface Item {
    type: string;
    itemCode: string;
    itemName: string;
    itemUnit: string;
    itemPrice: string;
    itemSpec: string;
    norms: string;
    pinyinCode: string;
    payClass: string;
    sccj: string;
    approval_number: string;
    excluded_content: string;
    Origin: string;
    insurancePrompt: string;
    hospitalPrompt: string;
  }

  export default defineComponent({
    name: 'BasicItem',
    props: {
      // 严格对应C# Item类的属性结构，定义强类型
      item: {
        type: Object as () => Item,
        required: true,
        default: () => ({
          type: '',
          itemCode: '',
          itemName: '',
          itemUnit: '',
          itemPrice: '',
          itemSpec: '',
          norms: '',
          pinyinCode: '',
          payClass: '',
          sccj: '',
          approval_number: '',
          excluded_content: '',
          Origin: '',
          insurancePrompt: '',
          hospitalPrompt: '',
        }),
      },
    },
    emits: ['back'],
    components: {},
    setup(props, ctx) {
      const state = reactive({});

      onMounted(() => {});

      // 格式化价格，兼容字符串类型的价格数据
      const formatPrice = (price: string | undefined) => {
        if (!price || price.trim() === '' || isNaN(Number(price))) {
          return '0.00';
        }
        return Number(price).toFixed(2);
      };

      // 返回上一级方法
      const onCancel = function () {
        if (ctx.emit) {
          ctx.emit('back');
        }
      };

      return {
        ...toRefs(state),
        formatPrice,
        onCancel,
      };
    },
  });
</script>

<style lang="less" scoped>
  /deep/ .van-field {
    .van-field__label {
      font-weight: 400;
    }
    .van-field__value {
      font-weight: 800;
    }
  }
</style>
