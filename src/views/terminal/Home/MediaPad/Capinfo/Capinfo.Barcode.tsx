import { login$only } from '@/trans';
import { getStore } from '@/utils/cache/storage';
import { Close, Open } from '@/utils/loading';
import { createVNode, defineComponent, onMounted, reactive, ref, render, Transition } from 'vue';
import { useEventListener } from '@vant/use';

// ============================================================
// 图标/动画解析（与 AppMenu、Medium 保持一致）
// 支持三种来源：
//   1. 远程 URL：http://、https://、//
//   2. 绝对路径：/uploads/xxx.gif（后端返回的地址）
//   3. 本地文件：相对于 baseDir 的本地打包资源
// ============================================================
const resolveIcon = (ic: string | undefined | null, baseDir: string): string => {
  if (!ic) return '';
  if (/^(https?:)?\/\//.test(ic) || ic.startsWith('/')) return ic;
  try {
    return require(baseDir + ic);
  } catch (e) {
    return ic;
  }
};

const createComponent = () => {
  const data = reactive({
    // 控制是否显示
    visible: true,
    idnum: '',
  });
  const medium = getStore('medias').find((value: any, index: any) => {
    return value.mediacode === 'MEDICARE.BARCODE';
  });
  const caption = resolveIcon(medium.caption, '@/assets/img/gif/');
  const div = document.createElement('div');
  const destroySelf = () => {
    document.body.removeChild(vm.el as HTMLElement);
    render(null, div);
  };
  const onLoading = async function (ctx:any) {
    //formidcard.value.validate();
    const context = data.idnum.replace(/\n|\r/g, '');
    console.log(context);
    if (context) {
      Open('');
      var longined = (await login$only(
        medium.mediumcode as string,
        0,
        context
      )) as boolean;
      if (longined === true) {
        console.log('当前患者登录成功', '登录方式', medium.mediumcode);
        if (ctx) ctx.emit('onCallend', true);
      }
      Close();
    }
    data.idnum = '';
  };
  const loadingComponent = defineComponent({
    setup() {
      return { data, destroySelf };
    },
    render() {
      return (
        <Transition name="fade" onAfterLeave={destroySelf}>
          {data.visible ? (
            <div class={['content', 'flex-c', 'divtip']} style={{ zIndex: 9999 }}>
              <p class={['title__sub', 'font-m', 'blod']}>{medium.title}</p>
              {/* <van-image
                width="90%"
                height="calc(100% - 4rem)"
                radius="1em"
                fit="contain"
                position="center"
                src={caption}
              /> */}
              <div
                class={['flex-c-c']}
                style={{ width: '100%', paddingLeft: '10%', paddingRight: '10%' }}
              >
                <span
                  style={{ width: '100%', paddingBottom: '0.3rem', paddingTop: '0.3rem' }}
                >
                    {/* <van-form ref="formidcard">
                        <van-field
                            id="scannerfield"
                            v-model={data.idnum}
                            format-trigger="onBlur"
                            center = {true}
                            placeholder="请扫描二维码"
                            rules={[{ required: true, message: '请扫描二维码' }]}
                            class="field"
                        >
                            
                        </van-field>
                    </van-form> */}
                </span>
              </div>
              {/* <van-image
              width="90%"
              height="calc(100% - 1rem)"
              radius="1em"
              fit="contain"
              position="center"
              src={ caption }
            />              */}
            </div>
          ) : null}
        </Transition>
      );
    },
  });
  const vm = createVNode(loadingComponent);
  render(vm, div);
  const open = () => {
    // data.medium = getStore('medias').find((value: any, index: any) => {
    //     return value.mediacode === 'MEDICARE.BARCODE';
    //   });
    // 已经是显示状态就不需要走下面了
    if (data.visible) {
      return;
    }
    // 添加上去
    document.body.appendChild(vm.el as HTMLElement);
    // 显示
    data.visible = true;
  };
  const close = () => {
    if (!data.visible) {
      return;
    }
    data.visible = false;
  };
  
  useEventListener(
    'click',
    () => {
      Container.value.focus();
    },
    { target: document.body }
  );
  const Container = ref(null) as any;
  onMounted(() => {
    Container.value = document.getElementById('scannerfield');
    console.dir(Container.value);
  });
  return {
    open,
    close,
  };
};
export default createComponent;