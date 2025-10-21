<script setup>
definePageMeta({
  layout: 'teacher',
  middleware: ['auth']
})

const toast = useToast()
const appConfig = useAppConfig()

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

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
const [isConfigModalOpen, toggleConfigModal] = useToggle()
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

const learningMaterialColumns = [
  {
    id: 'select',
    header: ({ table }) => h(UCheckbox, {
      'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'aria-label': 'Select all'
    }),
    cell: ({ row }) => h(UCheckbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': value => row.toggleSelected(!!value),
      'aria-label': 'Select row'
    }),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'type',
    header: '类型'
  },
  {
    accessorKey: 'content',
    header: '内容'
  },
  {
    accessorKey: 'translation',
    header: '翻译'
  },
  {
    accessorKey: 'difficulty',
    header: '难度'
  },
  {
    accessorKey: 'createdAt',
    header: '创建时间',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleString('zh-CN', {
        year: 'numeric',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }
  }
]

const learningMaterials = ref([])
const configLearningMaterials = async (user) => {
  currentUser.value = { ...user }
  const { data, pending } = await useAPI('/LearningMaterials/ListVocabularyMaterials')
  learningMaterials.value = data.value || []
  toggleConfigModal(true)
}

const closeConfigModal = () => {
  toggleConfigModal(false)
}

const confirmConfig = async (user) => {

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
            icon="i-lucide-file-user"
            variant="outline"
            color="success"
            size="sm"
            :loading="pending"
            loading-icon="i-lucide-loader"
            title="分配学习资料"
            @click="configLearningMaterials(row.original)"
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

    <UModal
      v-model:open="isModalOpen"
      :title="`${currentUser.id ? '编辑' : '添加'} `"
    >
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

    <UModal
      v-model:open="isConfigModalOpen"
      :title="`配置 ${currentUser.userName} 的学习资料`"
      :ui="{
        content: 'w-2xl!'
      }"
    >
      <template #body>
        <div>
          <UTable
            ref="configTable"
            :data="learningMaterials"
            :columns="learningMaterialColumns"
            sticky
          />
        </div>
      </template>

      <template #footer>
        <UButton
          label="取消"
          variant="subtle"
          @click="closeConfigModal"
        />
        <UButton
          label="确定"
          color="success"
          type="submit"
          @click="confirmConfig(currentUser)"
        />
      </template>
    </UModal>

    <UModal
      v-model:open="deleteModalOpen"
      title="提醒"
    >
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
