import { motion } from 'framer-motion';
import { useState, lazy, Suspense, useMemo } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Column } from '@/components/admin/DataTable';
import { Service } from '@/types/service';
import {
  useGetServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  buildServiceFormData,
} from '@/hooks/useServices';
import { toast } from 'sonner';

const DataTable = lazy(() => import('@/components/admin/DataTable'));
const Modal = lazy(() => import('@/components/admin/Modal'));

export default function AdminServices() {
  const { data, isLoading, isError } = useGetServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const services: Service[] = data?.data || [];

  // UI STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    image: null as File | null,
    childernTheServices: [{ id: null, term: '' }],
  });

  const [errors, setErrors] = useState<any>({});

  // ================= FILTER =================
  const filteredServices = useMemo(() => {
    return services.filter((s) =>
      s.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  // ================= PAGINATION =================
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredServices.slice(start, start + perPage);
  }, [filteredServices, page]);

  const totalPages = Math.ceil(filteredServices.length / perPage);

  // ================= MODALS =================
  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        price: service.price,
        image: null,
        childernTheServices: service.childernTheServices?.length
          ? service.childernTheServices.map((c) => ({
              id: c.id ?? null,
              term: c.term,
            }))
          : [{ id: null, term: '' }],
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        image: null,
        childernTheServices: [{ id: null, term: '' }],
      });
    }
    setIsModalOpen(true);
  };

  const handleDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsOpen(true);
  };

  // ================= FORM =================
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setFormData((p) => ({ ...p, image: files[0] }));
      return;
    }

    setFormData((p) => ({
      ...p,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = buildServiceFormData(formData);

    try {
      if (editingService) {
        await updateMutation.mutateAsync({
          id: editingService.id,
          formData: form,
        });
        toast.success('تم التحديث');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('تمت الإضافة');
      }

      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'خطأ');
    }
  };

  const handleDelete = async (s: Service) => {
    await deleteMutation.mutateAsync(s.id);
    toast.success('تم الحذف');
  };

  // ================= COLUMNS =================
  const columns: Column<Service>[] = [
    { key: 'title', labelAr: 'العنوان', render: (_, i) => i.title },
    { key: 'price', labelAr: 'السعر', render: (v) => v },
    {
      key: 'actions',
      labelAr: 'الإجراءات',
      render: (_, item) => (
        <div className="flex gap-2">
          <button onClick={() => handleDetails(item)}>عرض</button>
          <button onClick={() => handleOpenModal(item)}>تعديل</button>
          <button onClick={() => handleDelete(item)}>حذف</button>
        </div>
      ),
    },
  ];

  return (
    <div dir="rtl" className="p-4">

      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-4">
        <Search />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث..."
          className="border p-2 w-full"
        />
      </div>

      {/* ADD */}
      <Button onClick={() => handleOpenModal()}>
        <Plus /> إضافة
      </Button>

      {/* TABLE */}
      <Suspense fallback={<p>تحميل...</p>}>
        <DataTable
          columns={columns}
          data={paginated}
        />
      </Suspense>

      {/* PAGINATION */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border ${
              page === i + 1 ? 'bg-gold text-black' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* FORM MODAL */}
      <Suspense fallback={null}>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">

            <input name="title" value={formData.title} onChange={handleChange} placeholder="العنوان" />

            <textarea name="description" value={formData.description} onChange={handleChange} />

            <input type="number" name="price" value={formData.price} onChange={handleChange} />

            <input type="file" name="image" onChange={handleChange} />

            <Button type="submit">
              {editingService ? 'تحديث' : 'حفظ'}
            </Button>
          </form>
        </Modal>
      </Suspense>

      {/* DETAILS MODAL */}
      <Suspense fallback={null}>
        <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}>
          {selectedService && (
            <div>
              <h2>{selectedService.title}</h2>
              <p>{selectedService.description}</p>
              <p>{selectedService.price}</p>
            </div>
          )}
        </Modal>
      </Suspense>
    </div>
  );
}