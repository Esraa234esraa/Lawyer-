# News API - Implementation Testing Guide

## 🎯 Overview

All 8 news endpoints have been verified against actual backend responses and the code has been updated to match exactly.

---

## ✅ Files Updated

### Core Files
- ✅ `src/types/news.ts` - Updated News and NewsDetail types
- ✅ `src/services/newsService.ts` - Updated return types to match actual responses
- ✅ `src/hooks/news/*.ts` - All 8 hooks updated with correct types

### Documentation
- ✅ `API_RESPONSE_VERIFICATION.md` - Complete verification of all endpoints

---

## 🧪 Test Plan

### Phase 1: Type Validation
```bash
npm run type-check
```
Expected: No errors

### Phase 2: Individual Hook Testing

#### Test 1: Fetch All News
```typescript
import { useGetAllNews } from '@/hooks/news'

export function TestGetAll() {
  const { data, isLoading, error } = useGetAllNews()

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.data && (
        <div>
          <p>Total: {data.data.length}</p>
          {data.data.map(news => (
            <div key={news.id}>
              <h3>{news.name}</h3>
              <p>Path: {news.filePath}</p>
              <p>Active: {news.isActive ? 'Yes' : 'No'}</p>
              <p>Visible: {news.isVisible ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "news retrieved successfully",
  "data": [
    {
      "id": "b0cf1b50-4968-4a9c-23a3-08de9ff6bad2",
      "name": "string",
      "description": "string",
      "filePath": "wwwroot/NewsUploads/...",
      "isActive": true,
      "isVisible": true,
      "createAt": "2026-04-21T22:38:37.8001246",
      "actionDate": "2026-04-21T22:38:14.549"
    }
  ]
}
```

✅ **Assertions:**
- [ ] `filePath` field exists (not `image`)
- [ ] `isActive` field is present
- [ ] `createAt` field is present
- [ ] `isVisible` field is present
- [ ] No TypeScript errors

---

#### Test 2: Fetch Visible News (Public)
```typescript
import { useGetVisibleNews } from '@/hooks/news'

export function TestGetVisible() {
  const { data, isLoading } = useGetVisibleNews()

  return (
    <div>
      {isLoading ? 'Loading...' : `Found ${data?.data?.length || 0} visible news`}
      {data?.data?.map(news => (
        <p key={news.id}>{news.name} - {news.isVisible ? 'Visible' : 'Hidden'}</p>
      ))}
    </div>
  )
}
```

✅ **Assertions:**
- [ ] All items have `isVisible: true`
- [ ] Response structure matches GetAll

---

#### Test 3: Fetch Single News
```typescript
import { useGetNewsById } from '@/hooks/news'

export function TestGetById() {
  const { data, isLoading, error } = useGetNewsById('b0cf1b50-4968-4a9c-23a3-08de9ff6bad2')

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.data && (
        <div>
          <h2>{data.data.name}</h2>
          <img src={data.data.filePath} alt={data.data.name} />
          <p>Created: {new Date(data.data.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(data.data.updatedAt).toLocaleString()}</p>
          <p>Deleted: {data.data.isDeleted ? 'Yes' : 'No'}</p>
          <p>Soft Delete At: {data.data.deletedAt || 'N/A'}</p>
        </div>
      )}
    </div>
  )
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "b0cf1b50-4968-4a9c-23a3-08de9ff6bad2",
    "name": "string",
    "description": "string",
    "filePath": "wwwroot/NewsUploads/...",
    "isActive": true,
    "isVisible": true,
    "actionDate": "2026-04-21T22:38:14.549",
    "createdAt": "2026-04-21T22:38:37.8001246",
    "deletedAt": null,
    "updatedAt": "0001-01-01T00:00:00",
    "isDeleted": false
  }
}
```

✅ **Assertions:**
- [ ] Extended fields present: `createdAt`, `deletedAt`, `updatedAt`, `isDeleted`
- [ ] `deletedAt` is `null` for active news
- [ ] `isDeleted` is `false`
- [ ] Type is `NewsDetail` (not `News`)

---

