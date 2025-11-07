import type { ResponseUser } from '~/shared/types'

export function useUser(userInfo?: ResponseUser) {
  const user = useCookie<ResponseUser | undefined>('userInfo', {})
  const appConfig = useAppConfig()

  if (userInfo) {
    user.value = userInfo
    refreshCookie('userInfo')
  }

  const isLoggedIn = computed(() => !!user?.value?.token)
  const isStu = computed(() => user.value?.user.role === appConfig.appInfo.roleEnum.student)

  const logout = () => {
    user.value = undefined
  }

  return {
    user,
    isLoggedIn,
    isStu,
    logout
  }
}
