import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface AdminChatMessage {
  id: number
  sender: 'admin' | 'client'
  clientId: number
  clientNameAr: string
  clientNameEn: string
  message: string
  timestamp: string
  isRead: boolean
}

export interface ClientConversation {
  clientId: number
  clientNameAr: string
  clientNameEn: string
  clientEmail: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  avatar: string
}

interface ChatStoreState {
  // Admin conversations
  conversations: ClientConversation[]
  messages: AdminChatMessage[]
  addMessage: (message: Omit<AdminChatMessage, 'id'>) => void
  markAsRead: (id: number) => void
  getConversationMessages: (clientId: number) => AdminChatMessage[]
  getUnreadCount: (clientId: number) => number
}

const generateId = () => Math.floor(Math.random() * 10000) + 1

export const useChatStore = create<ChatStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        conversations: [
          {
            clientId: 1,
            clientNameAr: 'أحمد محمد',
            clientNameEn: 'Ahmed Mohammed',
            clientEmail: 'ahmed@example.com',
            lastMessage: 'شكراً على مساعدتك',
            lastMessageTime: '11:30 صباحاً',
            unreadCount: 0,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client1',
          },
          {
            clientId: 2,
            clientNameAr: 'فاطمة أحمد',
            clientNameEn: 'Fatima Ahmed',
            clientEmail: 'fatima@example.com',
            lastMessage: 'هل يمكنك مساعدتي؟',
            lastMessageTime: '10:15 صباحاً',
            unreadCount: 2,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client2',
          },
          {
            clientId: 3,
            clientNameAr: 'محمود علي',
            clientNameEn: 'Mahmoud Ali',
            clientEmail: 'mahmoud@example.com',
            lastMessage: 'شكراً للاستشارة القيمة',
            lastMessageTime: '09:00 صباحاً',
            unreadCount: 1,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client3',
          },
        ],
        messages: [
          {
            id: 1,
            sender: 'client',
            clientId: 1,
            clientNameAr: 'أحمد محمد',
            clientNameEn: 'Ahmed Mohammed',
            message: 'السلام عليكم، أحتاج إلى استشارة قانونية',
            timestamp: '09:00 صباحاً',
            isRead: true,
          },
          {
            id: 2,
            sender: 'admin',
            clientId: 1,
            clientNameAr: 'د. فاطمة المحمد',
            clientNameEn: 'Dr. Fatima Al-Mohannadi',
            message: 'وعليكم السلام، كيف يمكنني مساعدتك؟',
            timestamp: '09:15 صباحاً',
            isRead: true,
          },
          {
            id: 3,
            sender: 'client',
            clientId: 1,
            clientNameAr: 'أحمد محمد',
            clientNameEn: 'Ahmed Mohammed',
            message: 'لدي مشكلة في عقد التوظيف الخاص بي',
            timestamp: '09:30 صباحاً',
            isRead: true,
          },
          {
            id: 4,
            sender: 'admin',
            clientId: 1,
            clientNameAr: 'د. فاطمة المحمد',
            clientNameEn: 'Dr. Fatima Al-Mohannadi',
            message: 'يمكنك إرسال العقد عبر قسم الملفات وسأقوم بمراجعته',
            timestamp: '09:45 صباحاً',
            isRead: true,
          },
          {
            id: 5,
            sender: 'client',
            clientId: 1,
            clientNameAr: 'أحمد محمد',
            clientNameEn: 'Ahmed Mohammed',
            message: 'تمام، شكراً على مساعدتك',
            timestamp: '11:30 صباحاً',
            isRead: true,
          },
          // Client 2 messages
          {
            id: 6,
            sender: 'client',
            clientId: 2,
            clientNameAr: 'فاطمة أحمد',
            clientNameEn: 'Fatima Ahmed',
            message: 'السلام عليكم، هل يمكنك مساعدتي في قضيتي؟',
            timestamp: '10:00 صباحاً',
            isRead: false,
          },
          {
            id: 7,
            sender: 'client',
            clientId: 2,
            clientNameAr: 'فاطمة أحمد',
            clientNameEn: 'Fatima Ahmed',
            message: 'أرسلت لك الملفات المطلوبة',
            timestamp: '10:15 صباحاً',
            isRead: false,
          },
          // Client 3 messages
          {
            id: 8,
            sender: 'client',
            clientId: 3,
            clientNameAr: 'محمود علي',
            clientNameEn: 'Mahmoud Ali',
            message: 'شكراً على الاستشارة القيمة',
            timestamp: '09:00 صباحاً',
            isRead: false,
          },
        ],
        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, { ...message, id: generateId() }],
          })),
        markAsRead: (id) =>
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === id ? { ...m, isRead: true } : m
            ),
          })),
        getConversationMessages: (clientId) => {
          const state = get()
          return state.messages.filter((m) => m.clientId === clientId)
        },
        getUnreadCount: (clientId) => {
          const state = get()
          return state.messages.filter(
            (m) => m.clientId === clientId && !m.isRead && m.sender === 'client'
          ).length
        },
      }),
      {
        name: 'chat-storage',
      }
    )
  )
)