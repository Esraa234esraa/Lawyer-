import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Send, X } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useChatStore, ClientConversation } from '@/store/chatStore'
import { toast } from 'sonner'

interface AdminChatPanelProps {
  isOpen: boolean
  onClose: () => void
  client: ClientConversation
}

export default function AdminChatPanel({
  isOpen,
  onClose,
  client,
}: AdminChatPanelProps) {
  const { isArabic } = useLanguage()
  const { addMessage, getConversationMessages } =
    useChatStore()
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversationMessages = getConversationMessages(client.clientId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversationMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim()) {
      toast.error(isArabic ? 'يرجى كتابة رسالة' : 'Please write a message')
      return
    }

    setIsSending(true)

    addMessage({
      sender: 'admin',
      clientId: client.clientId,
      clientNameAr: client.clientNameAr,
      clientNameEn: client.clientNameEn,
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isRead: true,
    })

    setInputMessage('')
    setIsSending(false)

    // Simulate client response
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const clientResponses = [
      'شكراً على ردك السريع',
      'حسناً، سأقو�� بذلك الآن',
      'هل هناك أي متطلبات إضافية؟',
      'شكراً لك على المساعدة',
      'فهمت، سأرسل الملفات قريباً',
    ]

    const randomResponse =
      clientResponses[Math.floor(Math.random() * clientResponses.length)]

    addMessage({
      sender: 'client',
      clientId: client.clientId,
      clientNameAr: client.clientNameAr,
      clientNameEn: client.clientNameEn,
      message: randomResponse,
      timestamp: new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isRead: false,
    })
  }

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-20 w-96 h-screen bg-charcoal border-l border-gold/20 z-50 flex flex-col"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/20 flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <X size={24} />
              </motion.button>
              <div className="text-right flex-1">
                <h3 className="text-heading-3 font-cairo font-bold text-gold">
                  {isArabic ? client.clientNameAr : client.clientNameEn}
                </h3>
                <p className="text-xs text-gray-400 font-cairo">
                  {client.clientEmail}
                </p>
              </div>
              <img
                src={client.avatar}
                alt={client.clientNameAr}
                className="w-12 h-12 rounded-full border-2 border-gold"
              />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-6 custom-scrollbar">
              <AnimatePresence>
                {conversationMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`flex ${
                      msg.sender === 'admin' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-xs ${
                        msg.sender === 'admin'
                          ? 'bg-gold/20 border border-gold/30 text-white'
                          : 'bg-primary-black border border-gold/10 text-gray-300'
                      } p-3 rounded-2xl`}
                    >
                      <p className="font-cairo text-sm leading-relaxed text-right">
                        {msg.message}
                      </p>
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

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-6 border-t border-gold/20 flex gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="px-3 py-2 bg-gold text-primary-black rounded-lg font-cairo font-semibold hover:bg-gold-light disabled:opacity-50 transition-all"
              >
                <Send size={18} />
              </motion.button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isArabic ? 'اكتب رسالة...' : 'Type message...'}
                className="flex-1 px-3 py-2 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right text-sm placeholder-gray-500"
              />
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}