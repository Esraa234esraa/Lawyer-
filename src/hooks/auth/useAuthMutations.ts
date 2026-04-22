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

/**
 * Register mutation with unified toast notifications
 * Shows success toast on successful registration
 * Shows error toast with backend message on failure
 */
export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterPayload) => register(data),
    onSuccess: (response) => {
      const successMessage = response?.message || 'تم إنشاء الحساب بنجاح'
      toast.success(successMessage)
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error)
      toast.error(errorMessage)
    },
  })

/**
 * Login mutation with unified toast notifications
 * Shows success toast on successful login
 * Shows error toast with backend message on failure
 */
export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: (response) => {
      const successMessage = response?.message || 'تم تسجيل الدخول بنجاح'
      toast.success(successMessage)
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error)
      toast.error(errorMessage)
    },
  })

/**
 * Send password reset code mutation
 * Shows success toast when code is sent
 * Shows error toast on failure
 */
export const useSendPassword = () =>
  useMutation({
    mutationFn: (email: string) => sendPassword(email),
    onSuccess: (response) => {
      const payloadMessage = typeof response?.data === 'string' ? response.data : undefined
      const successMessage = 
        payloadMessage && payloadMessage.length > 0
          ? payloadMessage
          : response?.message && response.message.length > 0
          ? response.message
          : 'تم إرسال رمز التحقق إلى البريد الإلكتروني'
      toast.success(successMessage)
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error)
      toast.error(errorMessage)
    },
  })

/**
 * Confirm password reset code mutation
 * Shows success toast when code is confirmed
 * Shows error toast on failure
 */
export const useConfirmResetPassword = () =>
  useMutation({
    mutationFn: (data: ConfirmResetPasswordPayload) => confirmResetPassword(data),
    onSuccess: (response) => {
      const payloadMessage = typeof response?.data === 'string' ? response.data : undefined
      const successMessage = 
        payloadMessage && payloadMessage.length > 0
          ? payloadMessage
          : response?.message && response.message.length > 0
          ? response.message
          : 'تم تأكيد الرمز بنجاح'
      toast.success(successMessage)
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error)
      toast.error(errorMessage)
    },
  })

/**
 * Reset password mutation
 * Shows success toast when password is reset
 * Shows error toast on failure
 */
export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    onSuccess: (response) => {
      const payloadMessage = typeof response?.data === 'string' ? response.data : undefined
      const successMessage = 
        payloadMessage && payloadMessage.length > 0
          ? payloadMessage
          : response?.message && response.message.length > 0
          ? response.message
          : 'تم إعادة تعيين كلمة المرور بنجاح'
      toast.success(successMessage)
    },
    onError: (error) => {
      const errorMessage = getApiErrorMessage(error)
      toast.error(errorMessage)
    },
  })
