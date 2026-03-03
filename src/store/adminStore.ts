import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { servicesData, casesData, aboutData } from '@/data/mockData'

// Mock data تم تعديلها لتكون متوافقة مع الـ interfaces
export const newsData = [
  {
    id: 1,
    titleAr: 'عنوان عربي',
    titleEn: 'English Title',
    descriptionAr: 'وصف عربي',
    descriptionEn: 'English description',
    content: 'محتوى عربي كامل',
    contentEn: 'Full English content',
    date: '2026-02-22',
    category: 'أخبار',
    categoryEn: 'News',
    image: '/path/to/image.jpg',
    author: 'المؤلف',
    authorEn: 'Author',
  },
]

export const internshipsData: Internship[] = [
  {
    id: 1,
    titleAr: 'برنامج التدريب - قانون تجاري',
    titleEn: 'Internship Program - Commercial Law',
    descriptionAr: 'وصف التدريب بالعربي',
    descriptionEn: 'Internship description in English',
    detailsAr: 'تفاصيل التدريب بالعربي',
    detailsEn: 'Internship details in English',
    requirements: [
      'طالب أو طالبة في كلية الحقوق',
      'معدل تراكمي لا يقل عن 3.0',
      'إتقان اللغة العربية والإنجليزية',
      'مهارات التواصل الجيدة',
      'الالتزام بالحضور المنتظم',
    ],
    duration: '3-6 أشهر',
    stipend: '1000 SAR',
    createdAt: '2026-02-01',
    status: 'active',
  },
  {
    id: 2,
    titleAr: 'برنامج التدريب - قانون تجاري متقدم',
    titleEn: 'Advanced Commercial Law Internship',
    descriptionAr: 'وصف التدريب المتقدم بالعربي',
    descriptionEn: 'Advanced internship description in English',
    detailsAr: 'تفاصيل التدريب المتقدم بالعربي',
    detailsEn: 'Advanced internship details in English',
    requirements: [
      'خبرة سنة على الأقل',
      'مهارات بحث قانوني ممتازة',
    ],
    duration: '6 أشهر',
    stipend: '1500 SAR',
    createdAt: '2026-03-01',
    status: 'active',
  },
]

export const jobsData = [
  {
    id: 1,
    titleAr: 'وظيفة عربي',
    titleEn: 'Job in English',
    descriptionAr: 'وصف الوظيفة بالعربي',
    descriptionEn: 'Job description in English',
    detailsAr: 'تفاصيل الوظيفة بالعربي',
    detailsEn: 'Job details in English',
    requirements: ['Requirement 1', 'Requirement 2'],
    salary: '5000 SAR',
    location: 'Riyadh',
    type: 'Full-time',
    createdAt: '2026-02-01',
    status: 'active', // 'active' أو 'inactive'
  },
]

export interface Service {
  id: number
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  icon: string
  features: string[]
  image: string
}

export interface Case {
  id: number
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  typeAr: string
  typeEn: string
  yearAr: string
  yearEn: string
  outcome: string
  outcomeEn: string
  image: string
}

export interface News {
  id: number
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  content: string
  contentEn: string
  date: string
  category: string
  categoryEn: string
  image: string
  author: string
  authorEn: string
}

export interface Internship {
  id: number
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  detailsAr: string
  detailsEn: string
  requirements: string[]
  duration: string
  stipend: string
  createdAt: string
  status: 'active' | 'inactive'
}

export interface Job {
  id: number
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  detailsAr: string
  detailsEn: string
  requirements: string[]
  salary: string
  location: string
  type: string
  createdAt: string
  status: string
}

export interface InternshipApplication {
  id: number
  internshipId: number
  internshipTitleAr: string
  name: string
  email: string
  phone: string
  university: string
  major: string
  gpa: string
  resumeName: string
  coverLetter: string
  submittedAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface Client {
  id: number
  nameAr: string
  nameEn: string
  email: string
  phone: string
  caseType: string
  status: 'active' | 'inactive' | 'completed'
  joinDate: string
  avatar: string
}
export interface ConsultationBooking {
  id: number
  name: string
  email: string
  phone: string
  service: string
  details: string
  attachment?: string

  status: 'new' | 'contacted' | 'completed'

  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentMethod?: string
  paymentReference?: string
  paymentDate?: string

  createdAt: string
}

interface AdminState {
  services: Service[]
  addService: (service: Omit<Service, 'id'>) => void
  updateService: (id: number, service: Partial<Service>) => void
  deleteService: (id: number) => void

  cases: Case[]
  addCase: (caseItem: Omit<Case, 'id'>) => void
  updateCase: (id: number, caseItem: Partial<Case>) => void
  deleteCase: (id: number) => void

  news: News[]
  addNews: (newsItem: Omit<News, 'id'>) => void
  updateNews: (id: number, newsItem: Partial<News>) => void
  deleteNews: (id: number) => void

  internships: Internship[]
  addInternship: (internship: Omit<Internship, 'id'>) => void
  updateInternship: (id: number, internship: Partial<Internship>) => void
  deleteInternship: (id: number) => void

  jobs: Job[]
  addJob: (job: Omit<Job, 'id'>) => void
  updateJob: (id: number, job: Partial<Job>) => void
  deleteJob: (id: number) => void

