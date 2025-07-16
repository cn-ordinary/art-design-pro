<template>
  <ArtSearchBar
    v-model:filter="searchFormState"
    :items="formItems"
    @reset="handleReset"
    @search="handleSearch"
    @keydown.enter="handleSearch"
  />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps<{
    modelValue?: any
    formItems: any[]
    defaultValue: any
  }>()
  const emit = defineEmits(['update:modelValue', 'search', 'reset'])

  const searchFormState = ref({ ...props.defaultValue })

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) searchFormState.value = { ...newValue }
    },
    { immediate: true, deep: true }
  )

  const handleReset = () => {
    const resetValue = { ...props.defaultValue }
    searchFormState.value = resetValue
    emit('update:modelValue', resetValue)
    emit('reset')
  }

  const handleSearch = () => {
    emit('search', searchFormState.value)
  }
</script>
