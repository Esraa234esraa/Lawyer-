import axiosInstance from '@/api/axiosInstance'

export const convertBlobToFile = (blob: Blob, fileName: string, mimeType?: string): File => {
  const type = mimeType || blob.type || 'application/octet-stream'
  return new File([blob], fileName, {
    type,
    lastModified: Date.now(),
  })
}

export const downloadAttachmentAsFile = async (path: string): Promise<File> => {
  // Try axios first (keeps current behavior). If it fails (network/CORS/etc.)
  // fall back to the browser `fetch` API as a secondary attempt and for
  // better debugging visibility in the console.
  try {
    const response = await axiosInstance.get(path, {
      responseType: 'blob',
    })

    if (response && response.status >= 200 && response.status < 300) {
      const blob = response.data as Blob
      const fileName = path.split('/').pop() || 'attachment'
      return convertBlobToFile(blob, fileName, blob.type || 'application/octet-stream')
    }
  } catch (err: any) {
    // keep for fallback below
    // log for debugging CORS / network issues
    // console.debug will surface in devtools network/console
    // but avoid throwing here so we can try the fetch fallback
    // which sometimes succeeds when axios fails due to subtle xhr issues.
    // eslint-disable-next-line no-console
    console.debug('axios download failed, falling back to fetch:', err?.message || err)
  }

  // Fallback: use fetch. This may reveal CORS-related errors in the console
  // (Access-Control-Allow-Origin) or provide a clearer error message.
  try {
    const res = await fetch(path, { mode: 'cors', credentials: 'include' })
    if (!res.ok) {
      throw new Error(`فشل تحميل المرفق (status ${res.status})`)
    }
    const blob = await res.blob()
    const fileName = path.split('/').pop() || 'attachment'
    return convertBlobToFile(blob, fileName, blob.type || 'application/octet-stream')
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('fetch download failed as fallback:', err?.message || err)
    throw err
  }
}
