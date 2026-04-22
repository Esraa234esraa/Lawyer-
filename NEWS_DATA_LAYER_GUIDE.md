# News Data Layer - Complete Implementation Guide

## Overview

This guide documents the complete implementation of the News management data layer using React Query, Axios, and TypeScript. The system includes API service layer, custom hooks, validation, and optimized filtering.

---

## Architecture

```
┌─────────────────────────────────────┐
│       React Components              │
│  (Admin pages, News pages, etc)    │
└────────────────┬────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │   Custom Hooks     │
        │   (useGetAllNews,  │
        │    useAddNews,     │
        │    useFilteredNews)│
        └────────┬───────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │   React Query              │
    │  (useQuery/useMutation)    │
    │  - Caching                 │
    │  - Invalidation            │
    │  - Loading states          │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │   News Service             │
    │   (newsService.ts)         │
    │   - API calls              │
    │   - Validation             │
    │   - Error handling         │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │   Axios Instance           │
    │   - Request/Response       │
    │   - Interceptors           │
    │   - Token injection        │
    └────────┬───────────────────┘
             │
             ▼
        ┌──────────────┐
        │  API Server  │
        │  ASP.NET     │
        └──────────────┘
```

---

## File Structure

```
src/
├── services/
│   └── newsService.ts              # API layer with all endpoints
│
├── hooks/
│   ├── news/
│   │   ├── useGetAllNews.ts        # Fetch all news
│   │   ├── useGetVisibleNews.ts    # Fetch visible news
│   │   ├── useGetNewsById.ts       # Fetch single news
│   │   ├── useAddNews.ts           # Create news mutation
│   │   ├── useUpdateNews.ts        # Update news mutation
│   │   ├── useDeleteNews.ts        # Delete news mutation
│   │   ├── useHideNews.ts          # Hide news mutation
│   │   ├── useShowNews.ts          # Show news mutation
│   │   └── index.ts                # Central export
│   └── useFilteredNews.ts          # Filtering & memoization hooks
│
├── utils/
│   └── newsValidation.ts           # Validation functions
│
├── types/
│   └── news.ts                     # TypeScript types
│
├── services/
│   └── newsService.ts              # API service
│
└── components/
    └── news/
        └── NewsExamples.tsx        # Example implementations
```

---

## 1. TypeScript Types

### News Model
```typescript
interface News {
  id: string
  name: string
  description: string
  image: string
  actionDate: string | Date
  isVisible: boolean
  createdAt?: string
  updatedAt?: string
}
```

### Input Models
```typescript
interface NewsCreateInput {
  name: string
  description: string
  image: File
  actionDate: string | Date
}

interface NewsUpdateInput {
  name: string
  description: string
  image?: File
  actionDate: string | Date
}
```

---

## 2. API Service Layer

### File: `src/services/newsService.ts`

#### Validation
```typescript
// GUID validation before API calls
const isValidGuid = (id: string): boolean
validateNewsId(id, operation)
validateNewsCreateInput(input)
validateNewsUpdateInput(input)
```

#### API Functions
```typescript
getAllNews()                    // GET all news (admin)
getVisibleNews()               // GET visible news (public)
getNewsById(id)                // GET single news
addNews(input)                 // POST new news
updateNews(id, input)          // PUT update news
deleteNews(id)                 // DELETE news
hideNews(id)                   // PUT hide news
showNews(id)                   // PUT show news
```

#### FormData Handling
```typescript
// Automatically builds FormData
buildNewsCreateFormData(input)
buildNewsUpdateFormData(input)

// No manual Content-Type header needed
// Browser sets it automatically with boundary
```

---

## 3. React Query Hooks

### Query Hooks (useQuery)

#### useGetAllNews
```typescript
import { useGetAllNews } from '@/hooks/news'

const { 
  data,              // ApiResponse<News[]>
  isLoading,         // Initial load
  isFetching,        // Background refetch
  error,             // Error object
  refetch            // Manual refetch
} = useGetAllNews({
  enabled: true,                    // Optional
  staleTime: 5 * 60 * 1000          // 5 min
})

// Access news
data?.data?.map(news => ...)
```

