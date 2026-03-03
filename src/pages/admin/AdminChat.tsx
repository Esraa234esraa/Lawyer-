import { motion } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle, Mail } from 'lucide-react'
import AdminChatPanel from '@/components/admin/AdminChatPanel'
import { useLanguage } from '@/hooks/useLanguage'
import { useChatStore, ClientConversation } from '@/store/chatStore'

export default function AdminChat() {
  const { isArabic } = useLanguage()
  const { conversations, getUnreadCount } = useChatStore()
  const [selectedClient, setSelectedClient] = useState<ClientConversation | null>(
    null
  )
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const handleOpenChat = (client: ClientConversation) => {
    setSelectedClient(client)
    setIsPanelOpen(true)
  }

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  )

  return (
    <div dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-heading-1 font-cairo font-bold text-gradient mb-4">
          {isArabic ? 'الدعم والشات' : 'Support & Chat'}
        </h1>

        {/* Stats */}
        <div className="flex gap-6">
          <div className="p-4 bg-charcoal border border-gold/20 rounded-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="text-right">
                <p className="text-gray-400 font-cairo text-sm">
                  {isArabic ? 'إجمالي العملاء' : 'Total Clients'}
                </p>
                <p className="text-3xl font-bold text-gold">
                  {conversations.length}
                </p>
              </div>
              <MessageCircle className="text-gold" size={32} />
            </div>
          </div>

          <div className="p-4 bg-charcoal border border-red-500/20 rounded-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="text-right">
                <p className="text-gray-400 font-cairo text-sm">
                  {isArabic ? 'رسائل جديد��' : 'New Messages'}
                </p>
                <p className="text-3xl font-bold text-red-400">
                  {totalUnread}
                </p>
              </div>
              <Mail className="text-red-400" size={32} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {conversations.map((client, idx) => {
          const unreadCount = getUnreadCount(client.clientId)
          return (
            <motion.div
              key={client.clientId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => handleOpenChat(client)}
              className="p-6 bg-charcoal border border-gold/20 rounded-lg hover:border-gold/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Client Info */}
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <div>
                      <h3 className="text-heading-3 font-cairo font-bold text-white group-hover:text-gold transition-colors">
                        {isArabic ? client.clientNameAr : client.clientNameEn}
                      </h3>
                      <p className="text-sm text-gray-400 font-cairo">
                        {client.clientEmail}
                      </p>
                    </div>
                    <img
                      src={client.avatar}
                      alt={client.clientNameAr}
                      className="w-12 h-12 rounded-full border-2 border-gold"
                    />
                  </div>

                  <p className="text-gray-400 font-cairo text-sm truncate">
                    {client.lastMessage}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-gray-500 font-cairo">
                    {client.lastMessageTime}
                  </p>
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold font-cairo"
                    >
                      {unreadCount}
                    </motion.div>
                  )}
                  <button className="px-3 py-1 bg-gold/20 text-gold rounded text-xs font-cairo font-semibold hover:bg-gold/30 transition-colors">
                    {isArabic ? 'فتح' : 'Open'}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Chat Panel */}
      {selectedClient && (
        <AdminChatPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          client={selectedClient}
        />
      )}
    </div>
  )
}