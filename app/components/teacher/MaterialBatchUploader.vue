<script setup lang="ts">
// 假设的系统必填字段
const systemFields = ['单词/语句', '释义', '音标', '例句']

// 模拟上传的文件和其列头
const uploadedFileName = ref<string | null>(null)
const fileColumns = ref<string[]>([
  'Column A: Word',
  'Column B: Definition',
  'Column C: IPA',
  'Column D: Sentence'
])

// 字段映射状态 (使用 USelect 绑定)
const fieldMapping = ref<{ [key: string]: string | null }>({})

// 模拟数据校验结果
const totalRows = 200
const successRows = ref(195)
const errorRows = computed(() => totalRows - successRows.value)

// 错误详情仅用于模拟提示
// const errorDetails = ref([
//   { row: 15, data: 'ubiqutious', reason: '必填项“释义”为空' }
// ])

const isMappingComplete = computed(() => {
  // 检查所有必填项（单词/语句, 释义）是否已被映射
  return systemFields.slice(0, 2).every(field => fieldMapping.value[field])
})

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    uploadedFileName.value = input.files[0]!.name
    // 实际应在此处解析文件并提取列头和预览数据
    console.log(`File uploaded: ${uploadedFileName.value}`)
  }
}

const handleConfirmMapping = () => {
  if (errorRows.value > 0) {
    alert(`请先处理 ${errorRows.value} 条错误数据!`)
    return
  }
  if (!isMappingComplete.value) {
    alert('请完成所有必填字段的映射!')
    return
  }
  // 实际：调用 API 提交导入任务
  console.log('Final mapping and data submitted:', fieldMapping.value)
  alert('资料导入任务已提交，请等待系统处理...')
}

const handleDownloadTemplate = () => {
  alert('模板下载中...')
  // 实际：触发文件下载
}

const openErrorModal = () => {
  // 实际：打开一个 UModal 组件来展示 errorDetails
  console.log('打开错误详情模态框')
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-bold">
        批量导入单词资料
      </h2>
    </template>

    <UAlert
      icon="i-heroicons-light-bulb"
      color="primary"
      variant="subtle"
      title="导入指南"
      description="请下载标准模板，填写数据后上传。上传后请务必进行字段映射，以确保数据正确导入。"
      class="mb-6"
    >
      <template #footer>
        <UButton
          icon="i-heroicons-arrow-down-tray"
          size="sm"
          color="info"
          variant="solid"
          class="mt-2"
          @click="handleDownloadTemplate"
        >
          下载标准模板 (.xlsx)
        </UButton>
      </template>
    </UAlert>

    <UFormGroup
      label="文件上传"
      class="mb-8"
    >
      <div class="flex items-center space-x-4">
        <UInput
          type="file"
          accept=".xlsx,.csv"
          size="lg"
          placeholder="选择或拖拽文件"
          @change="handleFileUpload"
        />
        <span
          v-if="uploadedFileName"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          已选择：{{ uploadedFileName }}
        </span>
      </div>
    </UFormGroup>

    <div v-if="uploadedFileName">
      <h3 class="text-lg font-semibold mb-4">
        字段映射
      </h3>

      <div class="space-y-4 mb-6">
        <div
          v-for="field in systemFields"
          :key="field"
          class="flex items-center"
        >
          <span class="w-32 font-medium text-gray-700 dark:text-gray-300">
            {{ field }}
            <span
              v-if="field === '单词/语句' || field === '释义'"
              class="text-red-500"
            >*</span>
          </span>
          <USelect
            v-model="fieldMapping[field]"
            :options="fileColumns"
            placeholder="请选择对应的文件列..."
            :color="(field === '单词/语句' || field === '释义') && !fieldMapping[field] ? 'error' : 'info'"
            class="flex-1"
          />
        </div>
      </div>

      <UAlert
        :icon="errorRows > 0 ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-check-circle'"
        :color="errorRows > 0 ? 'error' : 'success'"
        variant="subtle"
        :title="errorRows > 0 ? '发现数据错误！' : '数据校验通过'"
        :description="`总行数: ${totalRows} | 成功行数: ${successRows} | 错误行数: ${errorRows}`"
        class="mb-6"
      >
        <template
          v-if="errorRows > 0"
          #footer
        >
          <UButton
            color="error"
            variant="solid"
            size="sm"
            class="mt-2"
            @click="openErrorModal"
          >
            查看并修正错误 ({{ errorRows }} 条)
          </UButton>
        </template>
      </UAlert>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t">
      <UButton
        variant="ghost"
        color="info"
      >
        取消
      </UButton>
      <UButton
        :disabled="!uploadedFileName || !isMappingComplete || errorRows > 0"
        :color="!uploadedFileName || !isMappingComplete || errorRows > 0 ? 'info' : 'primary'"
        icon="i-heroicons-cloud-arrow-up"
        @click="handleConfirmMapping"
      >
        确认导入
      </UButton>
    </div>
  </UCard>
</template>
