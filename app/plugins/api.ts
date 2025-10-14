export default defineNuxtPlugin((nuxtApp) => {
  const { user } = useUser()
  const userAuth = user.value?.token

  const config = useRuntimeConfig()

  const api: typeof $fetch = $fetch.create({
    baseURL: config.public.apiUrl as string ?? 'http://localhost:3000/api',
    onRequest({ options }) {
      if (userAuth) {
        options.headers.set('Authorization', `Bearer ${userAuth}`)
      }
    },
    async onResponseError({ response }) {
      // showNotify(`${response.status}: ${response._data?.message}`, {})
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
