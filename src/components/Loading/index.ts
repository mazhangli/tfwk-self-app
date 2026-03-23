import './@/indicator';
import { withInstall } from '../util';

import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
export const Loading = createAsyncComponent(() => import('./@/index.vue'));

withInstall(Loading);
export { useLoading } from './@/useLoading';
export { createLoading } from './@/createLoading';
