<!-- 租户列表 -->
<template>
  <div class="user-page art-full-height pt-40">
    <!-- 筛选表单 -->
    <Search
      v-model="searchFormData"
      :formItems="formAccountItems"
      :defaultValue="DEFAULT_SEARCH"
      @reset="resetSearchParams"
      @search="handleSearch"
    />

    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" @refresh="refresh">
        <template #left>
          <ElButton @click="showDialog('add')">新增用户</ElButton>
        </template>
      </ArtTableHeader>

      <!-- 数据表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        :table-config="{ rowKey: 'accountId' }"
        :layout="{ marginTop: 10 }"
        @row:selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

      <!-- 添加编辑 -->
      <!-- <TenantDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :row-data="rowData"
        @submit="handleDialogSubmit"
      /> -->
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import Search from '@/components/core/forms/art-from-search/index.vue'
  import { formAccountItems, DEFAULT_SEARCH } from '../../details/form/form.config'
  import { ElMessageBox, ElMessage, ElTag } from 'element-plus'
  import { useTable } from '@/composables/useTable'
  import { TenantService } from '@/api/tenant-api'
  import { ref, onMounted } from 'vue'
  import type { QueryTenantAccountList, SelectOption } from '@/types'
  // import TenantDialog from './components/tenant-dialog.vue'
  import { OperateType } from '@/enums/formEnum'
  import { SupportService } from '@/api/support-api'
  import { GENDER_TYPE } from '@/const'

  defineOptions({ name: 'TenantAccountList' })

  // 获取路由参数
  const route = useRoute()

  const { getTenantAccountPage } = TenantService

  // 弹窗 新增 Or 编辑
  const dialogType = ref<Form.DialogType>(OperateType.ADD)

  // 弹窗可见性，默认关闭
  const dialogVisible = ref(false)

  // 弹窗数据
  const rowData = ref<Partial<QueryTenantAccountList>>({})

  // 选中行
  const selectedRows = ref<QueryTenantAccountList[]>([])

  // 搜索表单数据
  const searchFormData = ref({ ...DEFAULT_SEARCH, tenantId: route.query.tenantId })

  // 租户状态下拉选项
  const genderOptions = ref<SelectOption[]>([])
  onMounted(async () => {
    const data = await SupportService.getDictOptions(GENDER_TYPE)
    genderOptions.value = data
  })

  // 构建映射(提供给表格渲染用户性别使用)
  const genderMap = computed(() => {
    const map = new Map()
    genderOptions.value.forEach((opt) => {
      map.set(opt.value, { label: opt.label, type: opt.type || 'info' })
    })
    return map
  })

  // 监听路由参数变化，更新搜索表单数据，重新获取获取数据
  watch(
    () => route.query.tenantId,
    (newId, oldId) => {
      if (newId && newId !== oldId) {
        searchFormData.value.tenantId = newId as string
        getDataByPage(searchFormData.value)
      }
    }
  )

  // ---------------------------------------------------表格相关---------------------------------------------------
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
    // refreshAfterCreate: refreshAfterAdd,
    // refreshAfterUpdate: refreshAfterEdit,
    refreshAfterRemove: refreshAfterDelete
  } = useTable<QueryTenantAccountList>({
    // 核心配置
    core: {
      apiFn: getTenantAccountPage,
      apiParams: {
        pageNum: 1,
        pageSize: 10,
        ...searchFormData.value
      },
      columnsFactory: () => [
        { type: 'selection', width: 60, label: '选择' },
        { type: 'index', width: 60, label: '序号' },
        { prop: 'accountName', label: '用户名称 ' },
        { prop: 'nickname', label: '用户昵称' },
        // {
        //   prop: 'avatar',
        //   label: '用户头像',
        //   formatter: (row) => {
        //     return h(ElAvatar, { src: row.avatar })
        //   }
        // },
        { prop: 'email', width: 150, label: '邮箱地址' },
        { prop: 'mobile', label: '手机号码' },
        {
          prop: 'gender',
          label: '性别',
          formatter: (row) => {
            const gender = genderMap.value.get(row.gender.toString())
            if (gender) {
              return h(ElTag, { type: gender.type }, () => gender.label)
            }
            return h(ElTag, { type: 'info' }, () => '未知')
          }
        },
        {
          prop: 'createTime',
          label: '创建日期',
          sortable: true
        },
        {
          prop: 'operation',
          label: '操作',
          width: 120,
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
              })
            ])
        }
      ]
    }
  })

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: Form.DialogType, row?: QueryTenantAccountList): void => {
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
  const deleteUser = (row: QueryTenantAccountList): void => {
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

  // /**
  //  * 处理弹窗提交事件
  //  */
  // const handleDialogSubmit = async () => {
  //   try {
  //     dialogVisible.value = false
  //     await (dialogType.value === OperateType.ADD ? refreshAfterAdd() : refreshAfterEdit())
  //     rowData.value = {}
  //   } catch (error) {
  //     console.error('提交失败:', error)
  //   }
  // }

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
  const handleSelectionChange = (selection: QueryTenantAccountList[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }
</script>

<style lang="scss" scoped></style>
