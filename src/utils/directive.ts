import type { Directive, DirectiveBinding } from 'vue';
// export default function directive(app: any) {
//     directive('preventReClick', {
//         inserted(el: HTMLButtonElement, binding: DirectiveBinding<any>) {
//             el.addEventListener('click', () => {
//                 if (!el.disabled) {
//                     el.disabled = true
//                     console.log('2s内无法点击');
//                     setTimeout(() => {
//                         el.disabled = false;
//                     }, binding.value || 2000)
//                 }
//             })
//         }
//     })
// }


const preventReClick: Directive = {
    beforeMount(el: HTMLButtonElement, binding: DirectiveBinding<any>) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false;
                }, binding.value || 2000)
            }
        })
    },
};

export default preventReClick;