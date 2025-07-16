import { BaseAccount } from '@/types/system/account'

export interface QueryTenantAccountList extends BaseAccount {
  tenantId: string
}
