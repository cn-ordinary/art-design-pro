<template>
  <ElCard class="art-table-card" shadow="never">
    <template #header>
      <div class="card-header">
        <!-- <div class="icon">
          <i class="iconfont-sys arrow-icon">&#xe6e6;</i>
        </div> -->
        <div class="text">
          {{ info.tenantName }} {{ info.tenantNumber
          }}<i class="iconfont-sys arrow-icon">&#xe6e6;</i>
        </div>
      </div>
    </template>

    <ElForm ref="formRef" :model="info" label-width="85px">
      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="租户名称" prop="tenantName">
            <ElInput v-model="info.tenantName" placeholder="租户名称"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="联系人" prop="contactPerson">
            <ElInput v-model="info.contactPerson" placeholder="联系人"></ElInput>
          </ElFormItem>
        </ElCol>

        <ElCol :span="8">
          <ElFormItem label="电话号码" prop="contactPhone">
            <ElInput v-model="info.contactPhone" placeholder="电话号码"></ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="租户LOGO" prop="tenantLogoId">
            <ElUpload
              class="logo-uploader"
              action="#"
              :show-file-list="false"
              :on-change="handleLogoChange"
            >
              <img v-if="info.tenantLogoId" :src="info.tenantLogoId" class="logo-preview" />
              <ElButton v-else type="primary">上传LOGO</ElButton>
            </ElUpload>
          </ElFormItem>
        </ElCol>
        <ElCol :span="16">
          <ElFormItem label="描述信息" prop="remark">
            <ElInput type="textarea" v-model="info.remark" placeholder="描述信息"></ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <div style="text-align: right; margin-top: 16px">
      <ElButton type="primary">保存</ElButton>
    </div>
  </ElCard>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { TenantService } from '@/api/tenant-api'
  import type { QueryTenantInfoRes } from '@/types'
  import { ref } from 'vue'

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

  // 处理LOGO上传
  const handleLogoChange = (file: any) => {
    // 假设直接读取本地预览
    const reader = new FileReader()
    reader.onload = (e: any) => {
      info.value.tenantLogoId = e.target.result
    }
    reader.readAsDataURL(file.raw)
  }
</script>

<style lang="scss" scoped>
  .icon,
  .text {
    display: inline-block;
    margin-right: 5px;
  }
  .logo-uploader {
    display: flex;
    align-items: center;
  }
  .logo-preview {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-right: 10px;
  }
</style>
