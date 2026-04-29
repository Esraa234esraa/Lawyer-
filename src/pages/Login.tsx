import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import Button from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()
  const { isArabic } = useLanguage()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onValidSubmit = async (values: LoginFormValues) => {
    const authenticatedUser = await login(values.email, values.password)
    navigate(authenticatedUser.role === 'admin' ? '/admin/dashboard' : '/client/dashboard')
  }

  const onInvalidSubmit = () => {
    const firstMessage =
      errors.email?.message || errors.password?.message || (isArabic ? 'تحقق من بيانات الدخول' : 'Please check your credentials')
    setError('root', { message: firstMessage })
  }

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      await onValidSubmit(values)
    } catch {
      setError('root', {
        message: error || (isArabic ? 'فشل تسجيل الدخول' : 'Login failed'),
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal via-primary-black to-charcoal pt-20" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-charcoal p-8 rounded-lg border border-gold/20">
          <h1 className="text-heading-2 text-gold text-center mb-8 font-cairo">
            {isArabic ? 'تسجيل الدخول' : 'Login'}
          </h1>

          <form onSubmit={handleSubmit(handleLoginSubmit, onInvalidSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gold mb-2 font-cairo">
                {isArabic ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
                placeholder="admin@lawfirm.ar"
                required
              />
            
            </div>

            <div>
              <label className="block text-sm font-semibold text-gold mb-2 font-cairo">
                {isArabic ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
                placeholder="••••••••"
                required
              />
              <div className="mt-2 text-right">
                <Link to="/password-reset" className="text-xs text-gold hover:text-gold-light transition-colors font-cairo">
                  {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
             
            </div>

            {(errors.root?.message || error) && (
              <p className="text-red-500 text-sm font-cairo text-right">{errors.root?.message || error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full font-cairo"
            >
              {isArabic ? 'دخول' : 'Sign In'}
            </Button>
          </form>

          {/* <p className="text-center text-gray-400 text-sm mt-6 font-cairo">
            {isArabic ? 'بيانات الاختبار أعلاه' : 'Test credentials above'}
          </p>

          <p className="text-center text-gray-400 text-sm mt-3 font-cairo">
            {isArabic ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            <Link to="/register" className="text-gold hover:text-gold-light transition-colors">
              {isArabic ? 'أنشئ حساب' : 'Create one'}
            </Link>
          </p> */}
        </div>
      </motion.div>
    </div>
  )
}