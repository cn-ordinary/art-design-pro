import { SearchFormItem } from '@/types'
import AccountList from '../components/account-list.vue'
import roleList from '../components/role-list.vue'
import permissionList from '../components/permission-list.vue'

// 租户详情TABS数据源
export const tenantDetailsTabs = [
  {
    label: '用户管理',
    name: 'userAccountList',
    component: AccountList
  },
  {
    label: '角色管理',
    name: 'roleList',
    component: roleList
  },
  {
    label: '权限管理',
    name: 'permissionList',
    component: permissionList
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

// 用户列表查询条件
export const formAccountItems: SearchFormItem[] = [
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
    type: 'input',
    config: { clearable: true }
  }
]
