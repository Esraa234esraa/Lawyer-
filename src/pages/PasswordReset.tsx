import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import Button from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSendPassword, useConfirmResetPassword, useResetPassword } from '@/hooks/auth/useAuthMutations'

/**
 * Password Reset Flow:
 * Step 1: User enters email
 * Step 2: Verification code sent to email
 * Step 3: User enters code
 * Step 4: User enters new password
 * Step 5: Password reset confirmation
 */

// ============================================================================
// Form Schemas
// ============================================================================

const emailSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
})
type EmailFormValues = z.infer<typeof emailSchema>

const codeSchema = z.object({
  code: z.string().min(4, 'الرمز مطلوب'),
})
type CodeFormValues = z.infer<typeof codeSchema>

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
      .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل')
      .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل')
      .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على رمز خاص واحد على الأقل'),
    confirmPassword: z.string().min(8, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  })
type PasswordFormValues = z.infer<typeof passwordSchema>

// ============================================================================
// Step 1: Request Reset Code
// ============================================================================

function EmailStep({
  onSuccess,
  isLoading,
}: {
  onSuccess: (email: string) => void
  isLoading: boolean
}) {
  const { isArabic } = useLanguage()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <h2 className="text-heading-3 text-gold mb-6 font-cairo">
        {isArabic ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
      </h2>

      <form onSubmit={handleSubmit((data) => onSuccess(data.email))} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gold mb-2 font-cairo">
            {isArabic ? 'البريد الإلكتروني' : 'Email'}
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            placeholder="admin@lawfirm.ar"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-cairo text-right">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full font-cairo"
        >
          {isArabic ? 'إرسال رمز التحقق' : 'Send Verification Code'}
        </Button>
      </form>
    </motion.div>
  )
}

// ============================================================================
// Step 2: Verify Code
// ============================================================================

function CodeVerificationStep({
  email,
  onSuccess,
  onBack,
  isLoading,
}: {
  email: string
  onSuccess: (code: string) => void
  onBack: () => void
  isLoading: boolean
}) {
  const { isArabic } = useLanguage()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <h2 className="text-heading-3 text-gold mb-2 font-cairo">
        {isArabic ? 'تحقق من الرمز' : 'Verify Code'}
      </h2>
      <p className="text-gray-400 text-sm font-cairo mb-6">
        {isArabic ? `تم إرسال رمز إلى ${email}` : `A code has been sent to ${email}`}
      </p>

      <form onSubmit={handleSubmit((data) => onSuccess(data.code))} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gold mb-2 font-cairo">
            {isArabic ? 'الرمز' : 'Verification Code'}
          </label>
          <input
            type="text"
            {...register('code')}
            className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-center text-lg tracking-widest"
            placeholder="000000"
            disabled={isLoading}
            maxLength={6}
          />
          {errors.code && (
            <p className="text-red-500 text-xs mt-1 font-cairo text-right">{errors.code.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full font-cairo"
        >
          {isArabic ? 'تحقق من الرمز' : 'Verify Code'}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onBack}
          disabled={isLoading}
          className="w-full font-cairo"
        >
          {isArabic ? 'رجوع' : 'Back'}
        </Button>
      </form>
    </motion.div>
  )
}

// ============================================================================
// Step 3: Set New Password
// ============================================================================

function NewPasswordStep({
  onSuccess,
  onBack,
  isLoading,
}: {
  onSuccess: (password: string) => void
  onBack: () => void
  isLoading: boolean
}) {
  const { isArabic } = useLanguage()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <h2 className="text-heading-3 text-gold mb-6 font-cairo">
        {isArabic ? 'كلمة المرور الجديدة' : 'New Password'}
      </h2>

      <form
        onSubmit={handleSubmit((data) => onSuccess(data.password))}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold text-gold mb-2 font-cairo">
            {isArabic ? 'كلمة المرور الجديدة' : 'New Password'}
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 font-cairo text-right">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gold mb-2 font-cairo">
            {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 font-cairo text-right">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full font-cairo"
        >
          {isArabic ? 'تعيين كلمة المرور' : 'Set Password'}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onBack}
          disabled={isLoading}
          className="w-full font-cairo"
        >
          {isArabic ? 'رجوع' : 'Back'}
        </Button>
      </form>
    </motion.div>
  )
}

