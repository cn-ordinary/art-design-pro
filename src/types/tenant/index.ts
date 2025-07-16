import { type BaseRequestParams } from '@/utils/table/tableUtils'

export interface QueryTenPackageReq extends BaseRequestParams {
  packageName: string
}

export interface QueryTenPackageRes {
  accessToken: string
  accountId: string
  accountName: string
  nickname: string
  avatar: string
  email: string
  mobile: string
}

export interface QueryTenantRes {
  tenantId: string
  tenantNumber: string
  tenantName: string
  contactPerson: string
  contactPhone: string
  tenantLogoId: string
  remark: string
  tenantStatus: number
  createTime: string
}
