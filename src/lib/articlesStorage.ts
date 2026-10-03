import { useEffect, useState } from 'react'
import { articles as defaultArticles, type Article } from '@/data/articles'

const STORAGE_KEY = 'garut_journey_articles_v2'
const CHANGE_EVENT = 'garut_articles_updated'

/** Safe retrieval of articles list (SSR friendly) */
export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') {
    return defaultArticles
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultArticles))
      return defaultArticles
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch (err) {
    console.error('Failed to load articles from storage:', err)
  }
  return defaultArticles
}

/** Get single article by slug from storage or fallback */
export function getArticleFromStorage(slug: string): Article | undefined {
  const all = getStoredArticles()
  return all.find((a) => a.slug === slug)
}

/** Save or update article in localStorage */
export function saveArticleToStorage(article: Article): boolean {
  if (typeof window === 'undefined') return false
  try {
    const current = getStoredArticles()
    const index = current.findIndex((a) => a.slug === article.slug)
    let updated: Article[]
    if (index >= 0) {
      updated = [...current]
      updated[index] = { ...article }
    } else {
      // Prepend newest article
      updated = [{ ...article }, ...current]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: updated }))
    return true
  } catch (err) {
    console.error('Failed to save article:', err)
    return false
  }
}

/** Delete an article by slug */
export function deleteArticleFromStorage(slug: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const current = getStoredArticles()
    const updated = current.filter((a) => a.slug !== slug)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: updated }))
    return true
  } catch (err) {
    console.error('Failed to delete article:', err)
    return false
  }
}

/** Reset articles to initial default dataset */
export function resetArticlesStorage(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultArticles))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: defaultArticles }))
  } catch (err) {
    console.error('Failed to reset articles:', err)
  }
}

/** React hook for live articles state */
export function useArticles() {
  const [items, setItems] = useState<Article[]>(defaultArticles)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setItems(getStoredArticles())

    const handleUpdate = () => {
      setItems(getStoredArticles())
    }

    window.addEventListener(CHANGE_EVENT, handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener(CHANGE_EVENT, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return {
    articles: items,
    isClient,
    saveArticle: saveArticleToStorage,
    deleteArticle: deleteArticleFromStorage,
    resetToDefault: resetArticlesStorage,
  }
}
