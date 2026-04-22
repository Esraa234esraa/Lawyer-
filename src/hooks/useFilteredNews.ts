/**
 * News Filtering & Search Hook
 * Optimized with useMemo for performance
 */

import { useMemo } from 'react'
import { News, NewsFilters } from '@/types/news'

/**
 * Custom hook to filter and search news
 * Uses useMemo to prevent unnecessary re-filtering
 * 
 * @param news Array of news items
 * @param filters Filter criteria
 * @returns Filtered news array
 * 
 * @example
 * const { data: allNews } = useGetAllNews()
 * const filteredNews = useFilteredNews(allNews?.data || [], {
 *   search: 'قانون',
 *   isVisible: true,
 *   sortBy: 'date',
 *   sortOrder: 'desc'
 * })
 */
export const useFilteredNews = (news: News[] | undefined, filters?: NewsFilters) => {
  return useMemo(() => {
    if (!news || news.length === 0) {
      return []
    }

    let filtered = [...news]

    // Apply search filter
    if (filters?.search && filters.search.trim().length > 0) {
      const searchTerm = filters.search.toLowerCase().trim()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
      )
    }

    // Apply visibility filter
    if (typeof filters?.isVisible === 'boolean') {
      filtered = filtered.filter((item) => item.isVisible === filters.isVisible)
    }

    // Apply sorting
    if (filters?.sortBy) {
      filtered.sort((a, b) => {
        let aVal: any
        let bVal: any

        if (filters.sortBy === 'date') {
          aVal = new Date(a.actionDate).getTime()
          bVal = new Date(b.actionDate).getTime()
        } else if (filters.sortBy === 'name') {
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
        }

        if (filters.sortOrder === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
        } else {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        }
      })
    }

    return filtered
  }, [news, filters?.search, filters?.isVisible, filters?.sortBy, filters?.sortOrder])
}

/**
 * Custom hook to group news by date
 * Uses useMemo for optimization
 * 
 * @param news Array of news items
 * @returns Object with dates as keys and news arrays as values
 * 
 * @example
 * const groupedNews = useGroupedNews(allNews?.data)
 * Object.entries(groupedNews).map(([date, items]) => (
 *   <section key={date}>
 *     <h3>{date}</h3>
 *     {items.map(news => <NewsCard key={news.id} news={news} />)}
 *   </section>
 * ))
 */
export const useGroupedNews = (news: News[] | undefined) => {
  return useMemo(() => {
    if (!news || news.length === 0) {
      return {}
    }

    const grouped: Record<string, News[]> = {}

    news.forEach((item) => {
      const date = new Date(item.actionDate)
      const dateKey = date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(item)
    })

    // Sort groups by date (newest first)
    const sorted: Record<string, News[]> = {}
    Object.keys(grouped)
      .sort((a, b) => {
        const dateA = new Date(grouped[a][0].actionDate)
        const dateB = new Date(grouped[b][0].actionDate)
        return dateB.getTime() - dateA.getTime()
      })
      .forEach((key) => {
        sorted[key] = grouped[key]
      })

    return sorted
  }, [news])
}

/**
 * Custom hook to get statistics about news
 * Uses useMemo for optimization
 * 
 * @param news Array of news items
 * @returns Object with statistics
 * 
 * @example
 * const stats = useNewsStats(allNews?.data)
 * <div>
 *   <p>Total: {stats.total}</p>
 *   <p>Visible: {stats.visible}</p>
 *   <p>Hidden: {stats.hidden}</p>
 * </div>
 */
export const useNewsStats = (news: News[] | undefined) => {
  return useMemo(() => {
    if (!news || news.length === 0) {
      return {
        total: 0,
        visible: 0,
        hidden: 0,
        recentCount: 0, // Created in last 7 days
      }
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const visible = news.filter((item) => item.isVisible).length
    const hidden = news.filter((item) => !item.isVisible).length
    const recentCount = news.filter((item) => new Date(item.createAt || item.actionDate) >= sevenDaysAgo).length

    return {
      total: news.length,
      visible,
      hidden,
      recentCount,
    }
  }, [news])
}

/**
 * Custom hook to search news with debouncing
 * Use with search input for better UX
 * 
 * @param news Array of news items
 * @param searchTerm Search term
 * @returns Filtered news matching search term
 * 
 * @example
 * const [search, setSearch] = useState('')
 * const results = useNewsSearch(allNews?.data, search)
 * 
 * <input
 *   type="text"
 *   value={search}
 *   onChange={(e) => setSearch(e.target.value)}
 *   placeholder="ابحث عن خبر..."
 * />
 * {results.map(news => <NewsCard key={news.id} news={news} />)}
 */
export const useNewsSearch = (news: News[] | undefined, searchTerm: string) => {
  return useMemo(() => {
    if (!news || !searchTerm) {
      return news || []
    }

    const term = searchTerm.toLowerCase().trim()
    return news.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    )
  }, [news, searchTerm])
}
