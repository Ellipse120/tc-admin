import { z } from 'zod'

export const userLoginSchema = z.object({
  email: z.email().trim(),
  role: z.enum(['teacher', 'student']),
  password: z.string().trim().optional()
})

export const materialSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['word', 'sentence', 'phrase']),
  content: z.string().min(1, '必填'),
  translation: z.string().min(1, '必填'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'])
})
