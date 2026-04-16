import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import Button from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '@/hooks/auth/useAuthMutations'

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'الاسم مطلوب'),
    userName: z.string().min(3, 'اسم المستخدم مطلوب'),
    email: z.string().email('البريد الإلكتروني غير صالح'),
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(/[A-Z]/, 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل')
      .regex(/[a-z]/, 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل')
      .regex(/[0-9]/, 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل')
      .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل'),
    confirmPassword: z.string().min(8, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const { isArabic } = useLanguage()
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        fullName: values.fullName,
        userName: values.userName,
        email: values.email,
        password: values.password,
      })

      navigate('/login')
    } catch (error) {
      setError('root', {
        message:
          error instanceof Error
            ? error.message
            : isArabic
              ? 'فشل إنشاء الحساب'
              : 'Register failed',
      })
    }
  }

  const onInvalidSubmit = () => {
    const firstMessage =
      errors.fullName?.message ||
      errors.userName?.message ||
      errors.email?.message ||
      errors.password?.message ||
      errors.confirmPassword?.message ||
      (isArabic ? 'تحقق من بيانات التسجيل' : 'Please check your register data')

    setError('root', { message: firstMessage })
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
            {isArabic ? 'إنشاء حساب جديد' : 'Create Account'}
          </h1>

          <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gold mb-2 font-cairo">
                {isArabic ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                {...register('fullName')}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
                placeholder={isArabic ? 'اكتب الاسم الكامل' : 'Enter full name'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gold mb-2 font-cairo">
                {isArabic ? 'اسم المستخدم' : 'Username'}
              </label>
              <input
                type="text"
                {...register('userName')}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
                placeholder={isArabic ? 'اكتب اسم المستخدم' : 'Enter username'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gold mb-2 font-cairo">
                {isArabic ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
                placeholder="example@academy.com"
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
                required
              />
            </div>

            {(errors.root?.message || registerMutation.error) && (
              <p className="text-red-500 text-sm font-cairo text-right">
                {errors.root?.message ||
                  (registerMutation.error instanceof Error
                    ? registerMutation.error.message
                    : isArabic
                      ? 'فشل إنشاء الحساب'
                      : 'Register failed')}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={registerMutation.isPending}
              disabled={registerMutation.isPending}
              className="w-full font-cairo"
            >
              {isArabic ? 'إنشاء الحساب' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6 font-cairo">
            {isArabic ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-gold hover:text-gold-light transition-colors">
              {isArabic ? 'تسجيل الدخول' : 'Login'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
