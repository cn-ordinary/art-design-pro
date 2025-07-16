import { AccountStatusEnum, AccountTypeEnum, GENDER_ENUM } from '@/enums/system/account'

/**
 * 用户详情
 */
export interface QueryAccountDetails extends BaseAccount {
  accessToken: string
  accountStatus: AccountStatusEnum
  accountType: AccountTypeEnum
}

export interface BaseAccount {
  accountId: string
  accountName: string
  nickname: string
  avatar: string
  email: string
  mobile: string
  gender: GENDER_ENUM
  preTenantId: string
}
