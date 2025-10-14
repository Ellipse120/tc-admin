<script setup lang="ts">
const columns = [
  {
    label: '资源',
    children: [
      {
        label: '帮助'
      },
      {
        label: '文档'
      },
      {
        label: '路线'
      },
      {
        label: '更新日志'
      }
    ]
  },
  {
    label: '特色',
    children: [
      {
        label: 'AI驱动'
      },
      {
        label: '门户'
      },
      {
        label: '工作'
      },
      {
        label: '赞助'
      }
    ]
  },
  {
    label: '公司',
    children: [
      {
        label: '关于'
      },
      {
        label: '价格'
      },
      {
        label: '职业'
      },
      {
        label: '博客'
      }
    ]
  }
]

const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.'
  })
}
</script>

<template>
  <USeparator
    icon="i-lucide-leafy-green"
    class="h-px"
  />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="订阅我们的最新资讯"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="请输入您的电子邮箱"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      color="neutral"
                      label="订阅"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        Built with Ellipse120 • © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
        to="#"
        target="_blank"
        icon="i-simple-icons-wechat"
        aria-label="Me on WeChat"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://x.com/ellipse_120"
        target="_blank"
        icon="i-simple-icons-x"
        aria-label="Nuxt on X"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://github.com/ellipse120"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="Me on GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
