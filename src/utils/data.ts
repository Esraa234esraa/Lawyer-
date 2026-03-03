export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString('ar-SA', options)
  }
  
  export function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
    let interval = seconds / 31536000
    if (interval > 1) return `قبل ${Math.floor(interval)} سنة`
  
    interval = seconds / 2592000
    if (interval > 1) return `قبل ${Math.floor(interval)} شهر`
  
    interval = seconds / 86400
    if (interval > 1) return `قبل ${Math.floor(interval)} يوم`
  
    interval = seconds / 3600
    if (interval > 1) return `قبل ${Math.floor(interval)} ساعة`
  
    interval = seconds / 60
    if (interval > 1) return `قبل ${Math.floor(interval)} دقيقة`
  
    return `قبل لحظات`
  }