// ============================================================================
// Success Message
// ============================================================================

function SuccessMessage({ onContinue }: { onContinue: () => void }) {
  const { isArabic } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full text-center"
    >
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
          <span className="text-2xl">✓</span>
        </div>
      </div>

      <h2 className="text-heading-3 text-gold mb-2 font-cairo">
        {isArabic ? 'تم إعادة تعيين كلمة المرور' : 'Password Reset Successful'}
      </h2>

      <p className="text-gray-400 text-sm mb-8 font-cairo">
        {isArabic ? 'يمكنك الآن تسجيل الدخول برمز المرور الجديد' : 'You can now login with your new password'}
      </p>

      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={onContinue}
        className="w-full font-cairo"
      >
        {isArabic ? 'الذهاب إلى تسجيل الدخول' : 'Go to Login'}
      </Button>
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

type Step = 'email' | 'code' | 'password' | 'success'

export default function PasswordResetPage() {
  const navigate = useNavigate()
  const { isArabic } = useLanguage()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')

  // Mutations
  const sendPasswordMutation = useSendPassword()
  const confirmResetMutation = useConfirmResetPassword()
  const resetPasswordMutation = useResetPassword()

  // Determine loading state based on current step
  const isLoading =
    (step === 'email' && sendPasswordMutation.isPending) ||
    (step === 'code' && confirmResetMutation.isPending) ||
    (step === 'password' && resetPasswordMutation.isPending)

  // Handle email submission
  const handleEmailSubmit = async (submittedEmail: string) => {
    try {
      await sendPasswordMutation.mutateAsync(submittedEmail)
      setEmail(submittedEmail)
      setStep('code')
    } catch {
      // Error is automatically shown in toast
    }
  }

  // Handle code verification
  const handleCodeSubmit = async (submittedCode: string) => {
    try {
      await confirmResetMutation.mutateAsync({
        email,
        code: submittedCode,
      })
      setStep('password')
    } catch {
      // Error is automatically shown in toast
    }
  }

  // Handle password reset
  const handlePasswordSubmit = async (newPassword: string) => {
    try {
      await resetPasswordMutation.mutateAsync({
        email,
        password: newPassword,
      })
      setStep('success')
    } catch {
      // Error is automatically shown in toast
    }
  }

  // Handle success and redirect
  const handleSuccessRedirect = () => {
    navigate('/login')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal via-primary-black to-charcoal pt-20"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-charcoal p-8 rounded-lg border border-gold/20">
          {/* Progress Indicator */}
          {step !== 'success' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 font-cairo text-sm text-gray-400">
                <span className={step !== 'email' ? 'text-green-500' : 'text-gold'}>1</span>
                <div className={`flex-1 h-1 ${step !== 'email' ? 'bg-green-500' : 'bg-gold'}`} />
                <span className={step === 'password' || step === 'code' ? 'text-gold' : 'text-gray-600'}>
                  2
                </span>
                <div
                  className={`flex-1 h-1 ${step === 'password' ? 'bg-gold' : 'bg-gray-600'}`}
                />
                <span className={step === 'password' ? 'text-gold' : 'text-gray-600'}>
                  3
                </span>
              </div>
            </div>
          )}

          {/* Steps */}
          {step === 'email' && (
            <EmailStep onSuccess={handleEmailSubmit} isLoading={isLoading} />
          )}

          {step === 'code' && (
            <CodeVerificationStep
              email={email}
              onSuccess={handleCodeSubmit}
              onBack={() => setStep('email')}
              isLoading={isLoading}
            />
          )}

          {step === 'password' && (
            <NewPasswordStep
              onSuccess={handlePasswordSubmit}
              onBack={() => setStep('code')}
              isLoading={isLoading}
            />
          )}

          {step === 'success' && (
            <SuccessMessage onContinue={handleSuccessRedirect} />
          )}
        </div>

        {/* Back to Login Link */}
        {step !== 'success' && (
          <p className="text-center text-gray-400 text-sm mt-6 font-cairo">
            <button
              onClick={() => navigate('/login')}
              className="text-gold hover:text-gold-light transition-colors"
            >
              {isArabic ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
            </button>
          </p>
        )}
      </motion.div>
    </div>
  )
}
