import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface CaseFile {
  id: number
  nameAr: string
  nameEn: string
  type: string
  size: string
  uploadedAt: string
  status: 'pending' | 'reviewed' | 'approved'
}

export interface ChatMessage {
  id: number
  sender: 'admin' | 'client'
  nameAr: string
  nameEn: string
  message: string
  timestamp: string
  isRead: boolean
}

interface ClientState {
  // Case Files
  caseFiles: CaseFile[]
  uploadFile: (file: Omit<CaseFile, 'id'>) => void
  updateFileStatus: (id: number, status: CaseFile['status']) => void
  deleteFile: (id: number) => void

  // Chat Messages
  messages: ChatMessage[]
  addMessage: (message: Omit<ChatMessage, 'id'>) => void
  markAsRead: (id: number) => void
}

const generateId = () => Math.floor(Math.random() * 10000) + 1

export const useClientStore = create<ClientState>()(
  devtools(
    persist(
      (set) => ({
        // Case Files
        caseFiles: [
          {
            id: 1,
            nameAr: 'عقد التوظيف',
            nameEn: 'Employment Contract',
            type: 'PDF',
            size: '2.4 MB',
            uploadedAt: '2024-02-15',
            status: 'approved',
          },
          {
            id: 2,
            nameAr: 'رسالة توضيحية',
            nameEn: 'Clarification Letter',
            type: 'DOCX',
            size: '1.2 MB',
            uploadedAt: '2024-02-18',
            status: 'reviewed',
          },
          {
            id: 3,
            nameAr: 'وثائق هوية',
            nameEn: 'Identity Documents',
            type: 'ZIP',
            size: '5.8 MB',
            uploadedAt: '2024-02-19',
            status: 'pending',
          },
        ],
        uploadFile: (file) =>
          set((state) => ({
            caseFiles: [...state.caseFiles, { ...file, id: generateId() }],
          })),
        updateFileStatus: (id, status) =>
          set((state) => ({
            caseFiles: state.caseFiles.map((f) =>
              f.id === id ? { ...f, status } : f
            ),
          })),
        deleteFile: (id) =>
          set((state) => ({
            caseFiles: state.caseFiles.filter((f) => f.id !== id),
          })),

        // Chat Messages
        messages: [
          {
            id: 1,
            sender: 'admin',
            nameAr: 'د. فاطمة المحمد',
            nameEn: 'Dr. Fatima Al-Mohannadi',
            message: 'السلام عليكم، تحية طيبة. كيف حالك؟ لقد استلمنا قضيتك وبدأنا بمراجعة الملفات.',
            timestamp: '09:30 صباحاً',
            isRead: true,
          },
          {
            id: 2,
            sender: 'client',
            nameAr: 'أحمد محمد',
            nameEn: 'Ahmed Mohammed',
            message: 'شكراً لك يا دكتورة. أنا في انتظار أخبار جديدة. هل هناك أي استفسارات إضافية؟',
            timestamp: '09:45 صباحاً',
            isRead: true,
          },
          {
            id: 3,
            sender: 'admin',
            nameAr: 'د. فاطمة المحمد',
            nameEn: 'Dr. Fatima Al-Mohannadi',
            message: 'نعم، نحتاج إلى بعض الوثائق الإضافية. يمكنك تحميلها من خلال قسم الملفات.',
            timestamp: '10:15 صباحاً',
            isRead: true,
          },
          {
            id: 4,
            sender: 'client',
            nameAr: 'أحمد محمد',
            nameEn: 'Ahmed Mohammed',
            message: 'حسناً، سأقوم بتحضير الوثائق وتحميلها الآن.',
            timestamp: '10:30 صباحاً',
            isRead: true,
          },
          {
            id: 5,
            sender: 'admin',
            nameAr: 'د. فاطمة المحمد',
            nameEn: 'Dr. Fatima Al-Mohannadi',
            message: 'شكراً لتعاونك. سنقوم بمراجعة الملفات الجديدة وسنتواصل معك خلال 48 ساعة.',
            timestamp: '10:45 صباحاً',
            isRead: true,
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
      }),
      {
        name: 'client-storage',
      }
    )
  )
)


// import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'

// export interface AdminChatMessage {
//   id: number
//   sender: 'admin' | 'client'
//   clientId: number
//   clientNameAr: string
//   clientNameEn: string
//   message: string
//   timestamp: string
//   isRead: boolean
// }

// export interface ClientConversation {
//   clientId: number
//   clientNameAr: string
//   clientNameEn: string
//   clientEmail: string
//   lastMessage: string
//   lastMessageTime: string
//   unreadCount: number
//   avatar: string
// }

// interface ChatStoreState {
//   // Admin conversations
//   conversations: ClientConversation[]
//   messages: AdminChatMessage[]
//   addMessage: (message: Omit<AdminChatMessage, 'id'>) => void
//   markAsRead: (id: number) => void
//   getConversationMessages: (clientId: number) => AdminChatMessage[]
//   getUnreadCount: (clientId: number) => number
// }

// const generateId = () => Math.floor(Math.random() * 10000) + 1

// export const useChatStore = create<ChatStoreState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         conversations: [
//           {
//             clientId: 1,
//             clientNameAr: 'أحمد محمد',
//             clientNameEn: 'Ahmed Mohammed',
//             clientEmail: 'ahmed@example.com',
//             lastMessage: 'شكراً على مساعدتك',
//             lastMessageTime: '11:30 صباحاً',
//             unreadCount: 0,
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client1',
//           },
//           {
//             clientId: 2,
//             clientNameAr: 'فاطمة أحمد',
//             clientNameEn: 'Fatima Ahmed',
//             clientEmail: 'fatima@example.com',
//             lastMessage: 'هل يمكنك مساعدتي؟',
//             lastMessageTime: '10:15 صباحاً',
//             unreadCount: 2,
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client2',
//           },
//         ],
//         messages: [
//           {
//             id: 1,
//             sender: 'client',
//             clientId: 1,
//             clientNameAr: 'أحمد محمد',
//             clientNameEn: 'Ahmed Mohammed',
//             message: 'السلام عليكم، أحتاج إلى استشارة قانونية',
//             timestamp: '09:00 صباحاً',
//             isRead: true,
//           },
//           {
//             id: 2,
//             sender: 'admin',
//             clientId: 1,
//             clientNameAr: 'د. فاطمة المحمد',
//             clientNameEn: 'Dr. Fatima Al-Mohannadi',
//             message: 'وعليكم السلام، كيف يمكنني مساعدتك؟',
//             timestamp: '09:15 صباحاً',
//             isRead: true,
//           },
//           {
//             id: 3,
//             sender: 'client',
//             clientId: 1,
//             clientNameAr: 'أحمد محمد',
//             clientNameEn: 'Ahmed Mohammed',
//             message: 'لدي مشكلة في عقد التوظيف الخاص بي',
//             timestamp: '09:30 صباحاً',
//             isRead: true,
//           },
//           {
//             id: 4,
//             sender: 'admin',
//             clientId: 1,
//             clientNameAr: 'د. فاطمة المحمد',
//             clientNameEn: 'Dr. Fatima Al-Mohannadi',
//             message: 'يمكنك إرسال العقد عبر قسم الملفات وسأقوم بمراجعته',
//             timestamp: '09:45 صباحاً',
//             isRead: true,
//           },
//         ],
//         addMessage: (message) =>
//           set((state) => ({
//             messages: [...state.messages, { ...message, id: generateId() }],
//           })),
//         markAsRead: (id) =>
//           set((state) => ({
//             messages: state.messages.map((m) =>
//               m.id === id ? { ...m, isRead: true } : m
//             ),
//           })),
//         getConversationMessages: (clientId) => {
//           const state = get()
//           return state.messages.filter((m) => m.clientId === clientId)
//         },
//         getUnreadCount: (clientId) => {
//           const state = get()
//           return state.messages.filter(
//             (m) => m.clientId === clientId && !m.isRead && m.sender === 'client'
//           ).length
//         },
//       }),
//       {
//         name: 'chat-storage',
//       }
//     )
//   )
// )