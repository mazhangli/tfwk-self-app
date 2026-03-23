import { ElLoading } from 'element-plus/lib/components';
var loadingInstance: any = null;

export function Open(text?: string) {
  if (loadingInstance) {
    loadingInstance.close();
  }
  loadingInstance = ElLoading.service({
    fullscreen: false,
    body: true,
    target: '#Home',
    text: text || '业务处理中,请耐心等待...',
    background: 'rgba(0, 0, 0, 0.7)',
    spinner: `
    <svg t="1703747926474" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17754" width="50" height="50"><path d="M512 448c-57.152 0-192-149.952-192-256a192 192 0 0 1 384 0c0 106.048-134.848 256-192 256z m64 64c0-57.152 149.952-192 256-192a192 192 0 0 1 0 384c-106.048 0-256-134.848-256-192z m-128 0c0 57.152-149.952 192-256 192a192 192 0 0 1 0-384c106.048 0 256 134.848 256 192z m64 64c57.152 0 192 149.952 192 256a192 192 0 0 1-384 0c0-106.048 134.848-256 192-256z" fill="#1296db" p-id="17755"></path></svg>
    `,
  }); //定义loading变量
  ////此处不能定时关闭 否则有些进程无法遮盖
  // setTimeout(() => {
  //   loadingInstance.close()
  // }, 10000)
}
export function Close() {
  if (loadingInstance) {
    loadingInstance.close();
  }
}
