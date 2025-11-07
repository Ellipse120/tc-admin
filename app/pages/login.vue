<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { ResponseUser } from '~/shared/types'

definePageMeta({
  layout: 'standalone'
})

useSeoMeta({
  title: '登录',
  description: '登录后继续'
})

const toast = useToast()
const appConfig = useAppConfig()

const fields = [
  {
    name: 'email',
    type: 'text' as const,
    label: '用户名或者电子邮箱',
    placeholder: '请输入您的用户名或者电子邮箱',
    required: true
  },
  {
    name: 'password',
    label: '密码',
    type: 'password' as const,
    placeholder: '请输入您的密码',
    required: true
  },
  {
    name: 'remember',
    label: '记住我',
    type: 'checkbox' as const
  }
]

const schema = z.object({
  email: z.union([z.email('无效电子邮箱'), z.string('不能为空').min(1)]),
  password: z.string().min(6, '至少6个字符')
})

type Schema = z.output<typeof schema>

const { $api } = useNuxtApp()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const data = await $api<ResponseUser>('/Account/login', {
    method: 'POST',
    body: {
      ...payload.data,
      username: payload.data.email
    }
  }).catch((err) => {
    toast.add({
      title: '登录失败',
      description: err?.data?.message || '请稍后再试',
      color: 'error'
    })
  })

  if (data?.token) {
    const cookie = useCookie('userInfo')
    cookie.value = data
    refreshCookie('userInfo')
    useUser(data)

    toast.add({
      title: '登录成功',
      description: `欢迎回来！${data.user.userName}`,
      color: 'success'
    })

    const redirect = data.user.role !== appConfig.appInfo.roleEnum.student ? '/teacher' : '/student'

    return navigateTo(redirect)
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :title="appConfig.appInfo.title"
    :submit="{
      label: '登录',
      block: true
    }"
    icon="i-lucide-book-open-text"
    @submit="onSubmit"
  >
    <template #header>
      <div class="flex items-center flex-col gap-4 justify-center">
        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
          <UIcon
            name="i-lucide-book-open-text"
            class="w-8 h-8 text-white"
          />
        </div>
        <div class="text-2xl font-bold text-center">
          {{ appConfig.appInfo.title }}
        </div>
      </div>

      <div class="pt-2">
        还没有账号? <ULink
          to="/signup"
          class="text-primary font-medium"
        >注册</ULink>
      </div>
    </template>

    <template #password-hint>
      <ULink
        to="/"
        class="text-primary font-medium"
        tabindex="-1"
      >忘记密码?</ULink>
    </template>

    <template #footer>
      点击登陆，即表示您同意我们的 <ULink
        to="/"
        class="text-primary font-medium"
      >服务条款</ULink>
    </template>
  </UAuthForm>
</template>
