/**
 * News Data Layer Integration Checklist
 * Step-by-step guide to integrate into existing application
 */

// ============================================================================
// STEP 1: Add Dependencies (if not already present)
// ============================================================================

/*
All required dependencies should be in package.json:

✅ @tanstack/react-query (already installed)
✅ axios (already installed)
✅ sonner (already installed for toasts)

To verify:
$ npm list @tanstack/react-query axios sonner

If missing:
$ npm install @tanstack/react-query axios sonner
*/

// ============================================================================
// STEP 2: Ensure QueryClientProvider is Set Up
// ============================================================================

/*
In src/main.tsx or src/App.tsx:

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app content */}
    </QueryClientProvider>
  )
}
*/

// ============================================================================
// STEP 3: Verify Files Are Created
// ============================================================================

/*
Run this to verify all files exist:

src/services/newsService.ts
src/hooks/news/useGetAllNews.ts
src/hooks/news/useGetVisibleNews.ts
src/hooks/news/useGetNewsById.ts
src/hooks/news/useAddNews.ts
src/hooks/news/useUpdateNews.ts
src/hooks/news/useDeleteNews.ts
src/hooks/news/useHideNews.ts
src/hooks/news/useShowNews.ts
src/hooks/news/index.ts
src/hooks/useFilteredNews.ts
src/utils/newsValidation.ts
src/types/news.ts
src/components/news/NewsExamples.tsx
src/components/news/QUICK_REFERENCE.tsx

If any are missing, they should be created as shown in implementation.
*/

// ============================================================================
// STEP 4: Check Existing Admin Pages
// ============================================================================

/*
Check if you have admin pages:

src/pages/admin/News.tsx      (OR create new)
src/pages/admin/...           (other admin pages)

If not present, we'll need to create them.
*/

// ============================================================================
// STEP 5: Type Checking
// ============================================================================

/*
Run TypeScript check to ensure no errors:

$ npm run type-check

Expected output:
No errors found

If errors appear, they should be related to missing API responses
(backend format might differ slightly from types).
*/

// ============================================================================
// STEP 6: Test Basic Query
// ============================================================================

/*
Create a test component:

src/pages/TestNews.tsx:

import { useGetAllNews } from '@/hooks/news'

export default function TestNewsPage() {
  const { data, isLoading, error } = useGetAllNews()

  return (
    <div>
      <h1>News Test</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.data && (
        <div>
          <p>Found {data.data.length} news items</p>
          {data.data.map(news => (
            <div key={news.id}>
              <h3>{news.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

Then add route and test it.
*/

// ============================================================================
// STEP 7: Create Admin News Page
// ============================================================================

/*
Create src/pages/admin/News.tsx

import React from 'react'
import { useGetAllNews } from '@/hooks/news'
import { useFilteredNews } from '@/hooks/useFilteredNews'
import { useNewsStats } from '@/hooks/useFilteredNews'

export default function AdminNewsPage() {
  const [search, setSearch] = React.useState('')
  const { data, isLoading, error } = useGetAllNews()
  const filtered = useFilteredNews(data?.data, { search })
  const stats = useNewsStats(data?.data)

  return (
    <div className="p-6">
      <h1>News Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Visible</p>
          <p className="text-2xl font-bold">{stats.visible}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Hidden</p>
          <p className="text-2xl font-bold">{stats.hidden}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Recent</p>
          <p className="text-2xl font-bold">{stats.recentCount}</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ابحث عن خبر..."
        className="w-full mb-4 px-4 py-2 border rounded"
      />

      {/* Loading */}
      {isLoading && <p>جاري التحميل...</p>}

      {/* Error */}
      {error && <p className="text-red-500">خطأ: {error.message}</p>}

      {/* List */}
      <div className="grid gap-4">
        {filtered.map(news => (
          <NewsRow key={news.id} news={news} />
        ))}
      </div>
    </div>
  )
}

function NewsRow({ news }: { news: News }) {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{news.name}</h3>
        <p className="text-sm text-gray-600">{news.description.slice(0, 100)}...</p>
        <p className="text-xs text-gray-500">
          {new Date(news.actionDate).toLocaleDateString('ar-SA')}
        </p>
      </div>
      <div className="flex gap-2">
        {/* Add action buttons here */}
      </div>
    </div>
  )
}

import { News } from '@/types/news'
*/

// ============================================================================
// STEP 8: Create Add News Page
// ============================================================================

/*
Create src/pages/admin/CreateNews.tsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddNews } from '@/hooks/news'
import { validateNewsCreateInput } from '@/utils/newsValidation'
import { NewsCreateInput } from '@/types/news'

export default function CreateNewsPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<NewsCreateInput>({
    name: '',
    description: '',
    image: null,
    actionDate: new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const mutation = useAddNews({
    onSuccess: () => navigate('/admin/news')
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateNewsCreateInput(form)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    await mutation.mutateAsync(form)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">إضافة خبر جديد</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-2">اسم الخبر</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full px-4 py-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">الوصف</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`w-full px-4 py-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
            rows={5}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Image */}
        <div>
          <label className="block font-semibold mb-2">الصورة</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
            className={`w-full px-4 py-2 border rounded ${errors.image ? 'border-red-500' : ''}`}
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block font-semibold mb-2">تاريخ الحدث</label>
          <input
            type="date"
            value={form.actionDate}
            onChange={(e) => setForm({ ...form, actionDate: e.target.value })}
            className={`w-full px-4 py-2 border rounded ${errors.actionDate ? 'border-red-500' : ''}`}
          />
          {errors.actionDate && <p className="text-red-500 text-sm">{errors.actionDate}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {mutation.isPending ? 'جاري الإضافة...' : 'إضافة'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
            className="px-6 py-2 bg-gray-500 text-white rounded"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  )
}
*/

