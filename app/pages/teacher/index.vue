<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { LearningMaterial, StatisticInfo } from '~/shared/types'
import { materialSchema } from '~/shared/zschema'

definePageMeta({
  layout: 'teacher'
})

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { $api } = useNuxtApp()

const { data: learningMaterials, refresh, pending } = await useAPI<LearningMaterial[]>('/LearningMaterials/ListVocabularyMaterials')
const [modalState, toggleModalState] = useToggle() // 控制编辑弹窗
const [deleteModalState, toggleDeleteModalState] = useToggle() // 控制编辑弹窗

const newMaterial = reactive<Partial<LearningMaterial>>({
  id: '',
  type: appConfig.appInfo.meterialTypeEnum.word,
  content: '',
  translation: '',
  phoneticSymbol: '',
  wordType: undefined,
  difficulty: appConfig.appInfo.difficultyLevelEnum.easy
})

const { data: statisticInfo } = await useAPI<StatisticInfo>('/Statistic')

const getDifficultyColor = (difficulty: number) => {
  switch (difficulty) {
    case appConfig.appInfo.difficultyLevelEnum.easy: return 'bg-green-100 text-green-800'
    case appConfig.appInfo.difficultyLevelEnum.medium: return 'bg-yellow-100 text-yellow-800'
    case appConfig.appInfo.difficultyLevelEnum.hard: return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getTypeIcon = (type: number) => {
  switch (type) {
    case appConfig.appInfo.meterialTypeEnum.word: return '📝'
    case appConfig.appInfo.meterialTypeEnum.sentense: return '💬'
    case appConfig.appInfo.meterialTypeEnum.phrase: return '🔤'
    default: return '📖'
  }
}

async function handleAddMaterial() {
  await $api('/LearningMaterials/CreateVocabularyMateria', {
    method: 'post',
    body: newMaterial
  })

  toast.add({
    title: '添加成功',
    color: 'success'
  })

  await refresh()
}

const editingMaterial = ref<Partial<LearningMaterial>>({
  id: '',
  type: undefined,
  content: '',
  translation: '',
  phoneticSymbol: '',
  wordType: undefined,
  difficulty: undefined,
  createdAt: '',
  createdBy: ''
})

const handleEdit = async (item: LearningMaterial) => {
  if (item.id) {
    const u = await $api<LearningMaterial>(`/LearningMaterials/getVocabularyMaterialById/${item.id}`)

    editingMaterial.value = u

    toggleModalState(true)
  }
}

const saveEditingMaterial = async () => {
  await $api('/LearningMaterials/UpdateVocabularyMaterial', {
    method: 'put',
    body: editingMaterial.value
  })

  toast.add({
    title: '修改成功',
    color: 'success'
  })
  toggleModalState(false)
  await refresh()
}

const handleDelete = (item: LearningMaterial) => {
  editingMaterial.value = { ...item }
  toggleDeleteModalState(true)
}

const closeDeleteModal = () => {
  toggleDeleteModalState(false)
}

const confirmDelete = async (item: LearningMaterial) => {
  const response: string = await $api(`/LearningMaterials/DeleteVocabularyMaterial/${item.id}`, {
    method: 'delete'
  })

  await refresh()
  toast.add({
    title: response || '删除成功',
    color: 'success'
  })
  toggleDeleteModalState(false)
}

// 统计数据
const students = ref(appConfig.mockData.mockUsers.filter(u => u.role === 'student'))
const studentProgressList = ref(appConfig.mockData.mockStudentProgress)
const totalMaterials = (learningMaterials.value as Array<LearningMaterial>)?.length || 0

const activeStudents = studentProgressList.value.filter((p) => {
  const lastStudy = new Date(p.lastStudyDate)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - lastStudy.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}).length

const averageAccuracy = studentProgressList.value.length > 0
  ? Math.round(studentProgressList.value.reduce((acc, p) => acc + (p.correctAnswers / p.totalStudied * 100), 0) / studentProgressList.value.length)
  : 0

const schema = materialSchema

const activeTab = ref(route.query.tab || 'account')
const items = [
  {
    label: '学习资料',
    icon: 'i-lucide-user',
    value: 'account',
    slot: 'material'
  },
  {
    label: '学生管理',
    icon: 'i-lucide-user-round-cog',
    value: 'student',
    slot: 'student'
  },
  {
    label: '数据分析',
    icon: 'i-lucide-trending-up',
    value: 'data',
    slot: 'data'
  }
]
const routeTab = useRouteQuery('tab')
watchEffect(() => {
  routeTab.value = activeTab.value as string
})

const materialTypes = appConfig.appInfo.materialTypes
const difficultyLevels = appConfig.appInfo.difficultyLevels
const wordTypes = appConfig.appInfo.wordTypes

const studentLevel = (student) => {
  return studentProgressList.value.find(p => p.studentId === student.id)?.level || 'beginner'
}

const studentProgress = (student) => {
  return studentProgressList.value.find(p => p.studentId === student.id)
}

const studentAccuracy = (student) => {
  const progress = studentProgress(student)
  return progress ? Math.round((progress.correctAnswers / progress.totalStudied) * 100) : 0
}

const studyRecords = ref(appConfig.mockData.mockStudyRecords)

// 统计资料分布
// 计算每个难度的资料数量
const materialCountByDifficulty = computed(() => {
  const counts = { beginner: 0, intermediate: 0, advanced: 0 }
  learningMaterials.value.forEach((material) => {
    if (material.difficulty in counts) {
      counts[material.difficulty]++
    }
  })
  return counts
})

const calcPercentage = (value) => {
  const total = totalMaterials
  return total > 0 ? Math.round((value / total) * 100) : 0
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
      <UCard class="flex items-center justify-start">
        <div>
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg flex items-center justify-center">
              <UIcon
                name="i-lucide-book-open-text"
                class="w-6 h-6 text-blue-600"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">
                学习资料
              </p>
              <p class="text-2xl font-bold">
                {{ statisticInfo?.totalMaterials }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <UCard class="flex items-center justify-start">
        <div>
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg flex items-center justify-center">
              <UIcon
                name="i-lucide-users"
                class="w-6 h-6 text-green-600"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">
                学生总数
              </p>
              <p class="text-2xl font-bold">
                {{ statisticInfo?.totalStudents }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <UCard class="flex items-center justify-start">
        <div>
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg flex items-center justify-center">
              <UIcon
                name="i-lucide-trending-up"
                class="w-6 h-6 text-orange-600"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">
                活跃学生
              </p>
              <p class="text-2xl font-bold">
                {{ statisticInfo?.activeStudents }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <UCard class="flex items-center justify-start">
        <div>
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg flex items-center justify-center">
              <UIcon
                name="i-lucide-award"
                class="w-6 h-6 text-purple-600"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">
                平均正确率
              </p>
              <p class="text-2xl font-bold">
                {{ statisticInfo?.averageAccuracy }}%
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <UTabs
      v-model="activeTab"
      :items="items"
      size="xl"
      variant="link"
    >
      <template #material>
        <div class="grid grid-cols-[1fr_3fr] gap-6 py-4">
          <UCard>
            <template #header>
              <div class="flex items-center">
                <UIcon
                  name="i-lucide-plus"
                  class="w-6 h-6 mr-2"
                />
                <h3 class="text-base font-semibold leading-6">
                  添加学习资料
                </h3>
              </div>
            </template>

            <UForm
              :schema="schema"
              :state="newMaterial"
              class="space-y-4 flex flex-col w-full"
              @submit="handleAddMaterial"
            >
              <UFormField
                label="类型"
                name="type"
              >
                <USelect
                  v-model="newMaterial.type"
                  :items="materialTypes"
                  placeholder="选择资料类型"
                />
              </UFormField>

              <UFormField
                v-if="newMaterial.type === appConfig.appInfo.meterialTypeEnum.word"
                label="音标"
                name="phoneticSymbol"
              >
                <UInput
                  v-model="newMaterial.phoneticSymbol"
                  placeholder="输入单词音标"
                />
              </UFormField>

              <UFormField
                v-if="newMaterial.type === appConfig.appInfo.meterialTypeEnum.word"
                label="词性"
                name="wordType"
              >
                <USelect
                  v-model="newMaterial.wordType"
                  :items="wordTypes"
                  placeholder="选择词性"
                />
              </UFormField>

              <UFormField
                label="内容"
                name="content"
                required
              >
                <UInput
                  v-model="newMaterial.content"
                  placeholder="输入英文内容"
                />
              </UFormField>
              <UFormField
                label="翻译"
                name="translation"
                required
              >
                <UInput
                  v-model="newMaterial.translation"
                  placeholder="输入中文翻译"
                />
              </UFormField>
              <UFormField
                label="难度"
                name="difficulty"
              >
                <USelect
                  v-model="newMaterial.difficulty"
                  :items="difficultyLevels"
                  placeholder="选择难度"
                />
              </UFormField>

              <UButton
                type="submit"
                icon="i-lucide-plus"
                class="w-full justify-center"
                label="添加资料"
              />
            </UForm>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-semibold leading-6">
                  学习资料列表
                </h3>
                <UIcon
                  name="i-lucide-refresh-ccw"
                  class="size-5 cursor-pointer"
                  :class="{ 'animate-spin': pending }"
                  title="点击刷新学习资料列表"
                  @click="refresh()"
                />
              </div>
            </template>

            <div class="space-y-4">
              <div
                v-for="(item, index) in learningMaterials"
                :key="index"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <div class="text-2xl">
                    {{ getTypeIcon(item.type) }}
                  </div>
                  <div>
                    <p class="text-lg">
                      {{ item.content }}
                    </p>
                    <p class="text-gray-600">
                      {{ item.translation }}
                    </p>
                    <div class="flex items-center space-x-2 mt-1">
                      <UBadge :class="getDifficultyColor(item.difficulty)">
                        {{ formatText(difficultyLevels, item.difficulty) }}
                      </UBadge>
                      <NuxtTime
                        :datetime="item.createdAt"
                        year="numeric"
                        month="long"
                        day="numeric"
                        hour="2-digit"
                        minute="2-digit"
                        second="2-digit"
                      />
                    </div>
                  </div>
                </div>

                <div class="space-x-2">
                  <UModal
                    v-model:open="modalState"
                    title="编辑"
                  >
                    <UButton
                      icon="i-lucide-edit"
                      variant="outline"
                      color="info"
                      size="sm"
                      @click="handleEdit(item)"
                    />

                    <template #body>
                      <UForm
                        :schema="schema"
                        :state="editingMaterial"
                        class="space-y-4 flex flex-col w-full"
                      >
                        <UFormField
                          label="类型"
                          name="type"
                        >
                          <USelect
                            v-model="editingMaterial.type"
                            :items="materialTypes"
                            placeholder="选择资料类型"
                            class="w-full"
                          />
                        </UFormField>

                        <UFormField
                          v-if="editingMaterial.type === appConfig.appInfo.meterialTypeEnum.word"
                          label="音标"
                          name="phoneticSymbol"
                        >
                          <UInput
                            v-model="editingMaterial.phoneticSymbol"
                            placeholder="输入单词音标"
                          />
                        </UFormField>

                        <UFormField
                          v-if="editingMaterial.type === appConfig.appInfo.meterialTypeEnum.word"
                          label="词性"
                          name="wordType"
                        >
                          <USelect
                            v-model="editingMaterial.wordType"
                            :items="wordTypes"
                            placeholder="选择词性"
                          />
                        </UFormField>

                        <UFormField
                          label="内容"
                          name="content"
                          required
                        >
                          <UInput
                            v-model="editingMaterial.content"
                            placeholder="输入英文内容"
                            class="w-full"
                          />
                        </UFormField>
                        <UFormField
                          label="翻译"
                          name="translation"
                          required
                        >
                          <UInput
                            v-model="editingMaterial.translation"
                            placeholder="输入中文翻译"
                            class="w-full"
                          />
                        </UFormField>
                        <UFormField
                          label="难度"
                          name="difficulty"
                        >
                          <USelect
                            v-model="editingMaterial.difficulty"
                            :items="difficultyLevels"
                            class="w-full"
                            placeholder="选择难度"
                          />
                        </UFormField>

                        <UButton
                          type="submit"
                          icon="i-lucide-save"
                          class="w-full justify-center"
                          label="保存修改"
                          @click="saveEditingMaterial"
                        />
                      </UForm>
                    </template>
                  </UModal>

                  <UModal
                    v-model:open="deleteModalState"
                    title="提醒"
                  >
                    <UButton
                      icon="i-lucide-trash"
                      variant="outline"
                      color="error"
                      size="sm"
                      @click="handleDelete(item)"
                    />

                    <template #header>
                      <h2>提醒</h2>
                    </template>

                    <template #body>
                      <div class="text-center text-xl">
                        确定删除学习资料： {{ editingMaterial.content }} 吗？
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
                        @click="confirmDelete(editingMaterial)"
                      />
                    </template>
                  </UModal>
                </div>
              </div>

              <div
                v-if="learningMaterials?.length === 0"
                class="p-6 text-center"
              >
                暂无数据
              </div>
            </div>
          </UCard>
        </div>
      </template>

      <template #student>
        <UCard class="mt-4">
          <template #header>
            <div class="flex items-center gap-4">
              <h3 class="text-base font-semibold leading-6">
                学生学习情况
              </h3>
              <UTooltip text="学生管理">
                <NuxtLink
                  to="/teacher/users"
                >
                  <UIcon
                    class="w-6 h-6"
                    name="i-lucide-user-round-cog"
                  />
                </NuxtLink>
              </UTooltip>

              <UTooltip text="学习计划">
                <NuxtLink
                  to="/teacher/learning-plan"
                >
                  <UIcon
                    class="w-6 h-6"
                    name="i-lucide-calendar-days"
                  />
                </NuxtLink>
              </UTooltip>
            </div>
          </template>

          <div class="space-y-4">
            <div
              v-for="(student, index) in students"
              :key="index"
              class="border border-gray-200 rounded-lg p-6"
            >
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-bold">
                    {{ student.name }}
                  </h3>
                  <p class="text-gray-600">
                    {{ student.email }}
                  </p>
                </div>
                <UBadge :class="getDifficultyColor(studentLevel(student))">
                  {{ studentLevel(student) === 'beginner' ? '初级'
                    : studentLevel(student) === 'intermediate' ? '中级' : '高级' }}
                </UBadge>
              </div>

              <div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div class="text-center">
                    <p class="text-2xl font-bold">
                      {{ studentProgress(student).totalStudied }}
                    </p>
                    <p class="text-sm text-gray-600">
                      已学习
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-green-600">
                      {{ studentAccuracy(student) }}%
                    </p>
                    <p class="text-sm text-gray-600">
                      正确率
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-orange-600">
                      {{ studentProgress(student).currentStreak }}
                    </p>
                    <p class="text-sm text-gray-600">
                      连续天数
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold">
                      {{ studentProgress(student).lastStudyDate }}
                    </p>
                    <p class="text-sm text-gray-600">
                      最后学习
                    </p>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span>学习进度</span>
                    <span class="font-bold">{{ studentProgress(student).correctAnswers }}/{{ studentProgress(student).totalStudied }}</span>
                  </div>
                  <UProgress
                    :model-value="studentAccuracy(student)"
                  />
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </template>

      <template #data>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          <UCard>
            <template #header>
              <h3 class="text-base font-semibold leading-6">
                学习统计
              </h3>
            </template>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span>总学习次数</span>
                <span class="text-xl">{{ studyRecords.length }}</span>
              </div>
              <USeparator />
              <div class="flex justify-between items-center">
                <span>平均正确率</span>
                <span class="text-xl text-green-600">{{ averageAccuracy }}%</span>
              </div>
              <USeparator />
              <div class="flex justify-between items-center">
                <span>活跃学生数</span>
                <span class="text-xl text-blue-600">{{ activeStudents }}</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-base font-semibold leading-6">
                资料分布
              </h3>
            </template>

            <div class="space-y-4">
              <div
                v-for="(value, key) in materialCountByDifficulty"
                :key="key"
                class="space-y-2"
              >
                <div class="flex justify-between">
                  <span>
                    {{ key === 'beginner' ? '初级'
                      : key === 'intermediate' ? '中级' : '高级' }}
                  </span>
                  <span>{{ value }} 项</span>
                </div>
                <UProgress
                  :model-value="calcPercentage(value)"
                  class="h-2"
                />
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </UTabs>
  </div>
</template>
