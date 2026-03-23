/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import type { App, Directive, DirectiveBinding } from 'vue';

function isAuth(el: Element, binding: any) {
  const value = binding.value;
  if (!value) return;
  el.parentNode?.removeChild(el);
}


const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding);
};

const updated = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding);
};

const authDirective: Directive = {
  mounted,
  updated,
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
