import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  buildServiceFormData,
} from '@/services/serviceService';
import { Service } from '@/types/service';

export const useGetServices = () => {
  return useQuery(['services'], getAllServices);
};

export const useGetServiceById = (id: string) => {
  return useQuery(['services', id], () => getServiceById(id), { enabled: !!id });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation(createService, {
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, formData }: { id: string; formData: FormData }) => updateService(id, formData), {
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteService, {
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });
};

export { buildServiceFormData };
