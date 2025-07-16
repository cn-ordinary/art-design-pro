import request from '@/utils/http'
import { ServiceApiEnum } from '@/enums/service-api'
import type { CaptchaRes, AccountLoginRes, AccountLoginReq } from '@/types'

export class AuthService {
  // 获取验证码
  static fetchCaptcha() {
    return request.post<CaptchaRes>({
      url: `${ServiceApiEnum.SYSTEM}/captcha/fetch-login-captcha`
    })
  }

  // 账号密码登录
  static accountLogin(params: AccountLoginReq) {
    return request.post<AccountLoginRes>({
      url: `${ServiceApiEnum.SYSTEM}/sso/account-login`,
      params
    })
  }
}
