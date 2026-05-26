import type { Session } from '@/types/session'

const escapeCsv = (value: unknown) => {
  const text = String(value ?? '')
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export const exportSessionsCsv = (sessions: Session[], isArabic: boolean) => {
  const headers = isArabic
    ? ['رقم الجلسة', 'القرار', 'المحكمة', 'الحالة', 'النوع', 'تاريخ الجلسة', 'تاريخ الجلسة القادمة']
    : ['Session Number', 'Decision', 'Court', 'Status', 'Type', 'Session Date', 'Next Session Date']

  const rows = sessions.map((session) => [
    session.sessioNumber,
    session.decision,
    session.court,
    session.sessionStatus,
    session.sessionType,
    session.sessionDate,
    session.nextSessionDate || '',
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\n')

  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `sessions-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export const exportSessionsPdf = (sessions: Session[], isArabic: boolean) => {
  const title = isArabic ? 'تقرير الجلسات' : 'Sessions Report'
  const labels = isArabic
    ? {
        number: 'رقم الجلسة',
        decision: 'القرار',
        court: 'المحكمة',
        status: 'الحالة',
        type: 'النوع',
        date: 'التاريخ',
      }
    : {
        number: 'Session Number',
        decision: 'Decision',
        court: 'Court',
        status: 'Status',
        type: 'Type',
        date: 'Date',
      }

  const rows = sessions
    .map(
      (session) => `
      <tr>
        <td>${session.sessioNumber}</td>
        <td>${session.decision}</td>
        <td>${session.court}</td>
        <td>${session.sessionStatus}</td>
        <td>${session.sessionType}</td>
        <td>${session.sessionDate}</td>
      </tr>
    `
    )
    .join('')

  const printWindow = window.open('', '_blank', 'width=1200,height=800')
  if (!printWindow) return

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; direction: ${isArabic ? 'rtl' : 'ltr'}; }
          h1 { margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: ${isArabic ? 'right' : 'left'}; }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              <th>${labels.number}</th>
              <th>${labels.decision}</th>
              <th>${labels.court}</th>
              <th>${labels.status}</th>
              <th>${labels.type}</th>
              <th>${labels.date}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}
