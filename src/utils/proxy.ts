type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

const reg = /^https:\/\//;

/**
 * Generate proxy
 * @param list
 */
export function createProxy(list: ProxyList = []) {
  const ret: any = {};
  console.log(list);
  for (const [prefix, target] of list) {
    const isHttps = reg.test(target);
    console.log(prefix);
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      pathRewrite: {
        rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
      },
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}