#### Test 4: Create News
```typescript
import { useAddNews } from '@/hooks/news'

export function TestAdd() {
  const mutation = useAddNews({
    onSuccess: (response) => {
      console.log('Created news ID:', response.data)
    }
  })

  const handleCreate = async () => {
    const formData = new FormData()
    formData.append('Name', 'Test News')
    formData.append('Description', 'Test Description')
    formData.append('ActionDate', new Date().toISOString())

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput?.files?.[0]) {
      formData.append('Image', fileInput.files[0])
    }

    try {
      const response = await mutation.mutateAsync({
        name: 'Test News',
        description: 'Test Description',
        image: fileInput?.files?.[0],
        actionDate: new Date()
      })

      console.log('Response data (UUID):', response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <button onClick={handleCreate} disabled={mutation.isPending}>
      {mutation.isPending ? 'Creating...' : 'Create'}
    </button>
  )
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "تمت الاضافة بنجاح",
  "data": "b0cf1b50-4968-4a9c-23a3-08de9ff6bad2",
  "errors": null
}
```

✅ **Assertions:**
- [ ] `data` is a string (UUID), not an object
- [ ] Can be used to fetch the created news immediately
- [ ] Success toast shows Arabic message
- [ ] Query is invalidated

---

#### Test 5: Update News
```typescript
import { useUpdateNews } from '@/hooks/news'

export function TestUpdate() {
  const mutation = useUpdateNews('b0cf1b50-4968-4a9c-23a3-08de9ff6bad2', {
    onSuccess: () => {
      console.log('Updated successfully')
    }
  })

  const handleUpdate = async () => {
    try {
      const response = await mutation.mutateAsync({
        name: 'Updated Name',
        description: 'Updated Description',
        actionDate: new Date()
      })

      console.log('Success:', response.data)  // Should be: true
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <button onClick={handleUpdate} disabled={mutation.isPending}>
      {mutation.isPending ? 'Updating...' : 'Update'}
    </button>
  )
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "...",
  "data": true,
  "errors": null
}
```

✅ **Assertions:**
- [ ] `data` is `true` (boolean), not a News object
- [ ] Toast shows success message
- [ ] Query is invalidated

---

#### Test 6: Hide News
```typescript
import { useHideNews } from '@/hooks/news'

export function TestHide() {
  const mutation = useHideNews()

  const handleHide = async () => {
    try {
      const response = await mutation.mutateAsync('b0cf1b50-4968-4a9c-23a3-08de9ff6bad2')
      console.log('Hidden:', response.data)  // Should be: true
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <button onClick={handleHide} disabled={mutation.isPending}>
      Hide
    </button>
  )
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "نم نقل الخبر الى المخفيات",
  "data": true,
  "errors": null
}
```

✅ **Assertions:**
- [ ] `data` is `true`
- [ ] Arabic message displayed in toast
- [ ] News no longer appears in `useGetVisibleNews()`

---

#### Test 7: Show News
```typescript
import { useShowNews } from '@/hooks/news'

export function TestShow() {
  const mutation = useShowNews()

  const handleShow = async () => {
    try {
      const response = await mutation.mutateAsync('b0cf1b50-4968-4a9c-23a3-08de9ff6bad2')
      console.log('Shown:', response.data)  // Should be: true
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <button onClick={handleShow} disabled={mutation.isPending}>
      Show
    </button>
  )
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "نم نقل الدراسة الى الظهور",
  "data": true,
  "errors": null
}
```

✅ **Assertions:**
- [ ] `data` is `true`
- [ ] Arabic message displayed
- [ ] News appears in `useGetVisibleNews()` again

---

#### Test 8: Delete News
```typescript
import { useDeleteNews } from '@/hooks/news'

export function TestDelete() {
  const mutation = useDeleteNews()

  const handleDelete = async () => {
    if (confirm('Delete this news?')) {
      try {
        const response = await mutation.mutateAsync('b0cf1b50-4968-4a9c-23a3-08de9ff6bad2')
        console.log('Deleted:', response.data)  // Should be: true
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  return (
    <button onClick={handleDelete} disabled={mutation.isPending} className="bg-red-500">
      Delete
    </button>
  )
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "نم نقل الخبر الى سلة المهملات",
  "data": true,
  "errors": null
}
```

✅ **Assertions:**
- [ ] `data` is `true`
- [ ] Arabic soft-delete message shown
- [ ] Item soft-deleted (isDeleted: true)

---

## 🔍 Response Field Validation

