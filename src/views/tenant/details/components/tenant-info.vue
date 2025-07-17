<template>
  <ElCard class="art-table-card" shadow="never">
    <template #header>
      <div class="card-header">
        <!-- <div class="icon">
          <i class="iconfont-sys arrow-icon">&#xe6e6;</i>
        </div> -->
        <div class="text">
          {{ info.tenantName }} <i class="iconfont-sys arrow-icon">&#xe6e6;</i>
        </div>
      </div>
    </template>

    <ElForm ref="formRef" :model="info" label-width="85px">
      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="租户编号" prop="tenantNumber">
            <ElInput v-model="info.tenantNumber" disabled placeholder="租户编号"></ElInput>
          </ElFormItem>
        </ElCol>

        <ElCol :span="8">
          <ElFormItem label="租户名称" prop="tenantName">
            <ElInput v-model="info.tenantName" placeholder="租户名称"></ElInput>
          </ElFormItem>
        </ElCol>

        <ElCol :span="8">
          <ElFormItem label="联 系 人" prop="contactPerson">
            <ElInput v-model="info.contactPerson" placeholder="联 系 人"></ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="电话号码" prop="contactPhone">
            <ElInput v-model="info.contactPhone" placeholder="电话号码"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="16">
          <ElFormItem label="描述信息" prop="remark">
            <ElInput type="textarea" v-model="info.remark" placeholder="描述信息"></ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </ElCard>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { TenantService } from '@/api/tenant-api'
  import type { QueryTenantInfoRes } from '@/types'

  defineOptions({ name: 'TenantInfo' })

  // 获取路由参数
  const route = useRoute()

  const info = ref<QueryTenantInfoRes>({
    tenantId: '',
    remark: '',
    tenantNumber: '',
    tenantName: '',
    contactPerson: '',
    contactPhone: '',
    tenantLogoId: '',
    tenantStatus: -1,
    createTime: ''
  })

  // 获取租户信息的方法
  const getTenantInfo = async (tenantId: string | number) => {
    const form = await TenantService.getTenantInfo(tenantId)
    info.value = form
  }

  onMounted(() => {
    if (route.query.tenantId) {
      getTenantInfo(route.query.tenantId as string)
    }
  })

  watch(
    () => route.query.tenantId,
    (newId, oldId) => {
      if (newId && newId !== oldId) {
        getTenantInfo(newId as string)
      }
    }
  )
</script>

<style lang="scss" scoped>
  .icon,
  .text {
    display: inline-block;
    margin-right: 5px;
  }
</style>
