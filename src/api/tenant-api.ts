import request from '@/utils/http'
import type { QueryTenPackageRes, QueryTenantPageRes, QueryTenantInfoRes } from '@/types'
import { ServiceApiEnum } from '@/enums/service-api'

export class TenantService {
  // 获取租户套餐列表信息
  static getTenPackageList(params: Api.Common.PaginatingSearchParams) {
    return request.post<QueryTenPackageRes>({
      url: `${ServiceApiEnum.SYSTEM}/package/fetch-package`,
      params
    })
  }

  // 获取租户列表
  static getTenantPage(params: Api.Common.PaginatingSearchParams) {
    return request.post<QueryTenantPageRes>({
      url: `${ServiceApiEnum.SYSTEM}/tenant/fetch-tenant-page`,
      params
    })
  }

  // 获取租户详情
  static getTenantInfo(tenantId: string | number) {
    return request.post<QueryTenantInfoRes>({
      url: `${ServiceApiEnum.SYSTEM}/tenant/fetch-tenant-details`,
      params: { id: tenantId }
    })
  }

  // 获取租户下用户列表
  static getTenantAccountPage(params: Api.Common.PaginatingSearchParams) {
    return request.post<QueryTenantPageRes>({
      url: `${ServiceApiEnum.SYSTEM}/tenant/fetch-tenant-account-page`,
      params
    })
  }
}
