import { useState, useEffect } from "react"

const FilterPanel = ({ onFilter, onClear, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    is_qualified: "",
    city: "",
    state: "",
    created_after: "",
    created_before: "",
    last_activity_after: "",
    last_activity_before: "",
    status_multiple: [],
    source_multiple: [],
  })
  
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    const newFilters = {
      status: currentFilters.status || "",
      source: currentFilters.source || "",
      is_qualified: currentFilters.is_qualified || "",
      city: currentFilters.city || "",
      state: currentFilters.state || "",
      created_after: currentFilters.created_after || "",
      created_before: currentFilters.created_before || "",
      last_activity_after: currentFilters.last_activity_after || "",
      last_activity_before: currentFilters.last_activity_before || "",
      status_multiple: currentFilters.status_in ? currentFilters.status_in.split(',') : [],
      source_multiple: currentFilters.source_in ? currentFilters.source_in.split(',') : [],
    }
    setFilters(newFilters)
  }, [currentFilters])

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'lost', label: 'Lost' },
    { value: 'won', label: 'Won' }
  ]

  const sourceOptions = [
    { value: 'website', label: 'Website' },
    { value: 'facebook_ads', label: 'Facebook Ads' },
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'referral', label: 'Referral' },
    { value: 'events', label: 'Events' },
    { value: 'other', label: 'Other' }
  ]

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleMultiSelectChange = (key, option) => {
    const currentValues = filters[key] || []
    const newValues = currentValues.includes(option)
      ? currentValues.filter(v => v !== option)
      : [...currentValues, option]
    
    handleFilterChange(key, newValues)
  }

  const handleApplyFilters = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && (Array.isArray(value) ? value.length > 0 : true)) {
        if (key === 'status_multiple' && value.length > 0) {
          acc['status_in'] = value.join(',')
        } else if (key === 'source_multiple' && value.length > 0) {
          acc['source_in'] = value.join(',')
        } else if (!key.includes('_multiple')) {
          acc[key] = value
        }
      }
      return acc
    }, {})
    
    onFilter(activeFilters)
    setIsVisible(false)
  }

  const handleClearFilters = () => {
    setFilters({
      status: "",
      source: "",
      is_qualified: "",
      city: "",
      state: "",
      created_after: "",
      created_before: "",
      last_activity_after: "",
      last_activity_before: "",
      status_multiple: [],
      source_multiple: [],
    })
  }

  const toggleFilterPanel = () => {
    setIsVisible(!isVisible)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ""
  )

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) ? value.length > 0 : value !== ""
    ).length
  }

  return (
    <div className="mb-6">
      {/*filter button*/}
      <button
        onClick={toggleFilterPanel}
        className="inline-flex items-center px-6 py-3 border rounded-lg text-sm font-semibold text-white bg-[#8e24aa] hover:bg-[#7b1fa2] transition-all duration-200 shadow-lg hover:shadow-purple-400/40 mb-4"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
            {getActiveFiltersCount()}
          </span>
        )}
        <svg className={`ml-2 w-4 h-4 transition-transform ${isVisible ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/*filter panel*/}
      {isVisible && (
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-2xl">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { 
                  id: 'basic', 
                  name: 'Basic', 
                },
                { 
                  id: 'dates', 
                  name: 'Dates', 
                },
                { 
                  id: 'multi', 
                  name: 'Multi-Select', 
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 font-medium text-sm flex items-center transition-colors duration-300 relative group ${
                    activeTab === tab.id
                      ? 'text-[#7b1fa2]'
                      : 'text-gray-500 hover:text-[#8e24aa]'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#8e24aa] transition-all duration-300 ease-out ${
                    activeTab === tab.id
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}></span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    style={{
                      colorScheme: 'light',
                      accentColor: '#8e24aa'
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>All Statuses</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value} style={{ backgroundColor: 'white', color: '#1f2937' }}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Source</label>
                  <select
                    value={filters.source}
                    onChange={(e) => handleFilterChange("source", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    style={{
                      colorScheme: 'light',
                      accentColor: '#8e24aa'
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>All Sources</option>
                    {sourceOptions.map(option => (
                      <option key={option.value} value={option.value} style={{ backgroundColor: 'white', color: '#1f2937' }}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Qualified Status</label>
                  <select
                    value={filters.is_qualified}
                    onChange={(e) => handleFilterChange("is_qualified", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    style={{
                      colorScheme: 'light',
                      accentColor: '#8e24aa'
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>All</option>
                    <option value="true" style={{ backgroundColor: 'white', color: '#1f2937' }}>Qualified</option>
                    <option value="false" style={{ backgroundColor: 'white', color: '#1f2937' }}>Not Qualified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={filters.state}
                    onChange={(e) => handleFilterChange("state", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    placeholder="Enter state"
                  />
                </div>
              </div>
            )}

            {activeTab === 'dates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Created Date Range</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                      <input
                        type="date"
                        value={filters.created_after}
                        onChange={(e) => handleFilterChange("created_after", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                      <input
                        type="date"
                        value={filters.created_before}
                        onChange={(e) => handleFilterChange("created_before", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Last Activity Date Range</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                      <input
                        type="date"
                        value={filters.last_activity_after}
                        onChange={(e) => handleFilterChange("last_activity_after", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                      <input
                        type="date"
                        value={filters.last_activity_before}
                        onChange={(e) => handleFilterChange("last_activity_before", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'multi' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Multiple Statuses</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {statusOptions.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status_multiple.includes(option.value)}
                          onChange={() => handleMultiSelectChange("status_multiple", option.value)}
                          className="rounded border-gray-300 text-[#8e24aa] shadow-sm focus:border-[#8e24aa] focus:ring focus:ring-[#8e24aa] focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Multiple Sources</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {sourceOptions.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.source_multiple.includes(option.value)}
                          onChange={() => handleMultiSelectChange("source_multiple", option.value)}
                          className="rounded border-gray-300 text-[#8e24aa] shadow-sm focus:border-[#8e24aa] focus:ring focus:ring-[#8e24aa] focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {hasActiveFilters ? `${getActiveFiltersCount()} filter${getActiveFiltersCount() > 1 ? 's' : ''} in form` : 'No filters set'}
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleClearFilters} 
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={!hasActiveFilters}
                >
                  Clear Form
                </button>
                <button 
                  onClick={handleApplyFilters} 
                  className="px-6 py-3 bg-[#8e24aa] text-white font-semibold text-sm rounded-lg hover:bg-[#7b1fa2] transition-all duration-300 shadow-lg hover:shadow-purple-400/40"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel