import type { Session } from '@/types/session'

const escapeCsv = (value: string): string => {
  const normalized = value.replace(/"/g, '""')
  return `"${normalized}"`
}

const formatDate = (value: string | null | undefined, locale: 'ar' | 'en') => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export const exportSessionsToCsv = (sessions: Session[], isArabic: boolean): void => {
  const headers = isArabic
    ? [
        'رقم الجلسة',
        'القرار',
        'المحكمة',
        'ملاحظات الجلسة',
        'الحالة',
        'النوع',
        'تاريخ الجلسة',
        'تاريخ الجلسة القادمة',
        'رقم القضية',
      ]
    : [
        'Session Number',
        'Decision',
        'Court',
        'Session Note',
        'Status',
        'Type',
        'Session Date',
        'Next Session Date',
        'Issue Id',
      ]

  const rows = sessions.map((session) => [
    session.sessioNumber,
    session.decision,
    session.court,
    session.sessioNote,
    String(session.sessionStatus),
    String(session.sessionType),
    formatDate(session.sessionDate, isArabic ? 'ar' : 'en'),
    formatDate(session.nextSessionDate, isArabic ? 'ar' : 'en'),
    session.issueId,
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsv(String(cell || ''))).join(','))
    .join('\n')

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `sessions-${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const printSessionsAsPdf = (sessions: Session[], isArabic: boolean): void => {
  const popup = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=800')
  if (!popup) return

  const rowsHtml = sessions
    .map(
      (session) => `
      <tr>
        <td>${session.sessioNumber}</td>
        <td>${session.decision}</td>
        <td>${session.court}</td>
        <td>${session.sessioNote}</td>
        <td>${session.sessionStatus}</td>
        <td>${session.sessionType}</td>
        <td>${formatDate(session.sessionDate, isArabic ? 'ar' : 'en')}</td>
        <td>${formatDate(session.nextSessionDate, isArabic ? 'ar' : 'en')}</td>
      </tr>
    `
    )
    .join('')

  popup.document.write(`
    <!doctype html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>${isArabic ? 'تقرير الجلسات' : 'Sessions Report'}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { margin-bottom: 12px; }
          p { color: #666; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; vertical-align: top; }
          th { background: #f6f6f6; }
        </style>
      </head>
      <body>
        <h1>${isArabic ? 'تقرير الجلسات' : 'Sessions Report'}</h1>
        <p>${isArabic ? 'عدد السجلات' : 'Records'}: ${sessions.length}</p>
        <table>
          <thead>
            <tr>
              <th>${isArabic ? 'رقم الجلسة' : 'Session Number'}</th>
              <th>${isArabic ? 'القرار' : 'Decision'}</th>
              <th>${isArabic ? 'المحكمة' : 'Court'}</th>
              <th>${isArabic ? 'ملاحظات الجلسة' : 'Session Note'}</th>
              <th>${isArabic ? 'الحالة' : 'Status'}</th>
              <th>${isArabic ? 'النوع' : 'Type'}</th>
              <th>${isArabic ? 'تاريخ الجلسة' : 'Session Date'}</th>
              <th>${isArabic ? 'تاريخ الجلسة القادمة' : 'Next Session Date'}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `)

  popup.document.close()
  popup.focus()
  popup.print()
}