#### useGetVisibleNews
```typescript
const { data, isLoading } = useGetVisibleNews()

// Only visible news
data?.data?.filter(news => news.isVisible)
```

#### useGetNewsById
```typescript
const { data, isLoading, error } = useGetNewsById(newsId)

// Single news details
const news = data?.data
```

### Mutation Hooks (useMutation)

#### useAddNews
```typescript
import { useAddNews } from '@/hooks/news'

const mutation = useAddNews({
  onSuccess: (data) => {
    console.log('Created:', data)
    navigate('/admin/news')
  },
  onError: (error) => {
    console.error('Error:', error)
  }
})

// Create news
await mutation.mutateAsync({
  name: 'Breaking News',
  description: 'Important update',
  image: fileInput,
  actionDate: new Date()
})

// States
mutation.isPending     // Loading state
mutation.isError       // Error state
mutation.data          // Success data
```

#### useUpdateNews
```typescript
const mutation = useUpdateNews(newsId)

await mutation.mutateAsync({
  name: 'Updated Title',
  description: 'Updated description',
  image: newImageFile,  // Optional
  actionDate: new Date()
})
```

#### useDeleteNews, useHideNews, useShowNews
```typescript
const deleteMutation = useDeleteNews()
const hideMutation = useHideNews()
const showMutation = useShowNews()

await deleteMutation.mutateAsync(newsId)
await hideMutation.mutateAsync(newsId)
await showMutation.mutateAsync(newsId)
```

---

## 4. Validation

### File: `src/utils/newsValidation.ts`

#### Individual Field Validators
```typescript
import {
  validateName,
  validateDescription,
  validateImage,
  validateActionDate
} from '@/utils/newsValidation'

// Returns error message or null
const nameError = validateName(input.name)
const descError = validateDescription(input.description)
const imgError = validateImage(input.image)
const dateError = validateActionDate(input.actionDate)
```

#### Composite Validators
```typescript
import {
  validateNewsCreateInput,
  validateNewsUpdateInput
} from '@/utils/newsValidation'

const result = validateNewsCreateInput(input)
if (!result.isValid) {
  console.log(result.errors)  // Record<field, message>
}
```

#### Validation Rules
```typescript
// Min/max lengths
name: 3-200 characters
description: 10-2000 characters

// Image constraints
max size: 5MB
allowed types: jpeg, png, gif, webp

// Date constraints
min year: 2000
max year: 2050
```

---

## 5. Filtering & Memoization

### File: `src/hooks/useFilteredNews.ts`

#### useFilteredNews
```typescript
import { useFilteredNews } from '@/hooks/useFilteredNews'

const filtered = useFilteredNews(newsArray, {
  search: 'حبر',              // Search in name/description
  isVisible: true,            // Filter by visibility
  sortBy: 'date',             // 'date' or 'name'
  sortOrder: 'desc'           // 'asc' or 'desc'
})

// Memoized - only recalculates when dependencies change
filtered.map(news => <NewsCard news={news} />)
```

#### useNewsSearch
```typescript
const [search, setSearch] = useState('')
const results = useNewsSearch(allNews, search)

// Real-time filtering with memoization
<input
  onChange={(e) => setSearch(e.target.value)}
  placeholder="ابحث..."
/>
{results.map(news => ...)}
```

#### useGroupedNews
```typescript
const grouped = useGroupedNews(allNews)

// {
//   '22 أبريل 2026': [news1, news2],
//   '21 أبريل 2026': [news3]
// }

Object.entries(grouped).map(([date, items]) => (
  <section key={date}>
    <h3>{date}</h3>
    {items.map(news => ...)}
  </section>
))
```

#### useNewsStats
```typescript
const stats = useNewsStats(allNews)

console.log(stats)
// {
//   total: 42,
//   visible: 35,
//   hidden: 7,
//   recentCount: 5  // Last 7 days
// }
```

---

## 6. Loading & Pending States

