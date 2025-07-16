import { LoginTypeEnum } from '@/enums/auth'

/**
 * 获取验证码响应
 */
export interface CaptchaRes {
  /** 验证码ID */
  captchaId: string
  /** 验证码Base64图片 */
  captchaBase64Image: string
  /** 验证码过期时间（秒） */
  expireSeconds: number
  /** 验证码文本（仅开发环境使用） */
  captchaCode?: string
}

/**
 * 登录参数
 */
export interface AccountLoginReq {
  /** 登录类型 */
  loginType: LoginTypeEnum
  /** 登录账号 */
  username: string
  /** 登录密码 */
  password?: string
  /** 验证码ID */
  captchaId?: string
  /** 验证码文本 */
  captchaCode?: string
}

/**
 * 登录响应
 */
export interface AccountLoginRes {
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken: string
}
