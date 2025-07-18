import request from '@/utils/http'
import type { SelectOption } from '@/types'
import { SupportApi } from '@/enums/service-api'

export class SupportService {
  // 获取字典数据下拉数据
  static getDictOptions(dictTypeCode: string) {
    return request.post<SelectOption[]>({
      url: `${SupportApi}/dict-data/fetch-select-data`,
      params: { dictTypeCode }
    })
  }

  // 获取登录日志列表
  static getLoginLogList(params: Api.Common.PaginatingSearchParams) {
    return request.post<any>({
      url: `${SupportApi}/log/fetch-login-log-page`,
      params
    })
  }

  // 获取操作日志列表
}
