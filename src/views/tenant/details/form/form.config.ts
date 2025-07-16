import { SearchFormItem } from '@/types'
import AccountList from '../components/account-list.vue'
import roleList from '../components/role-list.vue'

// 租户详情TABS数据源
export const tenantDetailsTabs = [
  {
    label: '用户列表',
    name: 'userAccountList',
    component: AccountList
  },
  {
    label: '角色列表',
    name: 'roleList',
    component: roleList
  }
]

export interface TenantSearchForm {
  tenantId?: string
  accountName?: string
  mobile?: string
  email?: string
}

// 默认查询条件
export const DEFAULT_SEARCH: TenantSearchForm = {
  tenantId: '',
  accountName: '',
  mobile: '',
  email: ''
}

export const formItems: SearchFormItem[] = [
  {
    label: '用户名称',
    prop: 'accountName',
    type: 'input',
    config: { clearable: true }
  },
  {
    label: '手机号码',
    prop: 'mobile',
    type: 'input',
    config: { clearable: true }
  },
  {
    label: '邮箱地址',
    prop: 'email',
    type: 'select',
    config: { clearable: true }
  }
]
