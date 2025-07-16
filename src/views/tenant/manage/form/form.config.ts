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

// 租户状态下拉选项返回数据格式 [{ label: '正常', value: 0 }]
export const formItems: SearchFormItem[] = [
  {
    label: '租户编号',
    prop: 'tenantNumber',
    type: 'input',
    config: { clearable: true }
  },
  {
    label: '租户名称',
    prop: 'tenantName',
    type: 'input',
    config: { clearable: true }
  },
  {
    label: '租户状态',
    prop: 'tenantStatus',
    type: 'select',
    config: { clearable: true }
  },
  {
    label: '联系人',
    prop: 'contactPerson',
    type: 'input',
    config: { clearable: true }
  },
  {
    label: '手机号',
    prop: 'contactPhone',
    type: 'input',
    config: { clearable: true }
  }
]
