import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useConsultationClientsQuery } from '@/hooks/query/useConsultationClientsQuery'
import { useClientAttachmentsQuery } from '@/hooks/query/useClientAttachmentsQuery'
import { Plus, FileUp, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { useLanguage } from '@/hooks/useLanguage'
import { useAddIssue, useDeleteIssue, useGetAllIssues, useGetIssueTypes, useUpdateIssue } from '@/hooks/issues'
import { Issue, IssueClientInput, IssueSubmitInput } from '@/types/issues'
import { isValidGuid } from '@/services/issuesService'
import axiosInstance from '@/api/axiosInstance'
import ClientRow from '@/components/admin/ClientRow'
import { ConsultationClient, ClientAttachment } from '@/services/consultationClientService'
import { downloadAttachmentAsFile } from '@/utils/attachmentHelpers'

type IssueRow = {
  id: string
  titleAr: string
  defendantAr: string
  issueTypeId: string
  clientsCount: number
  attachmentsCount: number
}

type FormErrors = {
  titeleAr?: string
  defendant?: string
  issueTypeId?: string
  issueClients?: string
}

type IssueClientForm = {
  name: string
  nationalId: string
  nationalIdentityFile?: File
  nationalIdentityPath?: string
  selectedClientId?: string
  selectedAttachmentPaths?: string[]
}

type ClientAttachmentItem = {
  attachmentId: string
  attachmentIdPath: string
  isNational?: boolean
}

const ALLOWED_IDENTITY_MIME_TYPES = new Set(['image/jpeg', 'image/png'])
const ALLOWED_IDENTITY_EXTENSIONS = ['jpg', 'jpeg', 'png']

const isAllowedIdentityImage = (file: File): boolean => {
  if (ALLOWED_IDENTITY_MIME_TYPES.has(file.type)) return true

  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  return Boolean(fileExtension && ALLOWED_IDENTITY_EXTENSIONS.includes(fileExtension))
}

export default function AdminCases() {
  const { isArabic } = useLanguage()
  const navigate = useNavigate()

  const { data: issuesResponse, isLoading, isFetching } = useGetAllIssues()
  const { data: issueTypesResponse } = useGetIssueTypes()

  const consultationClientsQuery = useConsultationClientsQuery()

  const issues = issuesResponse?.data || []
  const issueTypes = issueTypesResponse?.data || []

  const addIssueMutation = useAddIssue()
  const deleteIssueMutation = useDeleteIssue()

  // Helper function to create a stable key for file comparison
  const getFileKey = (file: File): string => `${file.name}::${file.size}`

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const [titeleAr, setTiteleAr] = useState('')
  const [titeleEn, setTiteleEn] = useState('')
  const [defendant, setDefendant] = useState('')
  const [issueTypeId, setIssueTypeId] = useState('')
  const [issueAttachmentFiles, setIssueAttachmentFiles] = useState<File[]>([])
  const [issueClients, setIssueClients] = useState<IssueClientForm[]>([{ name: '', nationalId: '' }])
  const [activeClientIndex, setActiveClientIndex] = useState<number | null>(null)
  const [consultationDownloadedFiles, setConsultationDownloadedFiles] = useState<Record<string, File>>({})
  const [attachmentDownloadStatus, setAttachmentDownloadStatus] = useState<Record<string, 'idle' | 'loading' | 'error'>>({})
  const [attachmentDownloadError, setAttachmentDownloadError] = useState<Record<string, string>>({})

  const updateIssueMutation = useUpdateIssue(editingIssue?.id || '')

  const currentActiveClient = useMemo(
    () => (activeClientIndex !== null ? issueClients[activeClientIndex] : undefined),
    [activeClientIndex, issueClients]
  )

  const activeClientId = currentActiveClient?.selectedClientId
  const activeClientName = currentActiveClient?.name
  const clientAttachmentsQuery = useClientAttachmentsQuery(activeClientId, Boolean(activeClientId))
  const clientAttachments = Array.isArray(clientAttachmentsQuery.data)
    ? (clientAttachmentsQuery.data as ClientAttachment[])
    : []

  const normalizedClientAttachments = useMemo<ClientAttachmentItem[]>(() => {
    if (!Array.isArray(clientAttachments)) {
      return []
    }

    return clientAttachments.flatMap((attachment, attachmentIndex) => {
      const paths = Array.isArray(attachment.attachmentIdPath)
        ? attachment.attachmentIdPath
        : typeof attachment.attachmentIdPath === 'string'
        ? [attachment.attachmentIdPath]
        : []

      const attachmentItems = paths.map((path, index) => ({
        attachmentId: attachment.attachmentId || `${attachmentIndex}-${index}`,
        attachmentIdPath: path,
        isNational: false,
      }))

      if (attachment.nationalPath) {
        attachmentItems.push({
          attachmentId: attachment.attachmentId ? `${attachment.attachmentId}-national` : `${attachmentIndex}-national`,
          attachmentIdPath: attachment.nationalPath,
          isNational: true,
        })
      }

      return attachmentItems
    })
  }, [clientAttachments])

  const handleToggleClientAttachment = async (path: string, checked: boolean) => {
    if (activeClientIndex === null) return

    const index = activeClientIndex

    if (checked) {
      setAttachmentDownloadStatus((prev) => ({ ...prev, [path]: 'loading' }))
      setAttachmentDownloadError((prev) => ({ ...prev, [path]: '' }))

      try {
        let file = consultationDownloadedFiles[path]

        if (!file) {
          file = await downloadAttachmentAsFile(path)
          setConsultationDownloadedFiles((prev) => ({ ...prev, [path]: file }))
        }

        const isDuplicate = issueAttachmentFiles.some(
          (existing) => getFileKey(existing) === getFileKey(file)
        )

        if (!isDuplicate) {
          setIssueAttachmentFiles((prev) => [...prev, file])
        }

        setIssueClients((prev) =>
          prev.map((client, idx) =>
            idx === index
              ? {
                  ...client,
                  selectedAttachmentPaths: Array.from(new Set([...(client.selectedAttachmentPaths || []), path])),
                }
              : client
          )
        )

        toast.success('تم تحميل المرفق بنجاح')
        setAttachmentDownloadStatus((prev) => ({ ...prev, [path]: 'idle' }))
      } catch (error: any) {
        const message = error?.message || 'فشل تحميل المرفق'
        setAttachmentDownloadStatus((prev) => ({ ...prev, [path]: 'error' }))
        setAttachmentDownloadError((prev) => ({ ...prev, [path]: message }))
        toast.error(message)
      }

      return
    }

    setIssueClients((prev) =>
      prev.map((client, idx) =>
        idx === index
          ? {
              ...client,
              selectedAttachmentPaths: (client.selectedAttachmentPaths || []).filter((p) => p !== path),
            }
          : client
      )
    )

    const removedFile = consultationDownloadedFiles[path]
    if (removedFile) {
      setIssueAttachmentFiles((prev) =>
        prev.filter((existing) => getFileKey(existing) !== getFileKey(removedFile))
      )
      setConsultationDownloadedFiles((prev) => {
        const next = { ...prev }
        delete next[path]
        return next
      })
    }
  }

  const handleToggleClientNationalIdentityPath = (path: string, checked: boolean) => {
    if (activeClientIndex === null) return

    setIssueClients((prev) =>
      prev.map((client, idx) =>
        idx === activeClientIndex
          ? {
              ...client,
              nationalIdentityPath: checked ? path : client.nationalIdentityPath === path ? '' : client.nationalIdentityPath,
              nationalIdentityFile: checked ? undefined : client.nationalIdentityFile,
            }
          : client
      )
    )
  }

  const isPending =
    addIssueMutation.isPending ||
    updateIssueMutation.isPending ||
    deleteIssueMutation.isPending

  const rows = useMemo<IssueRow[]>(
    () =>
      issues.map((item) => ({
        id: item.id,
        titleAr: item.titeleAr,
        defendantAr: item.defendant,
        issueTypeId: item.issueTypeId,
        clientsCount: item.clients?.length || 0,
        attachmentsCount: item.attachments?.length || 0,
      })),
    [issues]
  )

  const getIssueTypeName = (id: string) => {
    const type = issueTypes.find((item) => item.id === id)
    return isArabic
      ? type?.nameAr || type?.nameEn || 'غير محدد'
      : type?.nameEn || type?.nameAr || 'غير متوفر'
  }

  const resetForm = () => {
    setTiteleAr('')
    setTiteleEn('')
    setDefendant('')
    setIssueTypeId(issueTypes[0]?.id || '')
    setIssueAttachmentFiles([])
    setIssueClients([{ name: '', nationalId: '' }])
    setActiveClientIndex(null)
    setErrors({})
  }

  const handleOpenModal = (issue?: Issue) => {
    if (issue) {
      setEditingIssue(issue)
      setTiteleAr(issue.titeleAr || '')
      setTiteleEn(issue.titeleEn || '')
      setDefendant(issue.defendant || '')
      setIssueTypeId(issue.issueTypeId || issueTypes[0]?.id || '')
      setIssueAttachmentFiles([])
      setIssueClients(
        issue.clients?.length
          ? issue.clients.map((client) => ({
              name: client.name,
              nationalId: String(client.nationalId),
              nationalIdentityFile: undefined,
              nationalIdentityPath: client.nationalIdentityPath,
              selectedClientId: undefined,
              selectedAttachmentPaths: [],
            }))
          : [{ name: '', nationalId: '' }]
      )
      setActiveClientIndex(null)
      setErrors({})
      setIsModalOpen(true)
      return
    }

    setEditingIssue(null)
    resetForm()
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    if (isPending) return
    setIsModalOpen(false)
    setEditingIssue(null)
    setErrors({})
  }

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIssueAttachmentFiles((prev) => [...prev, ...Array.from(files)])
  }

  const handleRemoveAttachment = (index: number) => {
    setIssueAttachmentFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addClientRow = () => {
    setIssueClients((prev) => [...prev, { name: '', nationalId: '' }])
  }

  const removeClientRow = (index: number) => {
    setIssueClients((prev) => prev.filter((_, i) => i !== index))
  }

  const updateClientField = (index: number, key: keyof IssueClientForm, value: string | File | undefined) => {
    setIssueClients((prev) =>
      prev.map((client, i) => {
        if (i !== index) return client

        if (key === 'name') {
          const typedName = String(value || '')
          const selected = ((consultationClientsQuery.data || []) as ConsultationClient[]).find(
            (c) => c.id === client.selectedClientId
          )

          if (client.selectedClientId && selected && typedName !== selected.fullName) {
            setActiveClientIndex((current) => (current === index ? null : current))
            return {
              ...client,
              name: typedName,
              selectedClientId: undefined,
              selectedAttachmentPaths: [],
            }
          }

          return {
            ...client,
            name: typedName,
          }
        }

        return {
          ...client,
          [key]: value,
        }
      })
    )
  }

  const handleSelectConsultationClient = async (index: number, clientId?: string) => {
    const clientsList = (consultationClientsQuery.data || []) as ConsultationClient[]
    const selected = clientsList.find((c) => c.id === clientId) as any

    // Pre-fill basic client fields from the selected consultation client if available
    setIssueClients((prev) =>
      prev.map((client, i) =>
        i === index
          ? {
              ...client,
              selectedClientId: clientId,
              name: selected ? selected.fullName : client.name,
              nationalId: selected && selected.nationalId ? String(selected.nationalId) : client.nationalId,
              nationalIdentityPath: selected && selected.nationalIdentityPath ? selected.nationalIdentityPath : client.nationalIdentityPath,
              nationalIdentityFile: undefined,
              selectedAttachmentPaths: [],
            }
          : client
      )
    )

    setActiveClientIndex(clientId ? index : null)
  }

  const validate = (): boolean => {
    const nextErrors: FormErrors = {}

    if (!titeleAr.trim()) {
      nextErrors.titeleAr = 'عنوان القضية مطلوب'
    }

    if (!defendant.trim()) {
      nextErrors.defendant = 'المدعي عليه مطلوب'
    }

    if (!isValidGuid(issueTypeId)) {
      nextErrors.issueTypeId = 'نوع القضية غير صالح'
    }

    const hasClientIdentity = (client: IssueClientForm) =>
      Boolean(client.nationalIdentityFile) || (client.nationalIdentityPath || '').trim().length > 0

    const hasAtLeastOneValidClient = issueClients.some((client) => {
      const hasValidId =
        client.name.trim().length > 0 &&
        client.nationalId.trim().length > 0 &&
        Number.isFinite(Number(client.nationalId.trim()))

      return hasValidId && hasClientIdentity(client)
    })

    if (!hasAtLeastOneValidClient) {
      nextErrors.issueClients = 'يجب إضافة عميل واحد على الأقل مع مسار الهوية الوطنية'
    }

    const hasMissingIdentityPath = issueClients.some((client) => {
      const hasValidId =
        client.name.trim().length > 0 &&
        client.nationalId.trim().length > 0 &&
        Number.isFinite(Number(client.nationalId.trim()))

      return hasValidId && !hasClientIdentity(client)
    })

    if (hasMissingIdentityPath) {
      nextErrors.issueClients = 'ملف الهوية الوطنية مطلوب لكل عميل'
    }

    const hasInvalidIdentityImage = issueClients.some(
      (client) => client.nationalIdentityFile && !isAllowedIdentityImage(client.nationalIdentityFile)
    )

    if (hasInvalidIdentityImage) {
      nextErrors.issueClients = 'الهوية الوطنية يجب أن تكون صورة بصيغة jpg أو jpeg أو png'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Prevent submitting while consultation attachment downloads are still in progress
    const anyDownloading = Object.values(attachmentDownloadStatus).some((s) => s === 'loading')
    if (anyDownloading) {
      toast.error('جاري تحميل مرفقات العميل. انتظر حتى انتهاء التحميل ثم أعد المحاولة')
      return
    }

    // Merge consultation-downloaded files with current uploaded files and dedupe
    const safeIssueFiles = issueAttachmentFiles || []
    const downloadedFiles = Object.values(consultationDownloadedFiles || {})
    const mergedFilesMap = new Map<string, File>()

    const addFileToMap = (file: File) => {
      if (file && file.name) {
        const key = getFileKey(file)
        if (!mergedFilesMap.has(key)) mergedFilesMap.set(key, file)
      }
    }

    if (Array.isArray(safeIssueFiles)) {
      safeIssueFiles.forEach(addFileToMap)
    }
    if (Array.isArray(downloadedFiles)) {
      downloadedFiles.forEach(addFileToMap)
    }

    const mergedFiles = Array.from(mergedFilesMap.values())

    const payload: IssueSubmitInput = {
      titeleAr: titeleAr.trim(),
      titeleEn: titeleEn.trim(),
      issueTypeId,
      defendant: defendant.trim(),
      issueAttachmentDTOs: mergedFiles,
      issueClients: issueClients
        .filter((client) => {
          const hasValidId =
            client.name.trim().length > 0 &&
            client.nationalId.trim().length > 0 &&
            Number.isFinite(Number(client.nationalId.trim()))
          const hasClientIdentity =
            Boolean(client.nationalIdentityFile) || (client.nationalIdentityPath || '').trim().length > 0
          return hasValidId && hasClientIdentity
        })
        .map<IssueClientInput>((client) => ({
          name: client.name.trim(),
          consultationClientId: client.selectedClientId,
          nationalId: client.selectedClientId ? Number(client.nationalId.trim()) || 0 : Number(client.nationalId.trim()),
          // Do NOT send selectedAttachmentPaths to backend — kept local only
          nationalIdentityPath: client.nationalIdentityPath?.trim(),
          nationalIdentityFile: client.nationalIdentityFile,
        })),
    }

    if (editingIssue) {
      await updateIssueMutation.mutateAsync(payload)
      setIsModalOpen(false)
      setEditingIssue(null)
      return
    }

    await addIssueMutation.mutateAsync(payload)
    setIsModalOpen(false)
    resetForm()
  }

  const handleDelete = async (row: IssueRow) => {
    await deleteIssueMutation.mutateAsync(row.id)
  }

  const columns: Column<IssueRow>[] = [
    {
      key: 'titleAr',
      labelAr: 'الاسم',
      labelEn: 'الاسم',
    },
    {
      key: 'defendantAr',
      labelAr: 'المدعي عليه',
      labelEn: 'المدعي عليه',
    },
    {
      key: 'issueTypeId',
      labelAr: 'النوع',
      labelEn: 'النوع',
      render: (value) => getIssueTypeName(String(value)),
    },
    {
      key: 'clientsCount',
      labelAr: 'عدد العملاء',
      labelEn: 'عدد العملاء',
    },
    {
      key: 'attachmentsCount',
      labelAr: 'عدد المرفقات',
      labelEn: 'عدد المرفقات',
    },
  ]

  const getIssueByRow = (row: IssueRow) => issues.find((item) => item.id === row.id)

  return (
    <div dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-heading-1 font-cairo font-bold text-gradient">إدارة القضايا</h1>
          <p className="text-gray-400 font-cairo text-sm">إجمالي القضايا: {rows.length}</p>
          {isFetching && <p className="text-gray-500 font-cairo text-xs mt-1">جاري تحديث البيانات...</p>}
        </div>
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="lg"
          className="font-cairo flex-row-reverse ms-auto"
          disabled={isPending}
        >
          <Plus size={20} className="me-2" />
          إضافة قضية
        </Button>
      </motion.div>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading || isFetching}
        loadingMessage={'جاري تحميل القضايا...'}
        onView={(row) => navigate(`/admin/cases/${row.id}`)}
        onEdit={(row) => {
          const issue = getIssueByRow(row)
          if (issue) handleOpenModal(issue)
        }}
        onDelete={handleDelete}
        deleteTitleAr="حذف القضية"
        deleteTitleEn="حذف"
        getDeleteLabel={(row) => row.titleAr}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="إضافة/تعديل قضية" titleAr="إضافة/تعديل قضية">
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">عنوان القضية</label>
            <input
              type="text"
              value={titeleAr}
              onChange={(e) => setTiteleAr(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
            />
            {errors.titeleAr && <p className="text-red-400 text-xs mt-2">{errors.titeleAr}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">المدعي عليه</label>
              <input
                type="text"
                value={defendant}
                onChange={(e) => setDefendant(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
              />
              {errors.defendant && <p className="text-red-400 text-xs mt-2">{errors.defendant}</p>}
            </div>

            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">نوع القضية</label>
              <select
                value={issueTypeId}
                onChange={(e) => setIssueTypeId(e.target.value)}
                className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
              >
                {issueTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {isArabic
                      ? type.nameAr || type.nameEn || 'غير محدد'
                      : type.nameEn || type.nameAr || 'N/A'}
                  </option>
                ))}
              </select>
              {errors.issueTypeId && <p className="text-red-400 text-xs mt-2">{errors.issueTypeId}</p>}
            </div>
          </div>

        <div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-cairo font-semibold text-gold text-right">العملاء</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => consultationClientsQuery.refetch()} className="text-xs text-gold hover:text-gold-light font-cairo">
                  تحديث العملاء
                </button>
                <button type="button" onClick={addClientRow} className="text-xs text-gold hover:text-gold-light font-cairo">
                  + إضافة عميل
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {issueClients.map((client, index) => (
                <div key={index}>
                  <ClientRow
                    client={client}
                    index={index}
                    clientsOptions={((consultationClientsQuery.data || []) as ConsultationClient[]).map((c) => ({ id: c.id, fullName: c.fullName }))}
                    onChangeField={(i, key, value) => updateClientField(i, key as any, value)}
                    onSelectClient={handleSelectConsultationClient}
                    onRemove={removeClientRow}
                  />
                </div>
              ))}
            </div>

            {errors.issueClients && <p className="text-red-400 text-xs mt-2">{errors.issueClients}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">مرفقات القضية</label>
            <div className="mb-4 space-y-3">
              <div className="p-4 border border-gold/30 rounded-lg bg-charcoal/20">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-cairo text-gold">مرفقات العميل المحدد</p>
                  {activeClientName && <span className="text-xs text-gray-400 font-cairo">{activeClientName}</span>}
                </div>

                {!activeClientId && (
                  <p className="text-sm text-gray-400 font-cairo">اختر عميل استشارات من الأعلى لعرض مرفقاته هنا</p>
                )}

                {activeClientId && clientAttachmentsQuery.isLoading && (
                  <p className="text-sm text-gray-400 font-cairo">جاري تحميل مرفقات العميل...</p>
                )}

                {activeClientId && clientAttachmentsQuery.isError && (
                  <p className="text-sm text-red-400 font-cairo">حدث خطأ في جلب مرفقات العميل</p>
                )}

                {activeClientId && !clientAttachmentsQuery.isLoading && clientAttachments.length === 0 && (
                  <p className="text-sm text-gray-400 font-cairo">لا توجد مرفقات لهذا العميل</p>
                )}

                {activeClientId && normalizedClientAttachments.length > 0 && (
                  <div className="space-y-2">
                    {normalizedClientAttachments.map((attachment) => (
                      <div key={attachment.attachmentId} className="flex items-center justify-between p-3 bg-charcoal/50 rounded border border-gold/20">
                        <div className="flex-1 text-right">
                          <a
                            href={`${axiosInstance.defaults.baseURL || ''}${attachment.attachmentIdPath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-cairo text-white underline"
                          >
                            {attachment.attachmentIdPath.split('/').pop()}
                          </a>
                          <p className="text-xs text-gray-400 mt-1">
                            {attachment.isNational ? 'هوية وطنية' : 'مرفق العميل'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <label className="flex items-center gap-2 text-sm text-white font-cairo">
                            <input
                              type="checkbox"
                              checked={
                                attachment.isNational
                                  ? currentActiveClient?.nationalIdentityPath === attachment.attachmentIdPath
                                  : (currentActiveClient?.selectedAttachmentPaths || []).includes(
                                      attachment.attachmentIdPath
                                    )
                              }
                              onChange={(e) =>
                                attachment.isNational
                                  ? handleToggleClientNationalIdentityPath(attachment.attachmentIdPath, e.target.checked)
                                  : handleToggleClientAttachment(attachment.attachmentIdPath, e.target.checked)
                              }
                            />
                            {attachment.isNational ? 'اختر الهوية الوطنية' : 'اختيار'}
                          </label>
                          {attachmentDownloadStatus[attachment.attachmentIdPath] === 'loading' && (
                            <span className="text-xs text-gray-400 font-cairo">جاري التحميل...</span>
                          )}
                          {attachmentDownloadStatus[attachment.attachmentIdPath] === 'error' && (
                            <span className="text-xs text-red-400 font-cairo">
                              {attachmentDownloadError[attachment.attachmentIdPath]}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gold/30 rounded-lg hover:border-gold cursor-pointer transition-colors">
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                  <FileUp size={24} className="text-gold mb-2" />
                  <p className="text-sm font-cairo text-gold">اضغط لرفع ملفات</p>
                </div>
                <input type="file" multiple onChange={handleAttachmentUpload} className="hidden" />
              </label>

              {issueAttachmentFiles.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {issueAttachmentFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-3 bg-charcoal/50 rounded border border-gold/20"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-cairo text-white">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isPending}
              className="px-6 py-2 rounded border border-gold/30 text-gray-300 font-cairo hover:border-gold transition-colors disabled:opacity-60"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 rounded bg-gradient-to-r from-gold to-gold-light text-primary-black font-cairo font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isPending ? 'جاري الحفظ...' : editingIssue ? 'تحديث' : 'إضافة'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
