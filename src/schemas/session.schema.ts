import { z } from 'zod'

export const sessionSchema = z.object({
  decision: z.string().trim().min(1, 'القرار مطلوب'),
  court: z.string().trim().min(1, 'المحكمة مطلوبة'),
  sessioNote: z.string().trim().min(1, 'ملاحظات الجلسة مطلوبة'),
  sessioNumber: z.string().trim().min(1, 'رقم الجلسة مطلوب'),
  sessionStatus: z.coerce.number().int().min(1, 'حالة الجلسة مطلوبة').max(7),
  sessionType: z.coerce.number().int().min(1, 'نوع الجلسة مطلوب').max(3),
  sessionDate: z.string().trim().min(1, 'تاريخ الجلسة مطلوب'),
  nextSessionDate: z.string().optional(),
  issueId: z.string().trim().min(1, 'يرجى اختيار قضية'),
  sessionFiles: z.array(z.instanceof(File)).optional(),
})

export type SessionFormInput = z.input<typeof sessionSchema>
export type SessionFormValues = z.output<typeof sessionSchema>