### Query States
```typescript
const { isLoading, isFetching, error, data } = useGetAllNews()

// isLoading: true during initial load
// isFetching: true during any fetch (initial + refetch)
// error: Error object if failed
// data: Response data

// Loading UI
if (isLoading) return <Skeleton />

// Refetching indicator
{isFetching && <p>Updating...</p>}

// Error UI
if (error) return <Error message={error.message} />

// Empty state
if (!data?.data?.length) return <Empty />

// Success UI
<List items={data.data} />
```

### Mutation States
```typescript
const mutation = useAddNews()

// isPending: true during mutation
// isError: true if failed
// isSuccess: true if succeeded
// data: Success response
// error: Error object

// Button
<button disabled={mutation.isPending}>
  {mutation.isPending ? 'Creating...' : 'Create'}
</button>

// Form
<form disabled={mutation.isPending}>
  {/* inputs */}
</form>
```

---

## 7. Error Handling

### Automatic Toast Notifications
All mutations automatically show toasts:
```typescript
// Success toast (from backend message)
toast.success('تم إضافة الخبر بنجاح')

// Error toast (from error message)
toast.error('اسم الخبر مطلوب')
```

### Error Types Handled
```typescript
1. Validation errors
   - Required fields
   - Length constraints
   - File format/size
   - Date validity

2. GUID validation
   - Invalid ID format
   - Prevented API call

3. API errors
   - Network errors
   - Server errors
   - Backend validation

4. HTTP errors
   - 400 Bad Request
   - 404 Not Found
   - 500 Server Error
```

---

## 8. Usage Patterns

### Pattern 1: Basic Query
```typescript
function NewsPage() {
  const { data, isLoading, error } = useGetAllNews()

  if (isLoading) return <Skeleton />
  if (error) return <Error error={error} />

  return (
    <div>
      {data?.data?.map(news => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  )
}
```

### Pattern 2: Filtered List
```typescript
function NewsAdminPage() {
  const [filters, setFilters] = useState({ search: '' })
  const { data } = useGetAllNews()
  const filtered = useFilteredNews(data?.data, filters)

  return (
    <>
      <input
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="ابحث..."
      />
      <NewsList items={filtered} />
    </>
  )
}
```

### Pattern 3: Create with Validation
```typescript
function CreateNewsForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: null,
    actionDate: ''
  })
  const [errors, setErrors] = useState({})

  const mutation = useAddNews({
    onSuccess: () => navigate('/news')
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate
    const validation = validateNewsCreateInput(form)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    // Submit
    mutation.mutateAsync(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      {errors.name && <Error msg={errors.name} />}

      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

### Pattern 4: Detail with Edit
```typescript
function NewsDetail({ id }) {
  const [isEditing, setIsEditing] = useState(false)
  const { data, isLoading } = useGetNewsById(id)
  const updateMutation = useUpdateNews(id, {
    onSuccess: () => setIsEditing(false)
  })

  if (isLoading) return <Skeleton />

  return (
    <>
      {!isEditing ? (
        <>
          <h1>{data?.data?.name}</h1>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      ) : (
        <NewsEditForm
          news={data?.data}
          onSubmit={(form) => updateMutation.mutateAsync(form)}
          isPending={updateMutation.isPending}
        />
      )}
    </>
  )
}
```

### Pattern 5: Actions Row
```typescript
function NewsCard({ news }) {
  const hideMutation = useHideNews()
  const deleteMutation = useDeleteNews()

  const isPending = hideMutation.isPending || deleteMutation.isPending

  return (
    <div>
      <h3>{news.name}</h3>

      <button
        onClick={() => hideMutation.mutate(news.id)}
        disabled={isPending}
      >
        Hide
      </button>

      <button
        onClick={() => {
          if (confirm('Delete?')) {
            deleteMutation.mutate(news.id)
          }
        }}
        disabled={isPending}
      >
        Delete
      </button>
    </div>
  )
}
```

---

## 9. Query Invalidation

Automatic invalidation after mutations:

### useAddNews
- Invalidates: `['news']` (all queries)

### useUpdateNews
- Invalidates: `['news']`, `['news', 'detail', id]`

### useDeleteNews
- Invalidates: `['news']`

### useHideNews / useShowNews
- Invalidates: `['news']`, `['news', 'visible']`

---

## 10. Performance Optimization

### Memoization
```typescript
// useFilteredNews - only recalculates when news/filters change
const filtered = useMemo(() => {
  // complex filtering logic
}, [news, filters])

