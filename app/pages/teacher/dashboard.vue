<script setup lang="ts">
// 假设的数据接口定义
interface KeyMetric {
  title: string
  value: string
  trend: 'up' | 'down' | 'stable'
  color: 'green' | 'blue' | 'yellow' | 'red' // 使用 Nuxt UI 颜色
}

// 模拟关键指标数据
const metrics = ref<KeyMetric[]>([
  { title: '今日活跃学生', value: '85 / 100', trend: 'up', color: 'green' },
  { title: '平均学习时长', value: '30 分钟', trend: 'up', color: 'blue' },
  { title: '资料平均完成率', value: '65%', trend: 'stable', color: 'yellow' },
  { title: '需关注学生', value: '5 人', trend: 'down', color: 'red' }
])

// 模拟图表数据
const weeklyStudyData = ref([120, 150, 140, 180, 200, 160, 190])

// 模拟待办事项
const todos = ref([
  { id: 1, type: '审核', content: '《雅思核心词汇》待发布', status: '待处理', color: 'indigo' },
  { id: 2, type: '跟进', content: '学生李明，连续 3 天未打卡', status: '需关注', color: 'red' }
])

const trendIcon = (trend: KeyMetric['trend']) => {
  if (trend === 'up') return 'i-heroicons-arrow-trending-up'
  if (trend === 'down') return 'i-heroicons-arrow-trending-down'
  return 'i-heroicons-minus'
}

const handleViewStudent = (id: number) => {
  console.log(`处理待办事项 ID: ${id}`)
  // navigateTo(`/teacher/todos/${id}`);
}
</script>

<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      教师仪表盘
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <UCard
        v-for="metric in metrics"
        :key="metric.title"
        :ui="{ header: { padding: 'p-4' }, body: { padding: 'p-4' } }"
      >
        <template #header>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ metric.title }}
          </p>
        </template>
        <p class="text-4xl font-semibold flex items-center">
          {{ metric.value }}
        </p>
        <template #footer>
          <UBadge
            :color="metric.color"
            variant="subtle"
            :icon="trendIcon(metric.trend)"
          >
            {{ metric.trend === 'up' ? '趋势上升' : metric.trend === 'down' ? '趋势下降' : '趋势平稳' }}
          </UBadge>
        </template>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-2">
        <template #header>
          <h2 class="text-xl font-semibold">
            近 7 周平均学习趋势 (分钟)
          </h2>
        </template>
        <div class="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
          图表占位：折线图展示 {{ weeklyStudyData.join(', ') }}
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            待办事项
          </h2>
        </template>
        <div class="space-y-3">
          <div
            v-for="item in todos"
            :key="item.id"
            class="p-3 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800"
          >
            <div>
              <UBadge
                :color="item.color as any"
                variant="subtle"
                class="mb-1"
              >
                {{ item.type }}
              </UBadge>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ item.content }}
              </p>
            </div>
            <UButton
              icon="i-heroicons-arrow-right-circle"
              size="sm"
              variant="link"
              color="indigo"
              @click="handleViewStudent(item.id)"
            >
              处理
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
