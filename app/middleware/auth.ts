export default defineNuxtRouteMiddleware(async (to) => {
  const { user, isLoggedIn } = useUser()
  const appConfig = useAppConfig()

  if (to.path === '/login' && isLoggedIn.value) {
    const redirect = user.value?.user.role !== appConfig.appInfo.roleEnum.student ? '/teacher' : '/student'

    return navigateTo(redirect)
  }

  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }

  if (to.path.includes('/teacher') && user.value?.user.role === appConfig.appInfo.roleEnum.student) {
    return abortNavigation('只有教师账号才能访问')
  }

  if (to.path.includes('/student') && user.value?.user.role !== appConfig.appInfo.roleEnum.student) {
    return abortNavigation('只有学生账号才能访问')
  }
})
