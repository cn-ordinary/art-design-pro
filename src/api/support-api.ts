import request from '@/utils/http'
import type { SelectOption } from '@/types'
import { SupportApi } from '@/enums/service-api'

export class SupportService {
  // 获取用户信息
  static getDictOptions(dictTypeCode: string) {
    return request.post<SelectOption[]>({
      url: `${SupportApi}/dict-data/fetch-select-data`,
      params: { dictTypeCode }
    })
  }
}
