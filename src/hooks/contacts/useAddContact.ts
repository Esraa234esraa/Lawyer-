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
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في إرسال الرسالة')
    },
  })
}
