<!-- 租户详情页 -->

<template>
  <div>
    <!-- 租户信息 -->
    <TenantInfo />

    <ElCard class="art-table-card" shadow="never">
      <!-- 用户、角色、权限 -->
      <ElTabs v-model="activeTab">
        <ElTabPane
          v-for="tab in tenantDetailsTabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <component :tenantId v-if="activeTab === tab.name" :is="tab.component" />
        </ElTabPane>
      </ElTabs>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElTabs, ElTabPane } from 'element-plus'
  import { tenantDetailsTabs } from './form/form.config'
  import TenantInfo from './components/tenant-info.vue'

  const activeTab = ref(tenantDetailsTabs[0].name)

  // 获取路由参数
  const route = useRoute()
  const tenantId = ref(route.query.tenantId as string)
</script>
<style lang="scss" scoped>
  .new-tab {
    border: 0;
  }
</style>
