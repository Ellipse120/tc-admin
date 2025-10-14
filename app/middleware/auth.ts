export default defineNuxtRouteMiddleware(() => {
  const { checkIsLoggedIn } = useUser()

  if (!checkIsLoggedIn()) {
    return navigateTo('/login')
  }
})
