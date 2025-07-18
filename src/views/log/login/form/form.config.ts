import { SearchFormItem } from '@/types'

export interface TenantSearchForm {
  tenantNumber: string
  tenantName: string
  contactPerson: string
  contactPhone: string
  tenantStatus: any
}

export const DEFAULT_SEARCH: TenantSearchForm = {
  tenantNumber: '',
  tenantName: '',
  contactPerson: '',
  contactPhone: '',
  tenantStatus: undefined
}

export const formItems: SearchFormItem[] = [
  {
    label: '用户名称',
    prop: 'accountId',
    type: 'select',
    config: { clearable: true }
  },
  {
    label: '租户名称',
    prop: 'tenantId',
    type: 'select',
    config: { clearable: true }
  },
  {
    label: '登录设备',
    prop: 'loginDeviceType',
    type: 'select',
    config: { clearable: true }
  },
  {
    prop: 'daterange',
    label: '日期范围',
    type: 'daterange',
    config: {
      type: 'daterange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
    }
  }
]
