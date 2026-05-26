import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import {
  sessionSchema,
  type SessionFormInput,
  type SessionFormValues,
} from '@/schemas/session.schema'
import { SESSION_STATUS_OPTIONS, SESSION_TYPE_OPTIONS } from '@/constants/sessions'
import type { Session } from '@/types/session'

interface IssueOption {
  id: string
  label: string
}

interface SessionFormProps {
  mode: 'create' | 'edit'
  initialSession?: Session
  issueOptions: IssueOption[]
  isPending?: boolean
  isArabic: boolean
  onSubmit: (values: SessionFormValues) => Promise<void>
  onCancel: () => void
}

const toDateInput = (value: string | null | undefined): string => {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}

export default function SessionForm({
  mode,
  initialSession,
  issueOptions,
  isPending = false,
  isArabic,
  onSubmit,
  onCancel,
}: SessionFormProps) {
  const defaultValues = useMemo<SessionFormValues>(
    () => ({
      decision: initialSession?.decision || '',
      court: initialSession?.court || '',
      sessioNote: initialSession?.sessioNote || '',
      sessioNumber: initialSession?.sessioNumber || '',
      sessionStatus: initialSession?.sessionStatus || 7,
      sessionType: initialSession?.sessionType || 2,
      sessionDate: toDateInput(initialSession?.sessionDate),
      nextSessionDate: toDateInput(initialSession?.nextSessionDate),
      issueId: initialSession?.issueId || issueOptions[0]?.id || '',
      sessionFiles: [],
    }),
    [initialSession, issueOptions]
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SessionFormInput, unknown, SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const selectedFiles = watch('sessionFiles') || []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="rtl">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label-gold">{isArabic ? 'القرار' : 'Decision'}</label>
          <input
            {...register('decision')}
            className="input-gold"
            placeholder={isArabic ? 'اكتب القرار' : 'Enter decision'}
            disabled={isPending}
          />
          {errors.decision && <p className="text-red-400 text-xs mt-1">{errors.decision.message}</p>}
        </div>

        <div>
          <label className="label-gold">{isArabic ? 'المحكمة' : 'Court'}</label>
          <input
            {...register('court')}
            className="input-gold"
            placeholder={isArabic ? 'اسم المحكمة' : 'Court name'}
            disabled={isPending}
          />
          {errors.court && <p className="text-red-400 text-xs mt-1">{errors.court.message}</p>}
        </div>

        <div>
          <label className="label-gold">{isArabic ? 'رقم الجلسة' : 'Session Number'}</label>
          <input
            {...register('sessioNumber')}
            className="input-gold"
            placeholder={isArabic ? 'مثال: 2026/15' : 'e.g. 2026/15'}
            disabled={isPending}
          />
          {errors.sessioNumber && <p className="text-red-400 text-xs mt-1">{errors.sessioNumber.message}</p>}
        </div>

        <div>
          <label className="label-gold">{isArabic ? 'القضية' : 'Issue'}</label>
          <select {...register('issueId')} className="input-gold" disabled={isPending || issueOptions.length === 0}>
            <option value="">{isArabic ? 'اختر قضية' : 'Select issue'}</option>
            {issueOptions.map((issue) => (
              <option key={issue.id} value={issue.id}>
                {issue.label}
              </option>
            ))}
          </select>
          {errors.issueId && <p className="text-red-400 text-xs mt-1">{errors.issueId.message}</p>}
        </div>

        <div>
          <label className="label-gold">{isArabic ? 'حالة الجلسة' : 'Session Status'}</label>
          <select {...register('sessionStatus', { valueAsNumber: true })} className="input-gold" disabled={isPending}>
            {SESSION_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {isArabic ? status.labelAr : status.labelEn}
              </option>
            ))}
          </select>
          {errors.sessionStatus && <p className="text-red-400 text-xs mt-1">{errors.sessionStatus.message}</p>}
        </div>

        <div>
          <label className="label-gold">{isArabic ? 'نوع الجلسة' : 'Session Type'}</label>
          <select {...register('sessionType', { valueAsNumber: true })} className="input-gold" disabled={isPending}>
            {SESSION_TYPE_OPTIONS.map((type) => (
              <option key={type.value} value={type.value}>
                {isArabic ? type.labelAr : type.labelEn}
              </option>
            ))}
          </select>
          {errors.sessionType && <p className="text-red-400 text-xs mt-1">{errors.sessionType.message}</p>}
        </div>

        <div>
          <label className="label-gold">{isArabic ? 'تاريخ الجلسة' : 'Session Date'}</label>
          <input {...register('sessionDate')} type="date" className="input-gold" disabled={isPending} />
          {errors.sessionDate && <p className="text-red-400 text-xs mt-1">{errors.sessionDate.message}</p>}
        </div>

        <div>
          <label className="label-gold">{isArabic ? 'تاريخ الجلسة القادمة' : 'Next Session Date'}</label>
          <input {...register('nextSessionDate')} type="date" className="input-gold" disabled={isPending} />
        </div>
      </div>

      <div>
        <label className="label-gold">{isArabic ? 'ملاحظات الجلسة' : 'Session Note'}</label>
        <textarea
          {...register('sessioNote')}
          className="input-gold min-h-[110px] resize-y"
          placeholder={isArabic ? 'اكتب ملاحظات الجلسة' : 'Enter session note'}
          disabled={isPending}
        />
        {errors.sessioNote && <p className="text-red-400 text-xs mt-1">{errors.sessioNote.message}</p>}
      </div>

      <div>
        <label className="label-gold">{isArabic ? 'المرفقات (متعدد)' : 'Attachments (multiple)'}</label>
        <input
          type="file"
          multiple
          accept="application/pdf,image/*"
          className="input-gold file:ml-3 file:rounded-md file:border-0 file:bg-gold/20 file:px-3 file:py-1 file:text-gold"
          disabled={isPending}
          onChange={(event) => {
            const fileList = event.target.files
            setValue('sessionFiles', fileList ? Array.from(fileList) : [])
          }}
        />

        {selectedFiles.length > 0 && (
          <div className="mt-3 grid gap-2">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="text-xs text-gray-300 bg-primary-black px-3 py-2 rounded-md border border-gold/20">
                {file.name}
              </div>
            ))}
          </div>
        )}

        {mode === 'edit' && (initialSession?.attachmentDtos?.length || 0) > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {isArabic
              ? 'سيتم الإبقاء على المرفقات الحالية ما لم تقم برفع ملفات جديدة.'
              : 'Current attachments remain unless you upload new files.'}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          {isArabic ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button type="submit" isLoading={isPending} disabled={isPending || issueOptions.length === 0}>
          {mode === 'create'
            ? isArabic
              ? 'إضافة الجلسة'
              : 'Create Session'
            : isArabic
            ? 'تحديث الجلسة'
            : 'Update Session'}
        </Button>
      </div>
    </form>
  )
}
