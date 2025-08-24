import { useState } from "react"

const SearchBar = ({
  onSearch,
  onClear,
  placeholder = "Search...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim())
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
  }

  const handleClear = () => {
    setSearchTerm("")
    onSearch("")
    if (onClear) onClear()
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`block w-full pl-12 pr-20 py-2 border rounded-full bg-transparent text-sm placeholder-gray-500 transition-all duration-300 ${
              isFocused
                ? "border-[#8e24aa] ring-2 ring-[#8e24aa] ring-opacity-20 bg-transparent"
                : "border-[#8e24aa]"
            } focus:outline-none`}
          />

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-12 flex items-center px-2 text-gray-400 hover:text-[#8e24aa] transition-colors"
              title="Clear search"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={!searchTerm.trim()}
            className={`absolute inset-y-0 right-0 flex items-center px-4 rounded-r-full transition-all duration-300 ${
              searchTerm.trim()
                ? "text-[#8e24aa] bg-transparent hover:bg-[#e1bee7]"
                : "text-[#8e24aa] bg-transparent cursor-not-allowed hover:bg-[#e1bee7]"
            }`}
            title="Search"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Suggestion Box */}
        {isFocused && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="p-3 text-sm text-gray-500">
              Press Enter or click Search for "{searchTerm}"
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar