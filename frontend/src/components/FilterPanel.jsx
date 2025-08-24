import { useState, useEffect } from "react"

const FilterPanel = ({ onFilter, onClear, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    //basic filters
    status: "",
    source: "",
    is_qualified: "",
    city: "",
    state: "",
    
    //string operators
    email_equals: "",
    email_contains: "",
    company_equals: "",
    company_contains: "",
    city_equals: "",
    city_contains: "",
    
    //number based operators
    score_equals: "",
    score_gt: "",
    score_lt: "",
    score_between_min: "",
    score_between_max: "",
    lead_value_equals: "",
    lead_value_gt: "",
    lead_value_lt: "",
    lead_value_between_min: "",
    lead_value_between_max: "",
    
    //date operators
    created_on: "",
    created_after: "",
    created_before: "",
    created_between_start: "",
    created_between_end: "",
    last_activity_on: "",
    last_activity_after: "",
    last_activity_before: "",
    last_activity_between_start: "",
    last_activity_between_end: "",
    
    //muliple select filters
    status_multiple: [],
    source_multiple: [],
    city_multiple: [],
    state_multiple: [],
  })
  
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [expandedSections, setExpandedSections] = useState({})

  useEffect(() => {
    const newFilters = { ...filters }
    Object.keys(currentFilters).forEach(key => {
      const value = currentFilters[key]
      
      if (key.endsWith('_in')) {
        const baseKey = key.replace('_in', '_multiple')
        newFilters[baseKey] = value ? value.split(',') : []
      } else if (key.endsWith('_between')) {
        const baseKey = key.replace('_between', '')
        const [min, max] = value ? value.split(',') : ['', '']
        newFilters[`${baseKey}_between_min`] = min || ""
        newFilters[`${baseKey}_between_max`] = max || ""
      } else if (key === 'created_between') {
        const [start, end] = value ? value.split(',') : ['', '']
        newFilters.created_between_start = start || ""
        newFilters.created_between_end = end || ""
      } else if (key === 'last_activity_between') {
        const [start, end] = value ? value.split(',') : ['', '']
        newFilters.last_activity_between_start = start || ""
        newFilters.last_activity_between_end = end || ""
      } else {
        newFilters[key] = value || ""
      }
    })
    
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

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const handleApplyFilters = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && (Array.isArray(value) ? value.length > 0 : true)) {
        
        //handle multi-select filters
        if (key === 'status_multiple' && value.length > 0) {
          acc['status_in'] = value.join(',')
        } else if (key === 'source_multiple' && value.length > 0) {
          acc['source_in'] = value.join(',')
        } else if (key === 'city_multiple' && value.length > 0) {
          acc['city_in'] = value.join(',')
        } else if (key === 'state_multiple' && value.length > 0) {
          acc['state_in'] = value.join(',')
        }
        
        //handle between filters
        else if (key.endsWith('_between_min')) {
          const baseKey = key.replace('_between_min', '')
          const maxKey = `${baseKey}_between_max`
          const maxValue = filters[maxKey]
          if (value && maxValue) {
            acc[`${baseKey}_between`] = `${value},${maxValue}`
          }
        } else if (key.endsWith('_between_max')) {
          //skip
        }
        
        //handle date between filters
        else if (key === 'created_between_start') {
          const endValue = filters.created_between_end
          if (value && endValue) {
            acc['created_between'] = `${value},${endValue}`
          }
        } else if (key === 'created_between_end') {
          //skip
        } else if (key === 'last_activity_between_start') {
          const endValue = filters.last_activity_between_end
          if (value && endValue) {
            acc['last_activity_between'] = `${value},${endValue}`
          }
        } else if (key === 'last_activity_between_end') {
          //skip
        }
        
        //handle regular filters
        else if (!key.includes('_multiple') && !key.includes('_between_')) {
          acc[key] = value
        }
      }
      return acc
    }, {})
    
    onFilter(activeFilters)
    setIsVisible(false)
  }

  const handleClearFilters = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = Array.isArray(filters[key]) ? [] : ""
      return acc
    }, {})
    setFilters(clearedFilters)
    setExpandedSections({}) 
    onClear()
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

  const CollapsibleSection = ({ title, sectionKey, children }) => {
    const isExpanded = expandedSections[sectionKey]
    
    return (
      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg flex justify-between items-center transition-colors"
        >
          <span className="text-sm font-semibold text-gray-900 truncate pr-2">{title}</span>
          <svg 
            className={`w-4 h-4 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && (
          <div className="p-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mb-6">
      {/*filter button*/}
      <button
        onClick={toggleFilterPanel}
        className="inline-flex items-center px-4 sm:px-6 py-3 border rounded-lg text-sm font-semibold text-white border-[#8e24aa] bg-[#8e24aa] hover:bg-[#7b1fa2] transition-all duration-200 shadow-lg mb-4"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
        <span className="hidden sm:inline">Advanced Filters</span>
        <span className="sm:hidden">Filters</span>
        {hasActiveFilters && (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
            {getActiveFiltersCount()}
          </span>
        )}
        <svg className={`ml-2 w-4 h-4 transition-transform ${isVisible ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/*filters panel*/}
      {isVisible && (
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-2xl">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max" aria-label="Tabs">
              {[
                { id: 'basic', name: 'Basic' },
                { id: 'strings', name: 'Text Fields' },
                { id: 'numbers', name: 'Numbers' },
                { id: 'dates', name: 'Dates' },
                { id: 'multi', name: 'Multi-Select' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors duration-300 relative group ${
                    activeTab === tab.id
                      ? 'text-[#7b1fa2]'
                      : 'text-gray-500 hover:text-[#8e24aa]'
                  }`}
                >
                  {tab.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#8e24aa] transition-all duration-300 ease-out ${
                    activeTab === tab.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Source</label>
                  <select
                    value={filters.source}
                    onChange={(e) => handleFilterChange("source", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">All Sources</option>
                    {sourceOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Qualified Status</label>
                  <select
                    value={filters.is_qualified}
                    onChange={(e) => handleFilterChange("is_qualified", e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Qualified</option>
                    <option value="false">Not Qualified</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'strings' && (
              <div className="space-y-4">
                <CollapsibleSection title="Email Filters" sectionKey="email">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email Equals</label>
                      <input
                        type="email"
                        value={filters.email_equals}
                        onChange={(e) => handleFilterChange("email_equals", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="exact@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email Contains</label>
                      <input
                        type="text"
                        value={filters.email_contains}
                        onChange={(e) => handleFilterChange("email_contains", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="gmail"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Company Filters" sectionKey="company">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Company Equals</label>
                      <input
                        type="text"
                        value={filters.company_equals}
                        onChange={(e) => handleFilterChange("company_equals", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="Exact Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Company Contains</label>
                      <input
                        type="text"
                        value={filters.company_contains}
                        onChange={(e) => handleFilterChange("company_contains", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="Tech"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Location Filters" sectionKey="location">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">City Equals</label>
                      <input
                        type="text"
                        value={filters.city_equals}
                        onChange={(e) => handleFilterChange("city_equals", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">City Contains</label>
                      <input
                        type="text"
                        value={filters.city_contains}
                        onChange={(e) => handleFilterChange("city_contains", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="York"
                      />
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            )}

            {activeTab === 'numbers' && (
              <div className="space-y-4">
                <CollapsibleSection title="Score Filters" sectionKey="score">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Score Equals</label>
                      <input
                        type="number"
                        value={filters.score_equals}
                        onChange={(e) => handleFilterChange("score_equals", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="85"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Score Greater Than</label>
                      <input
                        type="number"
                        value={filters.score_gt}
                        onChange={(e) => handleFilterChange("score_gt", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Score Less Than</label>
                      <input
                        type="number"
                        value={filters.score_lt}
                        onChange={(e) => handleFilterChange("score_lt", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="90"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-700 mb-2">Score Between</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={filters.score_between_min}
                        onChange={(e) => handleFilterChange("score_between_min", e.target.value)}
                        className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={filters.score_between_max}
                        onChange={(e) => handleFilterChange("score_between_max", e.target.value)}
                        className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Lead Value Filters" sectionKey="leadValue">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Value Equals</label>
                      <input
                        type="number"
                        step="0.01"
                        value={filters.lead_value_equals}
                        onChange={(e) => handleFilterChange("lead_value_equals", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="1000.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Value Greater Than</label>
                      <input
                        type="number"
                        step="0.01"
                        value={filters.lead_value_gt}
                        onChange={(e) => handleFilterChange("lead_value_gt", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="500.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Value Less Than</label>
                      <input
                        type="number"
                        step="0.01"
                        value={filters.lead_value_lt}
                        onChange={(e) => handleFilterChange("lead_value_lt", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="2000.00"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-700 mb-2">Value Between</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={filters.lead_value_between_min}
                        onChange={(e) => handleFilterChange("lead_value_between_min", e.target.value)}
                        className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="Min Value"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={filters.lead_value_between_max}
                        onChange={(e) => handleFilterChange("lead_value_between_max", e.target.value)}
                        className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="Max Value"
                      />
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            )}

            {activeTab === 'dates' && (
              <div className="space-y-4">
                <CollapsibleSection title="Created Date Filters" sectionKey="createdDate">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Created On (Exact Date)</label>
                      <input
                        type="date"
                        value={filters.created_on}
                        onChange={(e) => handleFilterChange("created_on", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Created After</label>
                      <input
                        type="date"
                        value={filters.created_after}
                        onChange={(e) => handleFilterChange("created_after", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Created Before</label>
                      <input
                        type="date"
                        value={filters.created_before}
                        onChange={(e) => handleFilterChange("created_before", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-700 mb-2">Created Between</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={filters.created_between_start}
                        onChange={(e) => handleFilterChange("created_between_start", e.target.value)}
                        className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={filters.created_between_end}
                        onChange={(e) => handleFilterChange("created_between_end", e.target.value)}
                        className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Last Activity Date Filters" sectionKey="lastActivityDate">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Last Activity On</label>
                      <input
                        type="date"
                        value={filters.last_activity_on}
                        onChange={(e) => handleFilterChange("last_activity_on", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Last Activity After</label>
                      <input
                        type="date"
                        value={filters.last_activity_after}
                        onChange={(e) => handleFilterChange("last_activity_after", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Last Activity Before</label>
                      <input
                        type="date"
                        value={filters.last_activity_before}
                        onChange={(e) => handleFilterChange("last_activity_before", e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-700 mb-2">Last Activity Between</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={filters.last_activity_between_start}
                        onChange={(e) => handleFilterChange("last_activity_between_start", e.target.value)}
                        className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={filters.last_activity_between_end}
                        onChange={(e) => handleFilterChange("last_activity_between_end", e.target.value)}
                        className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            )}

            {activeTab === 'multi' && (
              <div className="space-y-4">
                <CollapsibleSection title="Multiple Status Selection" sectionKey="multiStatus">
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
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
                </CollapsibleSection>

                <CollapsibleSection title="Multiple Source Selection" sectionKey="multiSource">
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
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
                </CollapsibleSection>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <CollapsibleSection title="Multiple Cities" sectionKey="multiCity">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={filters.city_multiple.join(', ')}
                        onChange={(e) => {
                          const cities = e.target.value.split(',').map(city => city.trim()).filter(city => city)
                          handleFilterChange("city_multiple", cities)
                        }}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="New York, Los Angeles, Chicago"
                      />
                      <p className="text-xs text-gray-500">Separate cities with commas</p>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Multiple States" sectionKey="multiState">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={filters.state_multiple.join(', ')}
                        onChange={(e) => {
                          const states = e.target.value.split(',').map(state => state.trim()).filter(state => state)
                          handleFilterChange("state_multiple", states)
                        }}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent bg-white shadow-sm"
                        placeholder="NY, CA, TX"
                      />
                      <p className="text-xs text-gray-500">Separate states with commas</p>
                    </div>
                  </CollapsibleSection>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 pt-4 border-t border-gray-200 gap-3">
              <div className="text-sm text-gray-500 text-center sm:text-left">
                {hasActiveFilters ? `${getActiveFiltersCount()} filter${getActiveFiltersCount() > 1 ? 's' : ''} active` : 'No filters set'}
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={handleClearFilters} 
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!hasActiveFilters}
                >
                  Clear All
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
