/**
 * 付款码类型枚举
 */
export enum PayCodeType {
  WECHAT = 'wechat', // 微信付款码
  ALIPAY = 'alipay', // 支付宝付款码
  INVALID = 'invalid' // 非法付款码
}

/**
 * 付款码校验结果接口
 */
export interface PayCodeCheckResult {
  type: PayCodeType;
  message: string; // 提示信息
  isValid: boolean; // 是否为合法格式
}

/**
 * 微信/支付宝付款码格式校验
 * @param payCode 付款码数字串（二维码解码后的内容）
 * @returns 校验结果
 */
export function validatePayCode(payCode: string): PayCodeCheckResult {
  // 1. 前置过滤：去除空格、非数字字符
  const pureCode = payCode.trim().replace(/\D/g, '');
  const codeLen = pureCode.length;

  // 2. 排除空值/全非数字
  if (!pureCode) {
    return {
      type: PayCodeType.INVALID,
      message: '付款码不能为空',
      isValid: false
    };
  }

  // 3. 排除测试码（微信/支付宝官方测试码）
  const testCodes = ['100000000000000000', '280000000000000000'];
  if (testCodes.includes(pureCode)) {
    return {
      type: PayCodeType.INVALID,
      message: '禁止使用测试付款码',
      isValid: false
    };
  }

  // 4. 核心格式校验
  // 微信：18/24位 + 前缀10-15
  if ((codeLen === 18 || codeLen === 24) && /^1[0-5]/.test(pureCode)) {
    return {
      type: PayCodeType.WECHAT,
      message: '微信付款码格式合法',
      isValid: true
    };
  }

  // 支付宝：18位 + 前缀28
  if (codeLen === 18 && /^28/.test(pureCode)) {
    return {
      type: PayCodeType.ALIPAY,
      message: '支付宝付款码格式合法',
      isValid: true
    };
  }

  // 格式不匹配
  return {
    type: PayCodeType.INVALID,
    message: '付款码格式错误（非微信/支付宝有效付款码）',
    isValid: false
  };
}


/**
 * 仅区分付款码类型（无额外提示）
 * @param payCode 付款码数字串
 * @returns 付款码类型
 */
export function getPayCodeType(payCode: string): PayCodeType {
  const pureCode = payCode.trim().replace(/\D/g, '');
  const codeLen = pureCode.length;

  // 微信：18/24位 + 前缀10-15
  if ((codeLen === 18 || codeLen === 24) && /^1[0-5]/.test(pureCode)) {
    return PayCodeType.WECHAT;
  }

  // 支付宝：18位 + 前缀28
  if (codeLen === 18 && /^28/.test(pureCode)) {
    return PayCodeType.ALIPAY;
  }

  // 非法
  return PayCodeType.INVALID;
}