import { motion } from 'framer-motion'
import { useState } from 'react'
import { Upload } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore } from '@/store/adminStore'
// import { internshipsData } from '@/data/internshipData'
import { internshipsData } from '@/store/adminStore'
import { toast } from 'sonner'

export default function Internship() {
  const { isArabic } = useLanguage()
  const { addApplication } = useAdminStore()

  // اختيار التدريب
  const [selectedInternshipId, setSelectedInternshipId] = useState<number>(internshipsData[0].id)
  const selectedInternship = internshipsData.find(i => i.id === selectedInternshipId)!

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    gpa: '',
    resume: null as File | null,
    coverLetter: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }))
      toast.success(
        isArabic
          ? `تم تحميل الملف: ${file.name}`
          : `File uploaded: ${file.name}`
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.resume) {
      toast.error(isArabic ? 'يرجى تحميل السيرة الذاتية' : 'Please upload your resume')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    addApplication({
      internshipId: selectedInternship.id,
      internshipTitleAr: selectedInternship.titleAr,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      university: formData.university,
      major: formData.major,
      gpa: formData.gpa,
      resumeName: formData.resume.name,
      coverLetter: formData.coverLetter,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    })

    toast.success(
      isArabic
        ? 'تم استقبال طلب التدريب بنجاح'
        : 'Your internship application has been received successfully'
    )

    setFormData({
      name: '',
      email: '',
      phone: '',
      university: '',
      major: '',
      gpa: '',
      resume: null,
      coverLetter: '',
    })
    setIsLoading(false)
  }

  return (
    <div dir="rtl" className="pt-24">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-charcoal via-primary-black to-charcoal">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'برنامج التدريب' : 'Internship Program'}
            </h1>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'انضم إلى فريقنا وطور مهاراتك القانونية تحت إشراف محامين متخصصين'
                : 'Join our team and develop your legal skills under the guidance of specialized lawyers'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-charcoal">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-right"
            >
              {/* اختيار التدريب */}
              <select
                value={selectedInternshipId}
                onChange={(e) => setSelectedInternshipId(Number(e.target.value))}
                className="mb-6 px-4 py-2 rounded border border-gold bg-charcoal text-white font-cairo"
              >
                {internshipsData.map(internship => (
                  <option key={internship.id} value={internship.id}>
                    {isArabic ? internship.titleAr : internship.titleEn}
                  </option>
                ))}
              </select>

              <h2 className="text-heading-2 font-cairo font-bold mb-8 text-gold">
                {isArabic ? 'عن البرنامج' : 'About the Program'}
              </h2>

              <div className="mb-8">
                <h3 className="text-heading-3 font-cairo font-bold mb-4 text-gold">
                  {isArabic ? 'المدة' : 'Duration'}
                </h3>
                <p className="text-gray-300 font-cairo">{selectedInternship.duration}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-heading-3 font-cairo font-bold mb-4 text-gold">
                  {isArabic ? 'المتطلبات' : 'Requirements'}
                </h3>
                <ul className="space-y-2">
                  {selectedInternship.requirements.map((req, idx) => (
                    <li key={idx} className="text-gray-300 font-cairo flex items-center gap-2 justify-end">
                      <span>{req}</span>
                      <span className="text-gold">✓</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* {selectedInternship. && (
                <div>
                  <h3 className="text-heading-3 font-cairo font-bold mb-4 text-gold">
                    {isArabic ? 'الفوائد' : 'Benefits'}
                  </h3>
                  <ul className="space-y-2">
                    {selectedInternship.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="text-gray-300 font-cairo flex items-center gap-2 justify-end">
                        <span>{benefit}</span>
                        <span className="text-gold">✓</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 bg-primary-black border-2 border-gold/20 rounded-lg"
            >
              <h2 className="text-heading-2 font-cairo font-bold mb-6 text-gold text-right">
                {isArabic ? 'تقديم الطلب' : 'Apply Now'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                    {isArabic ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right placeholder-gray-500"
                    placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                      {isArabic ? 'البريد الإلكتروني *' : 'Email *'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right placeholder-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                      {isArabic ? 'الهاتف *' : 'Phone *'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right placeholder-gray-500"
                      placeholder="+966..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                      {isArabic ? 'الجامعة *' : 'University *'}
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right placeholder-gray-500"
                      placeholder={isArabic ? 'اسم الجامعة' : 'University name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                      {isArabic ? 'التخصص *' : 'Major *'}
                    </label>
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right placeholder-gray-500"
                      placeholder={isArabic ? 'تخصصك' : 'Your major'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                    {isArabic ? 'المعدل التراكمي *' : 'GPA *'}
                  </label>
                  <input
                    type="number"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="4"
                    required
                    className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right placeholder-gray-500"
                    placeholder="3.8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                    {isArabic ? 'السيرة الذاتية (PDF/DOC) *' : 'Resume (PDF/DOC) *'}
                  </label>
                  <label className="flex items-center justify-center gap-3 px-4 py-4 bg-charcoal border-2 border-dashed border-gold/30 rounded-lg hover:border-gold/50 transition-colors cursor-pointer text-right">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                    />
                    <Upload size={20} className="text-gold" />
                    <span className="text-gold font-cairo">
                      {formData.resume
                        ? formData.resume.name
                        : isArabic
                          ? 'اختر الملف'
                          : 'Choose file'}
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                    {isArabic ? 'رسالة التقديم' : 'Cover Letter'}
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right placeholder-gray-500 resize-none"
                    placeholder={isArabic ? 'أخبرنا عن نفسك...' : 'Tell us about yourself...'}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full font-cairo"
                >
                  {isArabic ? 'إرسال الطلب' : 'Submit Application'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}