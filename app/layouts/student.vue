<script setup lang="ts">
import type { ResponseUser } from '~/shared/types'

const appConfig = useAppConfig()
const { user, logout, isLoggedIn } = useUser()

const onLogout = async () => {
  logout()
  await navigateTo('/')
}
</script>

<template>
  <div>
    <UHeader to="/teacher">
      <template #title>
        <UIcon
          name="i-lucide-book-open-text"
          class="w-8 h-8 text-secondary"
        />
        {{ appConfig.appInfo.title }}
      </template>

      <template #right>
        <div class="flex gap-2">
          <div class="flex items-center space-x-4">
            <span class="text-gray-700 dark:text-white">欢迎回来，{{ (user as ResponseUser)?.user.userName }}</span>
          </div>

          <UColorModeButton />

          <UButton
            v-if="isLoggedIn"
            label="退出"
            icon="i-lucide-log-in"
            color="neutral"
            variant="outline"
            @click="onLogout"
          />

          <UButton
            v-if="!isLoggedIn"
            label="登录"
            color="neutral"
            variant="outline"
            to="/login"
            class="hidden lg:inline-flex"
          />

          <UButton
            v-if="!isLoggedIn"
            label="注册"
            color="neutral"
            trailing-icon="i-lucide-arrow-right"
            class="hidden lg:inline-flex"
            to="/signup"
          />
        </div>
      </template>
    </UHeader>

    <UMain class="w-full max-w-(--ui-container) mx-auto px-4 dark:bg-gray-800">
      <slot />
    </UMain>
  </div>
</template>
