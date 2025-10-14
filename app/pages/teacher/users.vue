<script setup>
definePageMeta({
  layout: 'teacher',
  middleware: ['auth']
})

const toast = useToast()
const appConfig = useAppConfig()

const UButton = resolveComponent('UButton')

const { data } = await useAPI('/Account/listAllUser')
const users = data.value?.list

const roleItems = appConfig.appInfo.roleItems
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `${row.getValue('id')}`
  },
  {
    accessorKey: 'userName',
    header: '用户名',
    cell: ({ row }) => `${row.getValue('userName')}`
  },
  {
    accessorKey: 'name',
    header: '姓名',
    cell: ({ row }) => `${row.getValue('name')}`
  },
  {
    accessorKey: 'email',
    header: '电子邮箱',
    cell: ({ row }) => `${row.getValue('email')}`
  },
  {
    accessorKey: 'role',
    header: '角色',
    cell: ({ row }) => `${formatText(Object.entries(appConfig.appInfo.roleEnum).map(([label, value]) => ({ label: label, value: value })), row.getValue('role'))}`
  },
  {
    accessorKey: '',
    header: '操作',
    cell: ({ row }) => {
      const editBtn = h(UButton, {
        color: 'success',
        onClick: () => openModal(row.original)
      }, () => '编辑')
      const deleteBtn = h(UButton, {
        color: 'warning',
        onClick: () => openModal(row.original)
      }, () => '删除')

      return h('div', {
        class: 'flex gap-2'
      }, [editBtn, deleteBtn])
    }
  }
]

const isModalOpen = ref(false)
const defaultUser = {
  id: null,
  name: null,
  role: 'student',
  email: null,
  userName: null
}
const currentUser = ref({ ...defaultUser })

function openModal(user = { ...defaultUser }) {
  currentUser.value = { ...user }
  isModalOpen.value = true
}

function batchImport() {
  toast.add({ title: 'todo...' })
}

function goBack() {
  navigateTo('/teacher?tab=student')
}
const { $api } = useNuxtApp()
async function saveUser(user) {
  if (user.id) {
    const index = users.value.findIndex(u => u.id === user.id)
    users.value[index] = user
    toast.add({ title: 'User updated!', color: 'success' })
  } else {
    // user.id = users.value.length + 1
    // users.value.push(user)
    // toast.add({ title: 'User added!', color: 'success' })
    const response = await $api('/Account/create-user', {
      method: 'post',
      body: user
    })
    toast.add({ title: response || 'User added!', color: 'success' })
  }
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
        label="添加"
        @click="openModal()"
      />
      <UButton
        label="导入"
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
    >
      <template #actions-cell="{ row }">
        <UButton
          label="Edit"
          @click="openModal(row.original)"
        />
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
          label="Cancel"
          variant="subtle"
          @click="closeModal"
        />
        <UButton
          label="Save"
          color="success"
          type="submit"
          @click="saveUser(currentUser)"
        />
      </template>
    </UModal>
  </div>
</template>
