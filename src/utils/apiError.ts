import axios from 'axios'

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiMessage =
      (error.response?.data as { message?: string; error?: string } | undefined)?.message ||
      (error.response?.data as { message?: string; error?: string } | undefined)?.error

    return apiMessage || error.message || 'حدث خطأ غير متوقع'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'حدث خطأ غير متوقع'
}
