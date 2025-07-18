<!-- 租户列表 -->
<template>
  <div class="user-page art-full-height">
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
          <ElButton @click="showDialog('add')">新增租户</ElButton>
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
        @row:selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

      <!-- 添加编辑 -->
      <TenantDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :row-data="rowData"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import Search from '@/components/core/forms/art-from-search/index.vue'
  import { formItems, DEFAULT_SEARCH } from './form/form.config'
  import { ElMessageBox, ElMessage, ElTag } from 'element-plus'
  import { useTable } from '@/composables/useTable'
  import { TenantService } from '@/api/tenant-api'
  import { ref, onMounted, computed } from 'vue'
  import type { QueryTenantPageRes, SelectOption } from '@/types'
  import TenantDialog from './components/tenant-dialog.vue'
  import { OperateType } from '@/enums/formEnum'
  import { TENANT_STATUS } from '@/const'
  import { SupportService } from '@/api/support-api'
  import { useRouter } from 'vue-router'
  import { RoutesAlias } from '@/router/routesAlias'

  defineOptions({ name: 'TenantManage' })

  const router = useRouter()

  const { getTenantPage } = TenantService

  // 弹窗相关
  const dialogType = ref<Form.DialogType>(OperateType.ADD)
  const dialogVisible = ref(false)
  const rowData = ref<Partial<QueryTenantPageRes>>({})

  // 选中行
  const selectedRows = ref<QueryTenantPageRes[]>([])

  // 搜索表单数据
  const searchFormData = ref({ ...DEFAULT_SEARCH })

  const tenantStatusOptions = ref<SelectOption[]>([])

  onMounted(async () => {
    const data = await SupportService.getDictOptions(TENANT_STATUS)
    tenantStatusOptions.value = data
    // 更新表单项中的租户状态选项
    const tenantStatusItem = formItems.find((item) => item.prop === 'loginDeviceType')
    if (tenantStatusItem) tenantStatusItem.options = data
  })

  const tenantStatusMap = computed(() => {
    const map = new Map()
    tenantStatusOptions.value.forEach((opt) => {
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
    resetSearch: resetSearchParams,
    onPageSizeChange: handleSizeChange,
    onCurrentPageChange: handleCurrentChange,
    refreshAll: refresh,
    refreshAfterCreate: refreshAfterAdd,
    refreshAfterUpdate: refreshAfterEdit,
    refreshAfterRemove: refreshAfterDelete
  } = useTable<QueryTenantPageRes>({
    // 核心配置
    core: {
      apiFn: getTenantPage,
      apiParams: {
        pageNum: 1,
        pageSize: 10,
        ...searchFormData.value
      },
      columnsFactory: () => [
        { type: 'selection', width: 60, label: '选择' },
        { type: 'index', width: 60, label: '序号' },
        { prop: 'tenantNumber', label: '租户编号' },
        { prop: 'tenantName', label: '租户名称' },
        { prop: 'contactPerson', label: '联系人' },
        { prop: 'contactPhone', label: '电话号码' },
        {
          prop: 'tenantStatus',
          label: '租户状态',
          formatter: (row) => {
            const statusConfig = getUserStatusConfig(String(row.tenantStatus))
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          width: 200,
          prop: 'createTime',
          label: '创建日期',
          sortable: true
        },
        {
          prop: 'operation',
          label: '操作',
          width: 200,
          fixed: 'right',
          formatter: (row) =>
            h('div', [
              h(ArtButtonTable, {
                type: OperateType.EDIT,
                onClick: () => showDialog(OperateType.EDIT, row)
              }),
              h(ArtButtonTable, {
                type: OperateType.DELETE,
                onClick: () => deleteUser(row)
              }),
              h(ArtButtonTable, {
                type: OperateType.VIEW,
                onClick: () =>
                  router.push({
                    path: RoutesAlias.TenantDetails,
                    query: { tenantId: row.tenantId }
                  })
              })
            ])
        }
      ]
    }
    // 数据处理
    // transform: {
    //   // 数据转换器 - 替换头像
    //   dataTransformer: (records: any) => {
    //     // 类型守卫检查
    //     if (!Array.isArray(records)) {
    //       console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
    //       return []
    //     }
    //     return records
    //   }
    // }
  })

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: Form.DialogType, row?: QueryTenantPageRes): void => {
    console.log('打开弹窗:', { type, row })
    dialogType.value = type
    rowData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 删除用户
   */
  const deleteUser = (row: QueryTenantPageRes): void => {
    console.log('删除用户:', row)
    ElMessageBox.confirm(`确定要注销该用户吗？`, '注销用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('注销成功')
      refreshAfterDelete() // 智能删除后刷新
    })
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      await (dialogType.value === OperateType.ADD ? refreshAfterAdd() : refreshAfterEdit())
      rowData.value = {}
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  /**
   * 处理搜索事件
   */
  const handleSearch = (searchParams: any): void => {
    console.log('接收到搜索参数:', searchParams)
    // 调用 useTable 的搜索方法，传递搜索参数
    getDataByPage(searchParams)
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: QueryTenantPageRes[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }
</script>

<style lang="scss" scoped>
  .user-page {
    :deep(.user) {
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 6px;
      }

      > div {
        margin-left: 10px;

        .user-name {
          font-weight: 500;
          color: var(--art-text-gray-800);
        }
      }
    }
  }
</style>
