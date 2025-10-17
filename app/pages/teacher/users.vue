<script setup>
definePageMeta({
  layout: 'teacher',
  middleware: ['auth']
})

const toast = useToast()
const appConfig = useAppConfig()

const UButton = resolveComponent('UButton')

const { data, refresh, pending } = await useAPI('/Account/listAllUser')
const users = computed(() => data.value?.list)
const deleteModalOpen = ref(false)
const roleItems = appConfig.appInfo.roleEnums
const columns = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'userName',
    header: '用户名'
  },
  {
    accessorKey: 'name',
    header: '姓名'
  },
  {
    accessorKey: 'email',
    header: '电子邮箱'
  },
  {
    accessorKey: 'role',
    header: '角色',
    cell: ({ row }) => `${formatText(appConfig.appInfo.roleEnums, row.getValue('role'))}`
  },
  {
    accessorKey: 'actions',
    header: '操作'
  }
]

const isModalOpen = ref(false)
const defaultUser = {
  id: null,
  name: null,
  role: appConfig.appInfo.roleEnum.teacher,
  email: null,
  userName: null
}
const currentUser = ref({ ...defaultUser })

async function openModal(user = { ...defaultUser }) {
  currentUser.value = { ...defaultUser }
  if (user.id) {
    const u = await $api(`/Account/getUserById/${user.id}`)

    currentUser.value = u
  }

  isModalOpen.value = true
}

function handleDelete(user) {
  currentUser.value = { ...user }

  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  deleteModalOpen.value = false
}

const confirmDelete = async (user) => {
  const response = await $api(`/Account/DeleteUser/${user.id}`, {
    method: 'delete'
  })

  await refresh()
  toast.add({ title: response || '删除成功', color: 'success' })
  deleteModalOpen.value = false
}

function batchImport() {
  toast.add({ title: 'todo...' })
}

function goBack() {
  navigateTo('/teacher?tab=student')
}

const { $api } = useNuxtApp()

async function saveUser(user) {
  let response = null

  if (user.id) {
    response = await $api('/Account/UpdateUser', {
      method: 'put',
      body: user
    })
  } else {
    response = await $api('/Account/CreateUser', {
      method: 'post',
      body: user
    })
  }

  toast.add({ title: response || '成功', color: 'success' })
  await refresh()
  closeModal()
}

function closeModal() {
  isModalOpen.value = false
  currentUser.value = { ...defaultUser }
}
</script>

<template>
  <div>
    <div class="flex gap-4">
      <UButton
        label="查询"
        color="secondary"
        @click="refresh()"
      />
      <UButton
        label="添加"
        @click="openModal()"
      />
      <UButton
        label="导入"
        color="warning"
        @click="batchImport()"
      />
      <UButton
        label="返回"
        variant="subtle"
        @click="goBack()"
      />
    </div>

    <UTable
      :data="users"
      :columns="columns"
      :loading="pending"
    >
      <template #actions-cell="{ row }">
        <div class="space-x-2">
          <UButton
            icon="i-lucide-edit"
            variant="outline"
            color="info"
            size="sm"
            title="编辑"
            @click="openModal(row.original)"
          />

          <UButton
            icon="i-lucide-trash"
            variant="outline"
            color="error"
            size="sm"
            title="删除"
            @click="handleDelete(row.original)"
          />
        </div>
      </template>
    </UTable>

    <UModal v-model:open="isModalOpen">
      <template #header>
        <h2>{{ currentUser.id ? '编辑' : '添加' }}</h2>
      </template>
      <template #body>
        <UForm @submit="saveUser(currentUser)">
          <UFormField
            label="用户名"
            name="userName"
          >
            <UInput
              v-model="currentUser.userName"
              required
            />
          </UFormField>
          <UFormField
            label="姓名"
            name="name"
          >
            <UInput
              v-model="currentUser.name"
              label="姓名"
              required
            />
          </UFormField>
          <UFormField
            label="邮箱"
            name="email"
          >
            <UInput
              v-model="currentUser.email"
              label="邮箱"
              type="email"
              required
            />
          </UFormField>
          <UFormField
            label="角色"
            name="role"
          >
            <URadioGroup
              v-model="currentUser.role"
              color="primary"
              variant="table"
              default-value="student"
              :items="roleItems"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <UButton
          label="取消"
          variant="subtle"
          @click="closeModal"
        />
        <UButton
          label="保存"
          color="success"
          type="submit"
          @click="saveUser(currentUser)"
        />
      </template>
    </UModal>

    <UModal v-model:open="deleteModalOpen">
      <template #header>
        <h2>提醒</h2>
      </template>

      <template #body>
        <div class="text-center text-xl">
          确定删除用户： {{ currentUser.name }} 吗？
        </div>
      </template>

      <template #footer>
        <UButton
          label="取消"
          variant="subtle"
          @click="closeDeleteModal"
        />
        <UButton
          label="确定"
          color="success"
          type="submit"
          @click="confirmDelete(currentUser)"
        />
      </template>
    </UModal>
  </div>
</template>
