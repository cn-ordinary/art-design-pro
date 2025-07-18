<!-- 租户列表 -->
<template>
  <div class="art-full-height">
    <!-- 筛选表单 -->
    <Search
      v-model="searchFormData"
      :formItems="formItems"
      :defaultValue="DEFAULT_SEARCH"
      @reset="resetSearchParams"
      @search="handleSearch"
    />

    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" @refresh="refresh">
        <template #left>
          <ElButton @click="exportData">导出</ElButton>
        </template>
      </ArtTableHeader>

      <!-- 数据表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        :table-config="{ rowKey: 'tenantId' }"
        :layout="{ marginTop: 10 }"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import Search from '@/components/core/forms/art-from-search/index.vue'
  import { DEFAULT_SEARCH, formItems } from './form/form.config'
  import { useTable } from '@/composables/useTable'
  import { SupportService } from '@/api/support-api'
  import { ref } from 'vue'
  import type { QueryTenantPageRes, SelectOption } from '@/types'
  import { LOGIN_DEVICE_TYPE } from '@/const'

  defineOptions({ name: 'TenantManage' })

  const { getLoginLogList } = SupportService

  // 搜索表单数据
  const searchFormData = ref({ ...DEFAULT_SEARCH })

  const loginDeviceTypeOption = ref<SelectOption[]>([])

  onMounted(async () => {
    const data = await SupportService.getDictOptions(LOGIN_DEVICE_TYPE)
    loginDeviceTypeOption.value = data
    // 更新表单项中的租户状态选项
    const loginDeviceTypeItem = formItems.find((item) => item.prop === 'tenantStatus')
    if (loginDeviceTypeItem) loginDeviceTypeItem.options = data
  })

  const tenantStatusMap = computed(() => {
    const map = new Map()
    loginDeviceTypeOption.value.forEach((opt) => {
      map.set(String(opt.value), { type: opt.type || 'info', text: opt.label })
    })
    return map
  })

  const getUserStatusConfig = (status: string | number) => {
    return tenantStatusMap.value.get(String(status)) || { type: 'info', text: '未知' }
  }

  const {
    columns,
    columnChecks,
    tableData: data,
    isLoading: loading,
    paginationState: pagination,
    searchData: getDataByPage,
    refreshAll: refresh,
    resetSearch: resetSearchParams,
    onPageSizeChange: handleSizeChange,
    onCurrentPageChange: handleCurrentChange
  } = useTable<QueryTenantPageRes>({
    // 核心配置
    core: {
      apiFn: getLoginLogList,
      apiParams: {
        pageNum: 1,
        pageSize: 10,
        ...searchFormData.value
      },
      columnsFactory: () => [
        { prop: 'accountName', label: '用户名称' },
        { prop: 'nickname', label: '账号昵称' },
        { prop: 'tenantNumber', label: '租户编号' },
        { prop: 'tenantName', label: '租户名称' },
        { prop: 'loginIp', label: '登录IP' },
        {
          prop: 'loginDeviceType',
          label: '登录设备',
          formatter: (row) => {
            const statusConfig = getUserStatusConfig(String(row.loginDeviceType))
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          width: 200,
          prop: 'createTime',
          label: '登录时间',
          sortable: true
        }
      ]
    }
  })

  /**
   * 处理搜索事件
   */
  const handleSearch = (searchParams: any): void => {
    console.log('接收到搜索参数:', searchParams)
    // 调用 useTable 的搜索方法，传递搜索参数
    getDataByPage(searchParams)
  }

  /**
   * 导出数据
   */
  const exportData = () => {
    console.log('导出数据')
  }
</script>

<style lang="scss" scoped></style>
