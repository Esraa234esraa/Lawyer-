import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useAddContact } from '@/hooks/contacts'
import { toast } from 'sonner'

export default function Contact() {
  const { isArabic } = useLanguage()
  const addContactMutation = useAddContact()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const fullName = formData.name.trim()
    const phoneNumber = formData.phone.trim()
    const email = formData.email.trim()

    if (!fullName) {
      toast.error(isArabic ? 'الاسم الكامل مطلوب' : 'Full name is required')
      return false
    }

    if (!phoneNumber) {
      toast.error(isArabic ? 'رقم الهاتف مطلوب' : 'Phone number is required')
      return false
    }

    if (email && !emailPattern.test(email)) {
      toast.error(isArabic ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || addContactMutation.isPending) {
      return
    }

    try {
      await addContactMutation.mutateAsync({
        fullName: formData.name.trim(),
        phoneNumber: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        subject: formData.subject.trim() || undefined,
        mesage: formData.message.trim() || undefined,
      })

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch {
      // Toast is handled by the mutation hook.
    }
  }

  return (
    <div dir="rtl" className="pt-24">
      {/* Hero */}
      <section className="section-padding bg-charcoal">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </h1>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'نحن هنا لمساعدتك. تواصل معنا اليوم'
                : 'We are here to help you. Contact us today'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-primary-black">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 bg-charcoal border border-gold/20 rounded-lg text-right"
            >
              <Phone className="text-gold mb-4" size={32} />
              <h3 className="text-heading-3 font-cairo font-bold mb-2">
                {isArabic ? 'الهاتف' : 'Phone'}
              </h3>
              <p className="text-gray-300 font-cairo">+966 11 234 5678</p>
              <p className="text-gold text-sm font-cairo mt-2">24/7 Support</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="p-8 bg-charcoal border border-gold/20 rounded-lg text-right"
            >
              <Mail className="text-gold mb-4" size={32} />
              <h3 className="text-heading-3 font-cairo font-bold mb-2">
                {isArabic ? 'البريد الإلكتروني' : 'Email'}
              </h3>
              <p className="text-gray-300 font-cairo">info@lawfirm.sa</p>
              <p className="text-gold text-sm font-cairo mt-2">
                {isArabic ? 'رد سريع' : 'Quick Response'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="p-8 bg-charcoal border border-gold/20 rounded-lg text-right"
            >
              <MapPin className="text-gold mb-4" size={32} />
              <h3 className="text-heading-3 font-cairo font-bold mb-2">
                {isArabic ? 'العنوان' : 'Address'}
              </h3>
              <p className="text-gray-300 font-cairo">الرياض، المملكة العربية السعودية</p>
              <p className="text-gold text-sm font-cairo mt-2">
                {isArabic ? 'مكتب رئيسي' : 'Main Office'}
              </p>
            </motion.div>
          </div>

          {/* Contact Form & Map */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2">
                  {isArabic ? 'الاسم' : 'Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
                  placeholder={isArabic ? 'اسمك الكامل' : 'Your full name'}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-cairo font-semibold text-gold mb-2">
                    {isArabic ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-cairo font-semibold text-gold mb-2">
                    {isArabic ? 'الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
                    placeholder="+966..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2">
                  {isArabic ? 'الموضوع' : 'Subject'}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
                  placeholder={isArabic ? 'موضوع الرسالة' : 'Message subject'}
                />
              </div>

              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2">
                  {isArabic ? 'الرسالة' : 'Message'}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
                  placeholder={isArabic ? 'رسالتك' : 'Your message'}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={addContactMutation.isPending}
                className="w-full font-cairo"
              >
                {isArabic ? 'إرسال الرسالة' : 'Send Message'}
              </Button>
            </motion.form>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-lg border-2 border-gold/20 overflow-hidden h-full min-h-[500px]"
            >
              <div className="w-full h-full bg-primary-black flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.6847632597107!2d46.67530761534901!3d24.774265293975093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2efe1e7d3c3c3d%3A0x3c3c3c3c3c3c3c3c!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2ssa!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}