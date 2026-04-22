/**
 * News Management Implementation Examples
 * Complete usage patterns for news data layer
 */

import React, { useState } from 'react'
import {
  useGetAllNews,
  useGetVisibleNews,
  useGetNewsById,
  useAddNews,
  useUpdateNews,
  useDeleteNews,
  useHideNews,
  useShowNews,
} from '@/hooks/news'
import { useFilteredNews, useNewsSearch, useNewsStats } from '@/hooks/useFilteredNews'
import { validateNewsCreateInput, validateNewsUpdateInput } from '@/utils/newsValidation'
import { NewsCreateInput, NewsUpdateInput, News } from '@/types/news'
import React from 'react'

// ============================================================================
// Example 1: News List with Loading States
// ============================================================================

/**
 * Basic news list with loading skeleton
 * Demonstrates useGetAllNews hook with loading states
 */
export function NewsListExample() {
  const { data, isLoading, isFetching, error } = useGetAllNews({
    staleTime: 5 * 60 * 1000,
  })

  // Loading state
  if (isLoading) {
    return <div className="space-y-4">{Array(3).fill(0).map((_, i) => <NewsSkeletonLoader key={i} />)}</div>
  }

  // Error state
  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  // Empty state
  if (!data?.data || data.data.length === 0) {
    return <div className="text-gray-500">No news found</div>
  }

  // Success state
  return (
    <div className="space-y-4">
      {/* Refetching indicator */}
      {isFetching && <div className="text-blue-500 text-sm">Updating...</div>}

      {/* News list */}
      <div className="grid gap-4">
        {data.data.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Example 2: Filtered News with Memoization
// ============================================================================

/**
 * News list with filtering
 * Demonstrates useFilteredNews for optimized filtering
 */
export function FilteredNewsExample() {
  const [filters, setFilters] = useState({ search: '', isVisible: true })

  // Fetch all news
  const { data, isLoading } = useGetAllNews()

  // Memoized filtered results
  const filteredNews = useFilteredNews(data?.data, {
    search: filters.search,
    isVisible: filters.isVisible,
    sortBy: 'date',
    sortOrder: 'desc',
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      {/* Search input */}
      <input
        type="text"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        placeholder="ابحث عن خبر..."
        className="w-full px-4 py-2 border rounded"
      />

      {/* Visibility filter */}
      <button
        onClick={() => setFilters({ ...filters, isVisible: !filters.isVisible })}
        className={`px-4 py-2 rounded ${filters.isVisible ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {filters.isVisible ? 'Visible Only' : 'All News'}
      </button>

      {/* Results */}
      <div className="text-sm text-gray-600">Found {filteredNews.length} items</div>

      {/* Filtered list */}
      <div className="space-y-2">
        {filteredNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Example 3: News Creation Form with Validation
// ============================================================================

/**
 * Form to create new news
 * Demonstrates useAddNews mutation with validation
 */
export function CreateNewsFormExample() {
  const [formData, setFormData] = useState<NewsCreateInput>({
    name: '',
    description: '',
    image: null,
    actionDate: new Date().toISOString().split('T')[0],
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Mutation for creating news
  const addNewsMutation = useAddNews({
    onSuccess: () => {
      // Reset form on success
      setFormData({
        name: '',
        description: '',
        image: null,
        actionDate: new Date().toISOString().split('T')[0],
      })
      setValidationErrors({})
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate before sending
    const validation = validateNewsCreateInput(formData)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    // Clear previous errors
    setValidationErrors({})

    // Send to API
    await addNewsMutation.mutateAsync(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* Name field */}
      <div>
        <label className="block text-sm font-semibold mb-1">News Title</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded ${validationErrors.name ? 'border-red-500' : ''}`}
          disabled={addNewsMutation.isPending}
        />
        {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
      </div>

      {/* Description field */}
      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`w-full px-4 py-2 border rounded ${validationErrors.description ? 'border-red-500' : ''}`}
          disabled={addNewsMutation.isPending}
          rows={4}
        />
        {validationErrors.description && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
        )}
      </div>

      {/* Image field */}
      <div>
        <label className="block text-sm font-semibold mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
          className={`w-full px-4 py-2 border rounded ${validationErrors.image ? 'border-red-500' : ''}`}
          disabled={addNewsMutation.isPending}
        />
        {validationErrors.image && <p className="text-red-500 text-sm mt-1">{validationErrors.image}</p>}
      </div>

      {/* Date field */}
      <div>
        <label className="block text-sm font-semibold mb-1">Action Date</label>
        <input
          type="date"
          value={formData.actionDate}
          onChange={(e) => setFormData({ ...formData, actionDate: e.target.value })}
          className={`w-full px-4 py-2 border rounded ${validationErrors.actionDate ? 'border-red-500' : ''}`}
          disabled={addNewsMutation.isPending}
        />
        {validationErrors.actionDate && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.actionDate}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={addNewsMutation.isPending}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {addNewsMutation.isPending ? 'Creating...' : 'Create News'}
      </button>
    </form>
  )
}

// ============================================================================
// Example 4: News Detail with Edit Capability
// ============================================================================

/**
 * Detail view with edit functionality
 * Demonstrates useGetNewsById and useUpdateNews
 */
export function NewsDetailExample({ newsId }: { newsId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<NewsUpdateInput | null>(null)

  // Fetch news detail
  const { data: newsDetail, isLoading, error } = useGetNewsById(newsId)

  // Mutation for updating
  const updateMutation = useUpdateNews(newsId, {
    onSuccess: () => {
      setIsEditing(false)
      setFormData(null)
    },
  })

  const handleEdit = () => {
    if (newsDetail?.data) {
      setFormData({
        name: newsDetail.data.name,
        description: newsDetail.data.description,
        actionDate: newsDetail.data.actionDate,
        image: undefined,
      })
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (!formData) return

    const validation = validateNewsUpdateInput(formData)
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors)
      return
    }

    await updateMutation.mutateAsync(formData)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Error: {error.message}</div>
  if (!newsDetail?.data) return <div>Not found</div>

  const news = newsDetail.data

  return (
    <div className="max-w-2xl space-y-4">
      {!isEditing ? (
        <>
          {/* Detail view */}
          <h1 className="text-3xl font-bold">{news.name}</h1>
          <img src={news.image || news.imageUrl} alt={news.name} className="w-full h-96 object-cover rounded" />
          <p className="text-gray-600">{news.description}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(news.actionDate).toLocaleDateString('ar-SA')}
          </p>
          <p className="text-sm">Status: {news.isVisible ? 'Visible' : 'Hidden'}</p>

          <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded">
            Edit
          </button>
        </>
      ) : (
        <>
          {/* Edit form */}
          <input
            type="text"
            value={formData?.name || ''}
            onChange={(e) => setFormData({ ...formData!, name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            value={formData?.description || ''}
            onChange={(e) => setFormData({ ...formData!, description: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            rows={4}
          />
          <input
            type="date"
            value={new Date(formData?.actionDate || '').toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData!, actionDate: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />

          <div className="space-x-2">
            <button onClick={handleSave} disabled={updateMutation.isPending} className="px-4 py-2 bg-green-500 text-white rounded">
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// Example 5: News Actions (Hide/Show/Delete)
// ============================================================================

/**
 * News card with action buttons
 * Demonstrates useHideNews, useShowNews, useDeleteNews
 */
export function NewsCardWithActionsExample({ news }: { news: News }) {
  const hideMutation = useHideNews()
  const showMutation = useShowNews()
  const deleteMutation = useDeleteNews()

  const isActionPending = hideMutation.isPending || showMutation.isPending || deleteMutation.isPending

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold">{news.name}</h3>
      <p className="text-sm text-gray-600 mt-2">{news.description}</p>

      <div className="mt-4 flex gap-2">
        {/* Toggle visibility */}
        {news.isVisible ? (
          <button
            onClick={() => hideMutation.mutate(news.id)}
            disabled={isActionPending}
            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded disabled:opacity-50"
          >
            {hideMutation.isPending ? 'Hiding...' : 'Hide'}
          </button>
        ) : (
          <button
            onClick={() => showMutation.mutate(news.id)}
            disabled={isActionPending}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded disabled:opacity-50"
          >
            {showMutation.isPending ? 'Showing...' : 'Show'}
          </button>
        )}

        {/* Delete */}
        <button
          onClick={() => {
            if (confirm('Delete this news?')) {
              deleteMutation.mutate(news.id)
            }
          }}
          disabled={isActionPending}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded disabled:opacity-50"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Placeholder Components
// ============================================================================

function NewsSkeletonLoader() {
  return (
    <div className="p-4 border rounded animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-300 rounded w-full mb-2" />
      <div className="h-3 bg-gray-300 rounded w-5/6" />
    </div>
  )
}

function NewsCard({ news }: { news: News }) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold">{news.name}</h3>
      <p className="text-sm text-gray-600">{news.description.slice(0, 100)}...</p>
    </div>
  )
}