// useGroupedNews - expensive grouping operation
const grouped = useMemo(() => {
  // grouping logic
}, [news])

// useNewsStats - calculate statistics once
const stats = useMemo(() => {
  // stats calculation
}, [news])
```

### Query Caching
```typescript
useGetAllNews({
  staleTime: 5 * 60 * 1000,    // 5 min
  gcTime: 10 * 60 * 1000        // 10 min (was cacheTime)
})
```

### Lazy Loading (with React.lazy)
```typescript
// Lazy load admin news page
const AdminNewsPage = React.lazy(() => import('@/pages/admin/News'))

// In routes
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/admin/news" element={<AdminNewsPage />} />
  </Routes>
</Suspense>
```

---

## 11. Best Practices

✅ **DO**
- Use `useGetAllNews()` for admin listings
- Use `useGetVisibleNews()` for public pages
- Always validate before mutation
- Check `isPending` before showing form
- Use `useFilteredNews` for client-side filtering
- Disable buttons during `isPending`
- Show `isFetching` indicator for background updates
- Use proper query keys for invalidation
- Group related queries with constants

❌ **DON'T**
- Fetch same data multiple times
- Miss error handling
- Skip validation
- Use `isLoading` for mutations (use `isPending`)
- Forget to disable buttons during pending
- Make nested queries (use joinedData patterns)
- Ignore memoization for expensive operations
- Use default query keys (use constants)

---

## 12. Common Issues & Solutions

### Issue: "Token is undefined" in API calls
**Solution:** Check if `Authorization` header is set in axios interceptor.

### Issue: Validation errors not showing
**Solution:** Make sure `validateNewsCreateInput` is called and state is updated.

### Issue: Multiple toasts on mutation
**Solution:** Toasts are shown automatically via `onSuccess`/`onError`. Don't call `toast.success()` twice.

### Issue: Data not updating after mutation
**Solution:** Mutation hook automatically invalidates queries. Check query key matches.

### Issue: Performance issues with large lists
**Solution:** Use `useFilteredNews` with memoization instead of inline filtering.

---

## 13. Testing Checklist

- [ ] Create news with file upload
- [ ] Update news with optional image
- [ ] Delete news
- [ ] Hide news (toggle isVisible)
- [ ] Show news (toggle isVisible)
- [ ] Fetch all news (admin)
- [ ] Fetch visible news (public)
- [ ] Fetch single news by ID
- [ ] Validation prevents invalid submission
- [ ] Error messages display correctly
- [ ] Loading states show during fetch
- [ ] Filter/search works with memoization
- [ ] Queries invalidate after mutations
- [ ] Toasts display on success/error

---

## 14. API Reference

### Endpoints Implemented

| Method | Endpoint | Hook | Status |
|--------|----------|------|--------|
| GET | /api/News/GetAllNewsAsync | `useGetAllNews()` | ✅ |
| GET | /api/News/GetOnlyVisibleNewsAsync | `useGetVisibleNews()` | ✅ |
| GET | /api/News/GetNewsByIdAsync/{id} | `useGetNewsById(id)` | ✅ |
| POST | /api/News/AddNewsAsync | `useAddNews()` | ✅ |
| PUT | /api/News/UpdateNewsAsync/{id} | `useUpdateNews(id)` | ✅ |
| PUT | /api/News/HideNewsAsync/{id} | `useHideNews()` | ✅ |
| PUT | /api/News/VisibleNewsAsync/{id} | `useShowNews()` | ✅ |
| DELETE | /api/News/{id} | `useDeleteNews()` | ✅ |

---

## Summary

You now have a **production-ready news data layer** with:

✅ 8 API endpoints implemented
✅ 8 custom React Query hooks
✅ Full TypeScript support
✅ Comprehensive validation
✅ Optimized filtering with useMemo
✅ Automatic toast notifications
✅ Proper error handling
✅ Loading & pending states
✅ Query caching & invalidation
✅ Ready for lazy loading

**All code is production-ready, well-documented, and follows best practices.**
