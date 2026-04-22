/**
 * Quick Reference Guide - News Data Layer
 * Copy-paste ready examples for common tasks
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Hooks for fetching
import {
  useGetAllNews,
  useGetVisibleNews,
  useGetNewsById,
  NEWS_QUERY_KEYS,
} from '@/hooks/news'

// Hooks for mutations
import {
  useAddNews,
  useUpdateNews,
  useDeleteNews,
  useHideNews,
  useShowNews,
} from '@/hooks/news'

// Filtering and data transformation
import {
  useFilteredNews,
  useNewsSearch,
  useGroupedNews,
  useNewsStats,
} from '@/hooks/useFilteredNews'

// Validation
import {
  validateNewsCreateInput,
  validateNewsUpdateInput,
  validateName,
  validateDescription,
  validateImage,
  validateActionDate,
} from '@/utils/newsValidation'

// Types
import {
  News,
  NewsCreateInput,
  NewsUpdateInput,
  ApiResponse,
} from '@/types/news'

// ============================================================================
// QUICK PATTERNS
// ============================================================================

// Pattern 1: Load and Display All News
export function QuickPattern1_AllNews() {
  const { data, isLoading, error } = useGetAllNews()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.data?.map(news => (
        <div key={news.id}>{news.name}</div>
      ))}
    </div>
  )
}

// Pattern 2: Load Visible News (Public Page)
export function QuickPattern2_VisibleNews() {
  const { data, isLoading } = useGetVisibleNews()
  
  return (
    <div>
      {isLoading ? 'Loading...' : data?.data?.map(n => <NewsItem key={n.id} news={n} />)}
    </div>
  )
}

// Pattern 3: Load Single News
export function QuickPattern3_SingleNews({ newsId }: { newsId: string }) {
  const { data, isLoading, error } = useGetNewsById(newsId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Not found</div>

  return <NewsDetail news={data?.data} />
}

// Pattern 4: Create News Form
export function QuickPattern4_CreateNews() {
  const [form, setForm] = React.useState<NewsCreateInput>({
    name: '',
    description: '',
    image: null,
    actionDate: new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const mutation = useAddNews({
    onSuccess: () => {
      alert('Created!')
      setForm({ name: '', description: '', image: null, actionDate: '' })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const validation = validateNewsCreateInput(form)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    // Submit
    await mutation.mutateAsync(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}

      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
      />
      {errors.description && <p className="text-red-500">{errors.description}</p>}

      <input
        type="file"
        onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
      />
      {errors.image && <p className="text-red-500">{errors.image}</p>}

      <input
        type="date"
        value={form.actionDate}
        onChange={(e) => setForm({ ...form, actionDate: e.target.value })}
      />
      {errors.actionDate && <p className="text-red-500">{errors.actionDate}</p>}

      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}

// Pattern 5: Update News
export function QuickPattern5_UpdateNews({ newsId }: { newsId: string }) {
  const [form, setForm] = React.useState<NewsUpdateInput>({
    name: '',
    description: '',
    actionDate: '',
  })

  const { data: detail, isLoading: detailLoading } = useGetNewsById(newsId)
  const mutation = useUpdateNews(newsId)

  React.useEffect(() => {
    if (detail?.data) {
      setForm({
        name: detail.data.name,
        description: detail.data.description,
        actionDate: detail.data.actionDate,
      })
    }
  }, [detail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateNewsUpdateInput(form)
    if (!validation.isValid) {
      console.error(validation.errors)
      return
    }

    await mutation.mutateAsync(form)
  }

  if (detailLoading) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input
        type="date"
        value={new Date(form.actionDate).toISOString().split('T')[0]}
        onChange={(e) => setForm({ ...form, actionDate: e.target.value })}
      />
      <button disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save'}</button>
    </form>
  )
}

// Pattern 6: Delete with Confirmation
export function QuickPattern6_DeleteNews({ newsId }: { newsId: string }) {
  const mutation = useDeleteNews()

  const handleDelete = async () => {
    if (confirm('Delete this news?')) {
      await mutation.mutateAsync(newsId)
    }
  }

  return (
    <button onClick={handleDelete} disabled={mutation.isPending} className="bg-red-500 text-white">
      {mutation.isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

// Pattern 7: Toggle Visibility
export function QuickPattern7_ToggleVisibility({ news }: { news: News }) {
  const hideMutation = useHideNews()
  const showMutation = useShowNews()

  return (
    <>
      {news.isVisible ? (
        <button onClick={() => hideMutation.mutate(news.id)} disabled={hideMutation.isPending}>
          Hide
        </button>
      ) : (
        <button onClick={() => showMutation.mutate(news.id)} disabled={showMutation.isPending}>
          Show
        </button>
      )}
    </>
  )
}

// Pattern 8: Filter and Search
export function QuickPattern8_FilteredList() {
  const [search, setSearch] = React.useState('')
  const [isVisible, setIsVisible] = React.useState<boolean | undefined>(undefined)

  const { data } = useGetAllNews()
  const filtered = useFilteredNews(data?.data, {
    search,
    isVisible,
    sortBy: 'date',
    sortOrder: 'desc',
  })

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ابحث..."
      />

      <button onClick={() => setIsVisible(isVisible === true ? undefined : true)}>
        {isVisible === true ? 'All' : 'Visible Only'}
      </button>

      <p>Found: {filtered.length}</p>
      {filtered.map(n => <NewsItem key={n.id} news={n} />)}
    </div>
  )
}

// Pattern 9: Group News by Date
export function QuickPattern9_GroupedNews() {
  const { data } = useGetAllNews()
  const grouped = useGroupedNews(data?.data)

  return (
    <div>
      {Object.entries(grouped).map(([date, items]) => (
        <section key={date}>
          <h3>{date}</h3>
          {items.map(news => (
            <div key={news.id}>{news.name}</div>
          ))}
        </section>
      ))}
    </div>
  )
}

// Pattern 10: News Statistics
export function QuickPattern10_NewsStats() {
  const { data } = useGetAllNews()
  const stats = useNewsStats(data?.data)

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-gray-600">Total</p>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>
      <div>
        <p className="text-gray-600">Visible</p>
        <p className="text-2xl font-bold">{stats.visible}</p>
      </div>
      <div>
        <p className="text-gray-600">Hidden</p>
        <p className="text-2xl font-bold">{stats.hidden}</p>
      </div>
      <div>
        <p className="text-gray-600">Recent</p>
        <p className="text-2xl font-bold">{stats.recentCount}</p>
      </div>
    </div>
  )
}

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================

// Quick validation check
function validateQuick(input: NewsCreateInput) {
  const result = validateNewsCreateInput(input)
  
  if (!result.isValid) {
    Object.entries(result.errors).forEach(([field, error]) => {
      console.log(`${field}: ${error}`)
    })
  }

  return result.isValid
}

// Individual field validation
function validateFieldQuick(field: string, value: any) {
  switch (field) {
    case 'name':
      return validateName(value)
    case 'description':
      return validateDescription(value)
    case 'image':
      return validateImage(value)
    case 'actionDate':
      return validateActionDate(value)
    default:
      return null
  }
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function NewsItem({ news }: { news: News }) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold">{news.name}</h3>
      <p className="text-sm text-gray-600">{news.description.slice(0, 100)}...</p>
    </div>
  )
}

function NewsDetail({ news }: { news: News | undefined }) {
  if (!news) return <div>No news</div>

  return (
    <div>
      <h1 className="text-3xl font-bold">{news.name}</h1>
      {news.image && <img src={news.image} alt={news.name} className="w-full h-96 object-cover" />}
      <p>{news.description}</p>
      <p className="text-sm text-gray-500">
        Date: {new Date(news.actionDate).toLocaleDateString('ar-SA')}
      </p>
    </div>
  )
}

// ============================================================================
// IMPORT STATEMENT GENERATORS
// ============================================================================

/*
COPY THESE IMPORTS INTO YOUR FILES:

// For basic queries
import { useGetAllNews, useGetVisibleNews, useGetNewsById } from '@/hooks/news'

// For mutations
import { useAddNews, useUpdateNews, useDeleteNews, useHideNews, useShowNews } from '@/hooks/news'

// For filtering
import { useFilteredNews, useNewsSearch, useGroupedNews, useNewsStats } from '@/hooks/useFilteredNews'

// For validation
import { validateNewsCreateInput, validateNewsUpdateInput } from '@/utils/newsValidation'

// For types
import { News, NewsCreateInput, NewsUpdateInput } from '@/types/news'
*/

export {}
