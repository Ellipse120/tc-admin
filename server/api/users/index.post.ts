import { userLoginSchema } from '~/shared/zschema'

export default defineEventHandler(async (event) => {
  const userInfo = await readValidatedBody(event, userLoginSchema.parse)

  const appconfig = useAppConfig()
  const mockUsers = appconfig.mockData.mockUsers
  const user = mockUsers.find(u => u.email === userInfo.email && u.role === userInfo.role)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: '用户不存在或角色错误'
    })
  }

  await setUserSession(event, { user })

  const path = user?.role === 'teacher' ? '/teacher' : '/student'

  return {
    user,
    redirect: path
  }
  // return sendRedirect(event, path, 302)
})
