import type { ProjectConfig, GlobConfig, GlobEnvConfig } from '@/types/config';

import getProjectSetting from '@/settings/projectSetting';

import { getShortName } from '@/utils/utils';
import { warn } from '@/utils/log';
import { getGlobEnvConfig, isDevMode } from '@/utils/env';

const reg = /[a-zA-Z\_]*/;

const ENV_NAME = getShortName(process.env);
const ENV = ((isDevMode()
  ? getGlobEnvConfig()
  : window[ENV_NAME as any]) as unknown) as GlobEnvConfig;

const {
  GLOB_APP_TITLE,
  GLOB_API_URL,
  GLOB_APP_SHORT_NAME,
  GLOB_API_URL_PREFIX
} = ENV;

if (!reg.test(GLOB_APP_SHORT_NAME)) {
  warn(
    `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
  );
}

export const useGlobSetting = (): Readonly<GlobConfig> => {
  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: GLOB_APP_TITLE,
    apiUrl: GLOB_API_URL,
    shortName: GLOB_APP_SHORT_NAME,
    urlPrefix: GLOB_API_URL_PREFIX
  };
  return glob as Readonly<GlobConfig>;
};

export const useProjectSetting = (): ProjectConfig => {
  // TODO computed
  return getProjectSetting;
};
