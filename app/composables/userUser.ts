import type { ResponseUser } from '~/shared/types'

export function useUser(userInfo?: ResponseUser) {
  const user = useCookie<ResponseUser | undefined>('userInfo', {})

  if (userInfo) {
    user.value = userInfo
  }

  const checkIsLoggedIn = () => !!user?.value?.token

  const logout = () => {
    user.value = undefined
  }

  return {
    user,
    checkIsLoggedIn,
    logout
  }
}
