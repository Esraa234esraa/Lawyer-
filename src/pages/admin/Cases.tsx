import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Plus, FileUp, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { useLanguage } from '@/hooks/useLanguage'
import { useAddIssue, useDeleteIssue, useGetAllIssues, useGetIssueTypes, useUpdateIssue } from '@/hooks/issues'
import { Issue, IssueClientInput, IssueSubmitInput } from '@/types/issues'
import { buildIssueFormData, isValidGuid } from '@/services/issuesService'

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
}

export default function AdminCases() {
  const { isArabic } = useLanguage()
  const navigate = useNavigate()

  const { data: issuesResponse, isLoading, isFetching } = useGetAllIssues()
  const { data: issueTypesResponse } = useGetIssueTypes()

  const issues = issuesResponse?.data || []
  const issueTypes = issueTypesResponse?.data || []

  const addIssueMutation = useAddIssue()
  const deleteIssueMutation = useDeleteIssue()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const [titeleAr, setTiteleAr] = useState('')
  const [titeleEn, setTiteleEn] = useState('')
  const [defendant, setDefendant] = useState('')
  const [issueTypeId, setIssueTypeId] = useState('')
  const [issueAttachmentFiles, setIssueAttachmentFiles] = useState<File[]>([])
  const [issueClients, setIssueClients] = useState<IssueClientForm[]>([{ name: '', nationalId: '' }])

  const updateIssueMutation = useUpdateIssue(editingIssue?.id || '')

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
      : type?.nameEn || type?.nameAr || 'N/A'
  }

  const resetForm = () => {
    setTiteleAr('')
    setTiteleEn('')
    setDefendant('')
    setIssueTypeId(issueTypes[0]?.id || '')
    setIssueAttachmentFiles([])
    setIssueClients([{ name: '', nationalId: '' }])
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
              nationalId: client.nationalId,
              nationalIdentityPath: client.nationalIdentityPath,
            }))
          : [{ name: '', nationalId: '' }]
      )
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
      prev.map((client, i) =>
        i === index
          ? {
              ...client,
              [key]: value,
            }
          : client
      )
    )
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

    const hasAtLeastOneValidClient = issueClients.some(
      (client) => client.name.trim().length > 0 && client.nationalId.trim().length > 0
    )

    if (!hasAtLeastOneValidClient) {
      nextErrors.issueClients = 'يجب إضافة عميل واحد على الأقل'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const payload: IssueSubmitInput = {
      titeleAr: titeleAr.trim(),
      titeleEn: titeleEn.trim(),
      issueTypeId,
      defendant: defendant.trim(),
      issueAttachmentFiles,
      issueClients: issueClients
        .filter((client) => client.name.trim() && client.nationalId.trim())
        .map<IssueClientInput>((client) => ({
          name: client.name.trim(),
          nationalId: client.nationalId.trim(),
          nationalIdentityFile: client.nationalIdentityFile,
        })),
    }

    const formData = buildIssueFormData(payload)

    if (editingIssue) {
      await updateIssueMutation.mutateAsync(formData)
      setIsModalOpen(false)
      setEditingIssue(null)
      return
    }

    await addIssueMutation.mutateAsync(formData)
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
      labelEn: 'Title',
    },
    {
      key: 'defendantAr',
      labelAr: 'المدعي عليه',
      labelEn: 'Defendant',
    },
    {
      key: 'issueTypeId',
      labelAr: 'النوع',
      labelEn: 'Type',
      render: (value) => getIssueTypeName(String(value)),
    },
    {
      key: 'clientsCount',
      labelAr: 'عدد العملاء',
      labelEn: 'Clients',
    },
    {
      key: 'attachmentsCount',
      labelAr: 'عدد المرفقات',
      labelEn: 'Attachments',
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

      {isLoading && <div className="mb-4 text-gray-300 font-cairo text-sm">جاري تحميل القضايا...</div>}

      <DataTable
        columns={columns}
        data={rows}
        onView={(row) => navigate(`/admin/cases/${row.id}`)}
        onEdit={(row) => {
          const issue = getIssueByRow(row)
          if (issue) handleOpenModal(issue)
        }}
        onDelete={handleDelete}
        deleteTitleAr="حذف القضية"
        deleteTitleEn="Delete Case"
        getDeleteLabel={(row) => row.titleAr}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add Case" titleAr="إضافة/تعديل قضية">
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

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">العنوان الإنجليزي</label>
            <input
              type="text"
              value={titeleEn}
              onChange={(e) => setTiteleEn(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
            />
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
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">مرفقات القضية</label>
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gold/30 rounded-lg hover:border-gold cursor-pointer transition-colors">
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                  <FileUp size={24} className="text-gold mb-2" />
                  <p className="text-sm font-cairo text-gold">اضغط لرفع ملفات</p>
                </div>
                <input type="file" multiple onChange={handleAttachmentUpload} className="hidden" />
              </label>
            </div>

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

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-cairo font-semibold text-gold text-right">العملاء</label>
              <button type="button" onClick={addClientRow} className="text-xs text-gold hover:text-gold-light font-cairo">
                + إضافة عميل
              </button>
            </div>

            <div className="space-y-3">
              {issueClients.map((client, index) => (
                <div key={index} className="p-3 bg-charcoal/40 border border-gold/20 rounded-lg space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="اسم العميل"
                      value={client.name}
                      onChange={(e) => updateClientField(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="الهوية الوطنية"
                      value={client.nationalId}
                      onChange={(e) => updateClientField(index, 'nationalId', e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={(e) => updateClientField(index, 'nationalIdentityFile', e.target.files?.[0])}
                      className="block w-full text-sm text-gray-300 font-cairo"
                    />
                    {issueClients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeClientRow(index)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {client.nationalIdentityPath && <p className="text-xs text-gray-400">ملف الهوية الحالي موجود</p>}
                </div>
              ))}
            </div>

            {errors.issueClients && <p className="text-red-400 text-xs mt-2">{errors.issueClients}</p>}
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
