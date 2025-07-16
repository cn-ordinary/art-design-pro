export interface TenantSearchForm {
  tenantNumber: string
  tenantName: string
  contactPerson: string
  contactPhone: string
}

export const DEFAULT_TENANT_SEARCH: TenantSearchForm = {
  tenantNumber: '',
  tenantName: '',
  contactPerson: '',
  contactPhone: ''
}
