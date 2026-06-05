import { Trash2 } from 'lucide-react'
import ConsultationClientSelect from './ConsultationClientSelect'

type IssueClientForm = {
  name: string
  nationalId: string
  nationalIdentityFile?: File
  nationalIdentityPath?: string
  selectedClientId?: string
  selectedAttachmentPaths?: string[]
}

type Props = {
  client: IssueClientForm
  index: number
  clientsOptions: { id: string; fullName: string }[]
  onChangeField: (index: number, key: keyof IssueClientForm, value: any) => void
  onSelectClient: (index: number, clientId?: string) => void
  onRemove: (index: number) => void
}

export default function ClientRow({ client, index, clientsOptions, onChangeField, onSelectClient, onRemove }: Props) {

  return (
    <div className="p-3 bg-charcoal/40 border border-gold/20 rounded-lg space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <ConsultationClientSelect
            options={clientsOptions}
            value={client.selectedClientId}
            onChange={(id) => onSelectClient(index, id)}
            placeholder="ابحث عن عميل الاستشارات"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="اسم العميل"
            value={client.name}
            onChange={(e) => onChangeField(index, 'name', e.target.value)}
            className="w-full px-3 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="الهوية الوطنية"
            value={client.nationalId}
            onChange={(e) => onChangeField(index, 'nationalId', e.target.value)}
            className="w-full px-3 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="file"
          required={!client.nationalIdentityPath}
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={(e) => {
            const file = e.target.files?.[0]
            onChangeField(index, 'nationalIdentityFile', file)
            onChangeField(index, 'nationalIdentityPath', file?.name)
          }}
          className="block w-full text-sm text-gray-300 font-cairo"
        />

        <button type="button" onClick={() => onRemove(index)} className="p-1 text-red-400 hover:text-red-300 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <p className="text-xs text-gray-400">إرفاق الهوية الوطنية بصيغة jpg أو jpeg أو png</p>
    </div>
  )
}
