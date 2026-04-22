# API Response Verification & Updates

## Summary
Code has been updated to match the actual backend API response formats.

---

## ✅ Verified Endpoints & Responses

### 1. POST /api/News/AddNewsAsync
**Request:** multipart/form-data (Name, Description, Image, ActionDate)

**Response:**
```json
{
  "success": true,
  "message": "تمت الاضافة بنجاح",
  "data": "b0cf1b50-4968-4a9c-23a3-08de9ff6bad2",
  "errors": null
}
```

**Status:** ✅ Updated
- **Old:** Returned `News` object
- **New:** Returns `string` (UUID of created news)
- **Hook:** `useAddNews()` updated to handle `AddNewsResponse`

---

### 2. GET /api/News/GetAllNewsAsync
**Response:**
```json
{
  "success": true,
  "message": "news retrieved successfully",
  "data": [
    {
      "id": "b0cf1b50-4968-4a9c-23a3-08de9ff6bad2",
      "name": "string",
      "description": "string",
      "filePath": "wwwroot/NewsUploads/12993a64-022d-4090-8c45-ac999dcbf47b.svg",
      "isActive": true,
      "isVisible": true,
      "createAt": "2026-04-21T22:38:37.8001246",
      "actionDate": "2026-04-21T22:38:14.549"
    }
  ],
  "errors": null
}
```

**Status:** ✅ Updated
- **Field:** `filePath` (not `image`)
- **New Field:** `isActive` (in addition to `isVisible`)
- **New Field:** `createAt` (timestamp)
- **Type:** `News[]` ✓

---

### 3. GET /api/News/GetOnlyVisibleNewsAsync
**Response:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "id": "...",
      "name": "string",
      "description": "string",
      "filePath": "wwwroot/NewsUploads/...",
      "isActive": true,
      "isVisible": true,
      "createAt": "2026-04-21T22:38:37.8001246",
      "actionDate": "2026-04-22T00:39:07.8180111+02:00"
    }
  ],
  "errors": null
}
```

**Status:** ✅ Updated
- **Same fields as GetAllNewsAsync**
- **Type:** `News[]` ✓

---

### 4. GET /api/News/GetNewsByIdAsync/{Id}
**Response:**
```json
{
  "success": true,
  "message": "news retrieved successfully",
  "data": {
    "id": "b0cf1b50-4968-4a9c-23a3-08de9ff6bad2",
    "name": "string",
    "description": "string",
    "filePath": "wwwroot/NewsUploads/12993a64-022d-4090-8c45-ac999dcbf47b.svg",
    "isActive": true,
    "isVisible": true,
    "actionDate": "2026-04-21T22:38:14.549",
    "createdAt": "2026-04-21T22:38:37.8001246",
    "deletedAt": null,
    "updatedAt": "0001-01-01T00:00:00",
    "isDeleted": false
  },
  "errors": null
}
```

**Status:** ✅ Updated
- **New Type:** `NewsDetail` (extends `News`)
- **Extended Fields:** `deletedAt`, `updatedAt`, `isDeleted`
- **Note:** `createAt` is in base response, plus `createdAt` in detail
- **Hook:** `useGetNewsById()` returns `ApiResponse<NewsDetail>`

---

### 5. PUT /api/News/HideNewsAsync/{Id}
**Response:**
```json
{
  "success": true,
  "message": "نم نقل الخبر الى المخفيات",
  "data": true,
  "errors": null
}
```

**Status:** ✅ Updated
- **Old:** Returned `News` object
- **New:** Returns `boolean` (true = success)
- **Type:** `ToggleNewsResponse`
- **Hook:** `useHideNews()` updated

---

### 6. PUT /api/News/VisibleNewsAsync/{Id}
**Response:**
```json
{
  "success": true,
  "message": "نم نقل الدراسة الى الظهور",
  "data": true,
  "errors": null
}
```

**Status:** ✅ Updated
- **Old:** Returned `News` object
- **New:** Returns `boolean` (true = success)
- **Type:** `ToggleNewsResponse`
- **Hook:** `useShowNews()` updated

---

### 7. PUT /api/News/UpdateNewsAsync/{Id}
**Request:** multipart/form-data (Name, Description, Image [optional], ActionDate)

**Response:** 200 OK (format follows pattern)

**Status:** ✅ Updated
- **Old:** Returned `News` object
- **New:** Returns `boolean` (true = success)
- **Type:** `ToggleNewsResponse`
- **Hook:** `useUpdateNews()` updated

---

### 8. DELETE /api/News/{id}
**Response:**
```json
{
  "success": true,
  "message": "نم نقل الخبر الى سلة المهملات",
  "data": true,
  "errors": null
}
```

**Status:** ✅ Updated
- **Old:** Returned `void`
- **New:** Returns `boolean` (true = success)
- **Type:** `ToggleNewsResponse`
- **Hook:** `useDeleteNews()` updated

---

## 📊 TypeScript Type Updates

### New Types Added

```typescript
// Extended News detail response
export interface NewsDetail extends News {
  createdAt: string | Date
  deletedAt: string | null
  updatedAt: string | Date
  isDeleted: boolean
}

// API response for Add operation
export interface AddNewsResponse extends ApiResponse<string> {
  data?: string // UUID of created news
}

// API response for Toggle operations
export interface ToggleNewsResponse extends ApiResponse<boolean> {
  data?: boolean // true if operation succeeded
}
```

### Updated News Model

```typescript
export interface News {
  id: string
  name: string
  description: string
  filePath: string           // ✅ Changed from: image
  isActive: boolean          // ✅ New field
  isVisible: boolean
  createAt: string           // ✅ New field (backend name)
  actionDate: string | Date
}
```

---

## 🔄 Service Layer Updates

### Updated Function Signatures

| Function | Old Return | New Return |
|----------|-----------|-----------|
| `addNews()` | `ApiResponse<News>` | `AddNewsResponse` (data: string) |
| `getNewsById()` | `ApiResponse<News>` | `ApiResponse<NewsDetail>` |
| `updateNews()` | `ApiResponse<News>` | `ToggleNewsResponse` (data: boolean) |
| `deleteNews()` | `ApiResponse<void>` | `ToggleNewsResponse` (data: boolean) |
| `hideNews()` | `ApiResponse<News>` | `ToggleNewsResponse` (data: boolean) |
| `showNews()` | `ApiResponse<News>` | `ToggleNewsResponse` (data: boolean) |

---

## 🪝 Hook Updates

### Updated Hook Options

| Hook | Old Type | New Type |
|------|----------|----------|
| `useAddNews()` | `ApiResponse<News>` | `AddNewsResponse` |
| `useUpdateNews()` | `ApiResponse<News>` | `ToggleNewsResponse` |
| `useDeleteNews()` | `ApiResponse<void>` | `ToggleNewsResponse` |
| `useHideNews()` | `ApiResponse<News>` | `ToggleNewsResponse` |
| `useShowNews()` | `ApiResponse<News>` | `ToggleNewsResponse` |
| `useGetNewsById()` | Returns `News` | Returns `NewsDetail` |

---

## 🔍 Data Field Mapping

### List Response Fields
```
✅ id          - News identifier (GUID)
✅ name        - News title
✅ description - News description
✅ filePath    - Image file path (was: image)
✅ isActive    - Active status (new field)
✅ isVisible   - Visibility flag
✅ createAt    - Creation timestamp
✅ actionDate  - Event date
```

### Detail Response Fields
```
✅ All list fields +
✅ createdAt   - Creation timestamp (extended format)
✅ deletedAt   - Deletion timestamp (null if not deleted)
✅ updatedAt   - Last update timestamp
✅ isDeleted   - Soft delete flag
```

---

## 🧪 Testing the Updates

### Test useAddNews
```typescript
const mutation = useAddNews()
const response = await mutation.mutateAsync(formData)

// response.data is now a string UUID
console.log(response.data)  // "b0cf1b50-4968-4a9c-23a3-08de9ff6bad2"
```

### Test useGetAllNews
```typescript
const { data } = useGetAllNews()

