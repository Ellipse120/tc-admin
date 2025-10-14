<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div class="flex items-center space-x-2">
    <UIcon
      name="i-lucide-book-open-text"
      class="size-6 text-primary inline-block m"
    />
    <h1 className="text-xl">
      {{ appConfig.appInfo.title }}
    </h1>
  </div>
</template>
