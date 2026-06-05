import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addContact } from '@/services/contactService'
import type { ContactFormInput } from '@/types/contact'
import { CONTACTS_QUERY_KEYS } from './useGetAllContacts'

export const useAddContact = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ContactFormInput) => addContact(payload),
    onSuccess: (response) => {
      toast.success(response.message || 'تم إرسال رسالتك بنجاح')
      queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEYS.all })
    },
    onError: (error: unknown) => {
      // Log full error details only during development for debugging
      // Do NOT expose stack traces or internal data to end users
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Add contact error:', error)
      }

      const message = error instanceof Error ? error.message : 'فشل في إرسال الرسالة'
      toast.error(message)
    },
  })
}