// ============================================================================
// STEP 9: Add Routes
// ============================================================================

/*
In src/routes/index.tsx, add routes:

import AdminNewsPage from '@/pages/admin/News'
import CreateNewsPage from '@/pages/admin/CreateNews'

const routes = [
  {
    path: '/admin/news',
    element: <AdminNewsPage />,
    // Protected route
  },
  {
    path: '/admin/news/create',
    element: <CreateNewsPage />,
    // Protected route
  },
  // ... other routes
]
*/

// ============================================================================
// STEP 10: Run Tests
// ============================================================================

/*
Test the following:

1. Navigate to /admin/news
   ✓ Should load and display all news
   ✓ Should show loading skeleton initially
   ✓ Should display error if API fails

2. Navigate to /admin/news/create
   ✓ Should display form
   ✓ Form should validate on submit
   ✓ Should show errors for invalid fields

3. Try to create news
   ✓ Should validate before sending
   ✓ Should show error if validation fails
   ✓ Should show success toast on success
   ✓ Should redirect to /admin/news

4. Try to search/filter news
   ✓ Should filter in real-time
   ✓ Should show correct count
   ✓ Should use memoization (no lag)

5. Try to hide/show news
   ✓ Should toggle visibility
   ✓ Should show toast
   ✓ Should update list

6. Try to delete news
   ✓ Should ask for confirmation
   ✓ Should delete on confirm
   ✓ Should show toast
   ✓ Should update list

7. Check browser dev tools
   ✓ Should have Authorization header
   ✓ Should have Content-Type: multipart/form-data for uploads
   ✓ Should have no console errors
*/

// ============================================================================
// STEP 11: Performance Check
// ============================================================================

/*
1. Open React Query DevTools (if installed)
   $ npm install @tanstack/react-query-devtools

   In App.tsx:
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

   <QueryClientProvider client={queryClient}>
     {/* App */}
     <ReactQueryDevtools initialIsOpen={false} />
   </QueryClientProvider>

2. Check query states:
   ✓ useGetAllNews should cache for 5 minutes
   ✓ useGetVisibleNews should cache for 3 minutes
   ✓ Mutations should invalidate correctly

3. Check filtering performance:
   ✓ useFilteredNews should use memoization
   ✓ Should not re-render unnecessarily
   ✓ Large lists should filter quickly

4. Check loading states:
   ✓ Buttons should be disabled during pending
   ✓ No multiple submissions
   ✓ Clear loading feedback
*/

// ============================================================================
// STEP 12: Error Testing
// ============================================================================

/*
Test error handling:

1. Invalid GUID:
   ✓ Should prevent API call
   ✓ Should show error

2. Network error:
   ✓ Should show error toast
   ✓ Should not crash app
   ✓ Should allow retry

3. Validation error:
   ✓ Should prevent submission
   ✓ Should show field errors
   ✓ Should be in Arabic

4. Server error (5xx):
   ✓ Should show error toast
   ✓ Should display server message

5. 401 Unauthorized:
   ✓ Should redirect to login
   ✓ Should clear auth data
*/

// ============================================================================
// STEP 13: Deployment
// ============================================================================

/*
Before deploying:

1. Run type check:
   $ npm run type-check
   ✓ No errors

2. Run linter:
   $ npm run lint
   ✓ No errors/warnings

3. Build:
   $ npm run build
   ✓ Successfully builds

4. Test build locally:
   $ npm run preview
   ✓ Works correctly

5. Check .env:
   VITE_API_BASE_URL=https://lawm.runasp.net (or your API)

6. Deploy
*/

// ============================================================================
// STEP 14: Post-Deployment Monitoring
// ============================================================================

/*
Monitor in production:

1. Check browser console for errors
2. Monitor API responses
3. Check query cache hits
4. Monitor error toasts frequency
5. Check slow query performance
6. Monitor failed mutations

Set up error tracking (Sentry, etc.) for production.
*/

// ============================================================================
// COMMON ISSUES & SOLUTIONS
// ============================================================================

/*
Issue: FormData not uploading correctly
Solution: Ensure 'Content-Type': 'multipart/form-data' header is set

Issue: Validation errors not showing
Solution: Make sure validateNewsCreateInput is called before mutateAsync

Issue: Multiple toasts on mutation
Solution: Toasts are automatic via onSuccess/onError, don't call toast manually

Issue: Data not updating after mutation
Solution: Queries are auto-invalidated, check query key matches

Issue: Images not loading
Solution: Verify image field path in response (image vs imageUrl)

Issue: Performance lag with large lists
Solution: Use useFilteredNews hook with memoization, not inline filtering

Issue: Queries not caching
Solution: Check staleTime and gcTime settings, use React Query DevTools

Issue: GUID validation failing
Solution: Ensure ID format matches backend (standard GUID format)
*/

// ============================================================================
// QUICK COMMANDS
// ============================================================================

/*
Build project:
$ npm run build

Type check:
$ npm run type-check

Lint:
$ npm run lint

Development:
$ npm run dev

Preview build:
$ npm run preview

Test specific file:
$ npm test src/services/newsService.ts
*/

export {}