  aboutData: typeof aboutData
  updateAbout: (data: Partial<typeof aboutData>) => void

  clients: Client[]
  addClient: (client: Omit<Client, 'id'>) => void
  updateClient: (id: number, client: Partial<Client>) => void
  deleteClient: (id: number) => void

  applications: InternshipApplication[]
  addApplication: (app: Omit<InternshipApplication, 'id'>) => void
  updateApplicationStatus: (id: number, status: 'pending' | 'accepted' | 'rejected') => void
  deleteApplication: (id: number) => void

  consultations: ConsultationBooking[]

  addConsultation: (
    data: Omit<
      ConsultationBooking,
      | 'id'
      | 'status'
      | 'createdAt'
      | 'paymentStatus'
      | 'paymentDate'
    >
  ) => void
  updateConsultation: (id: number, data: Partial<ConsultationBooking>) => void
  updateConsultationStatus: (
    id: number,
    status: ConsultationBooking['status']
  ) => void

  updateConsultationPayment: (
    id: number,
    payment: {
      paymentStatus: 'pending' | 'paid' | 'failed'
      paymentMethod?: string
      paymentReference?: string
    }
  ) => void

  deleteConsultation: (id: number) => void
}

const generateId = () => Math.floor(Math.random() * 10000) + 1

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set) => ({
        services: servicesData as Service[],
        addService: (service) => set((state) => ({ services: [...state.services, { ...service, id: generateId() }] })),
        updateService: (id, service) => set((state) => ({ services: state.services.map(s => s.id === id ? { ...s, ...service } : s) })),
        deleteService: (id) => set((state) => ({ services: state.services.filter(s => s.id !== id) })),

        cases: casesData,
        addCase: (caseItem) => set((state) => ({ cases: [...state.cases, { ...caseItem, id: generateId() }] })),
        updateCase: (id, caseItem) => set((state) => ({ cases: state.cases.map(c => c.id === id ? { ...c, ...caseItem } : c) })),
        deleteCase: (id) => set((state) => ({ cases: state.cases.filter(c => c.id !== id) })),

        news: newsData,
        addNews: (newsItem) => set((state) => ({ news: [...state.news, { ...newsItem, id: generateId() }] })),
        updateNews: (id, newsItem) => set((state) => ({ news: state.news.map(n => n.id === id ? { ...n, ...newsItem } : n) })),
        deleteNews: (id) => set((state) => ({ news: state.news.filter(n => n.id !== id) })),

        internships: internshipsData,
        addInternship: (internship) => set((state) => ({ internships: [...state.internships, { ...internship, id: generateId() }] })),
        updateInternship: (id, internship) => set((state) => ({ internships: state.internships.map(i => i.id === id ? { ...i, ...internship } : i) })),
        deleteInternship: (id) => set((state) => ({ internships: state.internships.filter(i => i.id !== id) })),

        jobs: jobsData,
        addJob: (job) => set((state) => ({ jobs: [...state.jobs, { ...job, id: generateId() }] })),
        updateJob: (id, job) => set((state) => ({ jobs: state.jobs.map(j => j.id === id ? { ...j, ...job } : j) })),
        deleteJob: (id) => set((state) => ({ jobs: state.jobs.filter(j => j.id !== id) })),

        aboutData,
        updateAbout: (data) => set((state) => ({ aboutData: { ...state.aboutData, ...data } })),

        clients: [],
        addClient: (client) => set((state) => ({ clients: [...state.clients, { ...client, id: generateId() }] })),
        updateClient: (id, client) => set((state) => ({ clients: state.clients.map(c => c.id === id ? { ...c, ...client } : c) })),
        deleteClient: (id) => set((state) => ({ clients: state.clients.filter(c => c.id !== id) })),

        applications: [],
        addApplication: (app) => set((state) => ({ applications: [...state.applications, { ...app, id: generateId() }] })),
        updateApplicationStatus: (id, status) => set((state) => ({ applications: state.applications.map(app => app.id === id ? { ...app, status } : app) })),
        deleteApplication: (id) => set((state) => ({ applications: state.applications.filter(app => app.id !== id) })),

        consultations: [],

        addConsultation: (data) =>
          set((state) => ({
            consultations: [
              ...state.consultations,
              {
                ...data,
                id: generateId(),
                status: 'new',
                paymentStatus: 'pending',
                createdAt: new Date().toISOString(),
              },
            ],
          })),
        updateConsultation: (id, data) =>
          set((state) => ({
            consultations: state.consultations.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          })),
        updateConsultationStatus: (id, status) =>
          set((state) => ({
            consultations: state.consultations.map((c) =>
              c.id === id ? { ...c, status } : c
            ),
          })),

        updateConsultationPayment: (id, payment) =>
          set((state) => ({
            consultations: state.consultations.map((c) =>
              c.id === id
                ? {
                  ...c,
                  ...payment,
                  paymentDate:
                    payment.paymentStatus === 'paid'
                      ? new Date().toISOString()
                      : undefined,
                }
                : c
            ),
          })),

        deleteConsultation: (id) =>
          set((state) => ({
            consultations: state.consultations.filter((c) => c.id !== id),
          })),
      }),
      { name: 'admin-storage' }
    )
  )
)