### List Response Fields
```typescript
// From: useGetAllNews(), useGetVisibleNews()
interface News {
  id: string                    // ✅ UUID
  name: string                  // ✅ Title
  description: string           // ✅ Body
  filePath: string              // ✅ Image location (NOT 'image')
  isActive: boolean             // ✅ Active flag (NEW)
  isVisible: boolean            // ✅ Visibility flag
  createAt: string              // ✅ Creation timestamp (NEW)
  actionDate: string | Date     // ✅ Event date
}
```

### Detail Response Fields
```typescript
// From: useGetNewsById()
interface NewsDetail extends News {
  createdAt: string | Date      // ✅ Extended format
  deletedAt: string | null      // ✅ Soft delete timestamp
  updatedAt: string | Date      // ✅ Last update
  isDeleted: boolean            // ✅ Soft delete flag
}
```

---

## 📋 Integration Test Checklist

```
General
- [ ] npm run type-check passes
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All hooks import correctly

Fetch Operations
- [ ] useGetAllNews() returns News[] with filePath, isActive, createAt
- [ ] useGetVisibleNews() returns only visible news
- [ ] useGetNewsById() returns NewsDetail with extended fields
- [ ] GUID validation works before API call
- [ ] Invalid IDs throw appropriate errors

Create Operation
- [ ] useAddNews() accepts file upload
- [ ] Form validation works before submission
- [ ] Returns UUID string (not News object)
- [ ] Success toast shows Arabic message
- [ ] Queries invalidated automatically
- [ ] Can immediately fetch using returned ID

Update Operation
- [ ] useUpdateNews() accepts name, description, image (optional)
- [ ] Image upload is optional
- [ ] Returns boolean true
- [ ] Success toast shows message
- [ ] Queries invalidated

Delete/Hide/Show
- [ ] useDeleteNews/hideNews/showNews return boolean
- [ ] Success toasts show Arabic messages
- [ ] Queries properly invalidated
- [ ] Multiple operations don't conflict

Error Handling
- [ ] Invalid GUID prevents API call
- [ ] Network errors show in toast
- [ ] Validation errors display correctly
- [ ] Server errors display backend message

Performance
- [ ] List queries cache correctly
- [ ] No unnecessary re-renders
- [ ] Filtering works smoothly with useMemo
- [ ] Mutations don't timeout

```

---

## 🚀 Deployment Checklist

Before deploying:

- [ ] All tests pass
- [ ] Type check clean
- [ ] Build succeeds (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] No console warnings/errors
- [ ] API responses match documentation
- [ ] All 8 endpoints tested
- [ ] Error messages localized (Arabic)

---

## 📞 Common Test Issues & Solutions

### Issue: "Cannot read property 'filePath'"
**Solution:** The response field is `filePath`, not `image`. Check `News` type definition.

### Issue: "data is not a string in addNews"
**Solution:** Response `data` field is now a UUID string for addNews. Check you're accessing `response.data` correctly.

### Issue: "data is not a boolean in delete"
**Solution:** Delete/Hide/Show operations return boolean `true`, not News object.

### Issue: "Cannot find NewsDetail type"
**Solution:** Update imports to: `import { NewsDetail } from '@/types/news'`

### Issue: Type mismatch in useGetNewsById
**Solution:** Return type is now `ApiResponse<NewsDetail>`, not `ApiResponse<News>`.

---

## ✅ Verification Summary

**All API endpoints verified:**
- ✅ GET /api/News/GetAllNewsAsync
- ✅ GET /api/News/GetOnlyVisibleNewsAsync
- ✅ GET /api/News/GetNewsByIdAsync/{id}
- ✅ POST /api/News/AddNewsAsync
- ✅ PUT /api/News/UpdateNewsAsync/{id}
- ✅ PUT /api/News/HideNewsAsync/{id}
- ✅ PUT /api/News/VisibleNewsAsync/{id}
- ✅ DELETE /api/News/{id}

**All types updated:**
- ✅ News model with filePath, isActive, createAt
- ✅ NewsDetail model with extended fields
- ✅ AddNewsResponse with string data
- ✅ ToggleNewsResponse with boolean data

**All hooks updated:**
- ✅ useGetAllNews()
- ✅ useGetVisibleNews()
- ✅ useGetNewsById()
- ✅ useAddNews()
- ✅ useUpdateNews()
- ✅ useDeleteNews()
- ✅ useHideNews()
- ✅ useShowNews()

---

**Status: All API responses verified and code updated ✅**
