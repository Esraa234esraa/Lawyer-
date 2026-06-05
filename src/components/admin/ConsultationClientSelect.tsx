import React, { useMemo, useState } from 'react'
import { ConsultationClient } from '@/services/consultationClientService'

type Props = {
  options: ConsultationClient[]
  value?: string
  onChange: (id?: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function ConsultationClientSelect({ options, value, onChange, placeholder, disabled }: Props) {
  const [filter, setFilter] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const selected = options.find((o) => o.id === value)

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.fullName.toLowerCase().includes(q))
  }, [options, filter])

  const displayValue = isOpen ? filter : selected?.fullName || ''

  return (
    <div
      className="relative"
      tabIndex={0}
      onFocus={() => setIsOpen(true)}
      onBlur={() => {
        setTimeout(() => setIsOpen(false), 150)
      }}
    >
      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          setFilter(e.target.value)
          setIsOpen(true)
        }}
        placeholder={selected ? selected.fullName : placeholder || 'اختر عميل'}
        disabled={disabled}
        className="w-full px-3 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors cursor-pointer"
      />

      {isOpen && (
        <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-charcoal/90 rounded border border-gold/20 shadow-lg">
          {filtered.length === 0 ? (
            <div className="p-2 text-sm text-gray-400 font-cairo">لا يوجد نتائج</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onMouseDown={() => {
                  onChange(opt.id)
                  setFilter('')
                  setIsOpen(false)
                }}
                className={`w-full text-right px-3 py-2 hover:bg-charcoal/80 transition-colors font-cairo ${opt.id === value ? 'bg-charcoal/80' : ''}`}
              >
                {opt.fullName}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
