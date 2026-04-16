import { useMutation } from '@tanstack/react-query'
import {
  confirmResetPassword,
  login,
  register,
  resetPassword,
  sendPassword,
  type ConfirmResetPasswordPayload,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
} from '@/api/authApi'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/utils/apiError'

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterPayload) => register(data),
    onSuccess: () => {
      toast.success('تم إنشاء الحساب بنجاح')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: () => {
      toast.success('تم تسجيل الدخول بنجاح')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

export const useSendPassword = () =>
  useMutation({
    mutationFn: (email: string) => sendPassword(email),
    onSuccess: () => {
      toast.success('تم إرسال رمز التحقق إلى البريد الإلكتروني')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

export const useConfirmResetPassword = () =>
  useMutation({
    mutationFn: (data: ConfirmResetPasswordPayload) => confirmResetPassword(data),
    onSuccess: () => {
      toast.success('تم تأكيد الرمز بنجاح')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })

export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    onSuccess: () => {
      toast.success('تم إعادة تعيين كلمة المرور بنجاح')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
