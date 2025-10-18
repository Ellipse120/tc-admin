<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'standalone'
})

useSeoMeta({
  title: '注册',
  description: '注册新用户，开启学习之旅'
})

const toast = useToast()

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

  }
]

const providers = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: () => {
      toast.add({ title: 'Google', description: 'Login with Google' })
    }
  }, {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: () => {
      toast.add({ title: 'GitHub', description: 'Login with GitHub' })
    }
  }
]

const schema = z.object({
  email: z.union([z.email('无效电子邮箱'), z.string('不能为空').min(1)]),
  password: z.string().min(6, '至少6个字符')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Submitted', payload)
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    separator="或者"
    title="注册"
    :submit="{ label: '创建账号' }"
    @submit="onSubmit"
  >
    <template #description>
      已经有账号了? <ULink
        to="/login"
        class="text-primary font-medium"
      >登录</ULink>
    </template>

    <template #footer>
      点击创建账号，即表示您同意我们的  <ULink
        to="/"
        class="text-primary font-medium"
      >服务条款</ULink>.
    </template>
  </UAuthForm>
</template>
