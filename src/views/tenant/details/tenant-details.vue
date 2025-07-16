<!-- 租户详情页 -->

<template>
  <ElTabs class="demo-tabs" v-model="activeTab">
    <ElTabPane v-for="tab in tenantDetailsTabs" :key="tab.name" :label="tab.label" :name="tab.name">
      <component :tenantId v-if="activeTab === tab.name" :is="tab.component" />
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElTabs, ElTabPane } from 'element-plus'
  import { tenantDetailsTabs } from './form/form.config'

  const activeTab = ref(tenantDetailsTabs[0].name)

  // 获取路由参数（query 方式）
  const route = useRoute()
  const tenantId = ref(route.query.tenantId as string)
</script>
