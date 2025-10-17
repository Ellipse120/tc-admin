import { z } from 'zod'

enum roleEnum {
  teacher = 4,
  assistant = 2,
  student = 8,
  admin = 1
}

enum meterialTypeEnum {
  word = 0,
  phrase = 1,
  sentense = 2
}

enum difficultyLevelEnum {
  easy = 0,
  medium = 1,
  hard = 2
}

export const userLoginSchema = z.object({
  email: z.email().trim(),
  role: z.enum(roleEnum),
  password: z.string().trim().optional()
})

export const materialSchema = z.object({
  id: z.string().optional(),
  type: z.enum(meterialTypeEnum),
  content: z.string().min(1, '必填'),
  translation: z.string().min(1, '必填'),
  difficulty: z.enum(difficultyLevelEnum)
})
