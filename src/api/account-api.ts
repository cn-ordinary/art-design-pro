import request from '@/utils/http'
import type { QueryAccountDetails } from '@/types'
import { ServiceApiEnum } from '@/enums/service-api'

export class AccountService {
  // 获取用户信息
  static getAccountDetails(accountId: string | undefined) {
    return request.post<QueryAccountDetails>({
      url: `${ServiceApiEnum.SYSTEM}/account/fetch-account-details`,
      params: { accountId }
    })
  }
}
