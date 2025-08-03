import React, { useState, useEffect } from 'react'
import { debounce } from '../lib/utils'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const debouncedSearch = debounce((searchQuery) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }, 300)

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>
    </form>
  )
}

export default SearchBar
