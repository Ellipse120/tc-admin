export default defineNuxtPlugin((nuxtApp) => {
  const userInfo = useCookie('userInfo')
  const userAuth = userInfo.value?.token

  const config = useRuntimeConfig()
  const toast = useToast()

  const api: typeof $fetch = $fetch.create({
    baseURL: config.public.apiUrl as string ?? 'http://localhost:3000/api',
    onRequest({ options }) {
      if (userAuth) {
        options.headers.set('Authorization', `Bearer ${userAuth}`)
      }
    },
    async onResponseError({ response }) {
      if (!response._data?.success) {
        toast.add({
          title: response._data?.message || '未知错误!接口可能未返回信息',
          color: 'error'
        })
      }

      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
