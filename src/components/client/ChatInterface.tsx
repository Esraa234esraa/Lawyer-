import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useClientStore } from '@/store/clientStore'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function ChatInterface() {
  const { isArabic } = useLanguage()
  const { user } = useAuth()
  const { messages, addMessage } = useClientStore()
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim()) {
      toast.error(isArabic ? 'يرجى كتابة رسالة' : 'Please write a message')
      return
    }

    setIsSending(true)

    // Add client message
    addMessage({
      sender: 'client',
      nameAr: user?.nameAr || 'أنا',
      nameEn: user?.nameEn || 'Me',
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isRead: true,
    })

    setInputMessage('')

    // Simulate admin response after a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const adminResponses = [
      'شكراً لرسالتك. سننظر في الأمر بسرعة.',
      'حسناً، سأتحقق من هذا الآن.',
      'شكراً على معلوماتك القيمة.',
      'يمكنك إرسال الملفات المطلوبة من قسم الملفات.',
      'سننتظر منك تلك الوثائق. شكراً لتعاونك.',
    ]

    const randomResponse =
      adminResponses[Math.floor(Math.random() * adminResponses.length)]

    addMessage({
      sender: 'admin',
      nameAr: 'د. فاطمة المحمد',
      nameEn: 'Dr. Fatima Al-Mohannadi',
      message: randomResponse,
      timestamp: new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isRead: false,
    })

    setIsSending(false)
  }

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="p-6 bg-charcoal border border-gold/20 rounded-lg flex flex-col h-[600px]"
      dir="rtl"
    >
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-gold/20">
        <h2 className="text-heading-2 font-cairo font-bold text-gold mb-2">
          {isArabic ? 'الدعم المباشر' : 'Live Support'}
        </h2>
        <p className="text-gray-400 font-cairo text-sm">
          {isArabic
            ? 'تواصل مع فريقنا مباشرة'
            : 'Get in touch with our team'}
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md ${
                  msg.sender === 'admin'
                    ? 'bg-gold/20 border border-gold/30 text-white'
                    : 'bg-primary-black border border-gold/10 text-gray-300'
                } p-4 rounded-2xl`}
              >
                {/* Sender Name */}
                <p
                  className={`text-xs font-cairo font-semibold mb-1 ${
                    msg.sender === 'admin' ? 'text-gold' : 'text-gray-400'
                  } text-right`}
                >
                  {isArabic ? msg.nameAr : msg.nameEn}
                </p>

                {/* Message Text */}
                <p className="font-cairo text-sm leading-relaxed text-right">
                  {msg.message}
                </p>

                {/* Timestamp */}
                <p
                  className={`text-xs mt-2 font-cairo text-right ${
                    msg.sender === 'admin'
                      ? 'text-gold/60'
                      : 'text-gray-500'
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSending || !inputMessage.trim()}
          className="px-4 py-3 bg-gold text-primary-black rounded-lg font-cairo font-semibold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send size={20} />
        </motion.button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            isArabic
              ? 'اكتب رسالتك هنا...'
              : 'Type your message here...'
          }
          className="flex-1 px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right placeholder-gray-500"
        />
      </form>
    </motion.div>
  )
}