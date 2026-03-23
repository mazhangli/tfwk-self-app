// src/components/Confirm/index.js
import { Close, Open } from '@/utils/loading';
import { createVNode, render } from 'vue';
import CapinfoBarcode from './Capinfo.QR.vue';
function Confirm({}) {
  return new Promise((resolve, reject) => {
    const messageVNode = createVNode(CapinfoBarcode, {
      onConfirm: () => {
        render(null, divContainer);
        divContainer.remove;
        resolve(true);
      },
      onCancel: () => {
        render(null, divContainer);
        divContainer.remove;
        reject(new Error());
      },
    });

    // 将自己封装的组件生成一个虚拟dom
    // 动态生成一个容器
    const divContainer = document.createElement('div');
    divContainer.style.top = '0px';
    divContainer.style.left = '0px';
    divContainer.style.position = 'absolute';
    divContainer.style.zIndex = '1000';
    divContainer.className = 'content ';
    // 添加到容器中
    render(messageVNode, divContainer); //将虚拟的dom变为真正的dom
    var el = document.getElementById('nucleicinvoking');
    if (el) {
      el.appendChild(divContainer);
    } else {
      document.body.appendChild(divContainer);
    }
    divContainer.focus();
    // // 60s后自动删除dom
    // setTimeout(() => {
    //   Open('');
    //   render(null, divContainer);
    //   Close();
    // }, 6000);
  });
}

export default Confirm;
