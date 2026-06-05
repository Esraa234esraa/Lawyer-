export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors: Record<string, string | string[]> | null
}

export interface IssueAttachment {
  filePath: string
}

export interface IssueClient {
  name: string
  nationalId: number
  nationalIdentityPath?: string
}

export interface Issue {
  id: string
  titeleAr: string
  titeleEn?: string
  issueTypeId: string
  defendant: string
  clients: IssueClient[]
  attachments: IssueAttachment[]
}

export interface IssueDetails extends Issue {}

export interface IssueType {
  id: string
  nameAr: string
  nameEn?: string
}

export interface IssueClientInput {
  name: string
  nationalId: number
  consultationClientId?: string
  selectedAttachmentPaths?: string[]
  nationalIdentityPath?: string
  nationalIdentityFile?: File
}

export interface IssueSubmitInput {
  titeleAr: string
  titeleEn?: string
  issueTypeId: string
  defendant: string
  issueAttachmentFiles: File[]
  issueClients: IssueClientInput[]
}