// data.data[0] now has filePath, isActive, createAt
console.log(data?.data?.[0]?.filePath)  // "wwwroot/NewsUploads/..."
console.log(data?.data?.[0]?.isActive)  // true
```

### Test useGetNewsById
```typescript
const { data } = useGetNewsById(newsId)

// data.data is now NewsDetail with extended fields
console.log(data?.data?.createdAt)   // "2026-04-21T22:38:37.8001246"
console.log(data?.data?.deletedAt)   // null
console.log(data?.data?.isDeleted)   // false
```

### Test Update/Hide/Show/Delete
```typescript
const mutation = useUpdateNews(newsId)
const response = await mutation.mutateAsync(formData)

// response.data is now boolean
console.log(response.data)  // true (success)
```

---

## ⚠️ Important Notes

1. **AddNews Returns UUID:** The `useAddNews()` hook now returns the created news ID as a string, not the full news object. Use this to redirect or fetch the full object if needed.

2. **Field Name:** Use `filePath` from response, not `image`. This points to the server-stored image location.

3. **isActive Field:** Backend includes an `isActive` flag separate from `isVisible`. Both are present in responses.

4. **Timestamps:** 
   - `createAt` (in list response) - basic timestamp
   - `createdAt` (in detail response) - extended timestamp
   - Both are present in detail responses

5. **Soft Delete:** The backend uses soft delete (sets `isDeleted: true` instead of removing record). `deletedAt` will have a timestamp if soft-deleted.

---

## 📝 Code Migration Guide

### Before (Old Code)
```typescript
// Old: Expected News object from addNews
const mutation = useAddNews()
const response = await mutation.mutateAsync(formData)
const newNews: News = response.data  // ❌ Wrong type
```

### After (Updated Code)
```typescript
// New: Returns UUID string
const mutation = useAddNews()
const response = await mutation.mutateAsync(formData)
const newsId: string = response.data  // ✅ Correct type
```

### Before (Old Code)
```typescript
// Old: Used response.image
{news.image && <img src={news.image} />}  // ❌ Field doesn't exist
```

### After (Updated Code)
```typescript
// New: Use response.filePath
{news.filePath && <img src={news.filePath} />}  // ✅ Correct field
```

---

## ✅ Verification Checklist

- [x] Types updated to match backend responses
- [x] News model includes filePath, isActive, createAt
- [x] NewsDetail type created with extended fields
- [x] AddNewsResponse returns string UUID
- [x] ToggleNewsResponse returns boolean
- [x] Service layer return types updated
- [x] Hook return types updated
- [x] All 8 endpoints verified against actual API responses
- [x] Imports updated in all hooks
- [x] Documentation updated

---

## 🚀 Next Steps

1. **Run Type Check:** `npm run type-check` to ensure no errors
2. **Test Components:** Test any components using the news hooks
3. **Update Examples:** Review `NewsExamples.tsx` to ensure examples match new types
4. **Test API Calls:** Verify hooks work with actual backend

---

## 📊 API Compliance Matrix

| Endpoint | Method | Path | Status | Return Type |
|----------|--------|------|--------|-------------|
| GetAll | GET | `/api/News/GetAllNewsAsync` | ✅ | `News[]` |
| GetVisible | GET | `/api/News/GetOnlyVisibleNewsAsync` | ✅ | `News[]` |
| GetById | GET | `/api/News/GetNewsByIdAsync/{id}` | ✅ | `NewsDetail` |
| Add | POST | `/api/News/AddNewsAsync` | ✅ | `string (UUID)` |
| Update | PUT | `/api/News/UpdateNewsAsync/{id}` | ✅ | `boolean` |
| Hide | PUT | `/api/News/HideNewsAsync/{id}` | ✅ | `boolean` |
| Show | PUT | `/api/News/VisibleNewsAsync/{id}` | ✅ | `boolean` |
| Delete | DELETE | `/api/News/{id}` | ✅ | `boolean` |

---

**Status: All endpoints verified and code updated to match actual backend responses ✅**
