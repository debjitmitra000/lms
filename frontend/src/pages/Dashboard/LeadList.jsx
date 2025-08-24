import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLeads } from "../../context/LeadContext";
import FilterPanel from "../../components/FilterPanel";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";

const LeadList = () => {
  const { leads, loading, pagination, fetchLeads, deleteLead } = useLeads();
  const [currentFilters, setCurrentFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const colors = ["#b3e5fc", "#e1bee7", "#ffe0b2", "#a5d6a7", "#ef9a9a"];
  const colors2 = [
    "#8e24aa",
    "#26c6da",
    "#66bb6a",
    "#ffb74c",
    "#e57373",
    "#42a5f5",
    "#ba68c8",
    "#00bfa5",
  ];

  useEffect(() => {
    fetchLeads({ page: 1, limit: 20 });
  }, []);

  const handleFilter = (filters) => {
    setCurrentFilters(filters);
    fetchLeads({ ...filters, page: 1, limit: 20 });
  };

  const handleClearFilters = () => {
    setCurrentFilters({});
    setSearchTerm("");
    fetchLeads({ page: 1, limit: 20 });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const searchFilters = term
      ? {
          ...currentFilters,
          search: term,
        }
      : currentFilters;
    fetchLeads({ ...searchFilters, page: 1, limit: 20 });
  };

  const handlePageChange = (page) => {
    const searchFilters = searchTerm
      ? {
          ...currentFilters,
          search: searchTerm,
        }
      : currentFilters;
    fetchLeads({ ...searchFilters, page, limit: 20 });
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...currentFilters };

    if (filterKey === "created_date") {
      delete newFilters.created_after;
      delete newFilters.created_before;
    } else if (filterKey === "activity_date") {
      delete newFilters.last_activity_after;
      delete newFilters.last_activity_before;
    } else {
      delete newFilters[filterKey];
    }

    setCurrentFilters(newFilters);
    fetchLeads({ ...newFilters, page: 1, limit: 20 });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchLeads({ ...currentFilters, page: 1, limit: 20 });
  };

  const getActiveFilterItems = () => {
    const filterItems = [];

    //basic filters
    if (currentFilters.status) {
      filterItems.push({
        label: `Status: ${
          currentFilters.status.charAt(0).toUpperCase() +
          currentFilters.status.slice(1)
        }`,
        onRemove: () => handleRemoveFilter("status"),
      });
    }

    if (currentFilters.source) {
      const sourceLabel = currentFilters.source
        .replace("_", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      filterItems.push({
        label: `Source: ${sourceLabel}`,
        onRemove: () => handleRemoveFilter("source"),
      });
    }

    if (currentFilters.is_qualified) {
      const qualifiedLabel =
        currentFilters.is_qualified === "true" ? "Qualified" : "Not Qualified";
      filterItems.push({
        label: qualifiedLabel,
        onRemove: () => handleRemoveFilter("is_qualified"),
      });
    }

    if (currentFilters.city) {
      filterItems.push({
        label: `City: ${currentFilters.city}`,
        onRemove: () => handleRemoveFilter("city"),
      });
    }

    if (currentFilters.state) {
      filterItems.push({
        label: `State: ${currentFilters.state}`,
        onRemove: () => handleRemoveFilter("state"),
      });
    }

    //multi select filters
    if (currentFilters.status_in) {
      const statuses = currentFilters.status_in.split(",");
      filterItems.push({
        label: `Statuses: ${statuses
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(", ")}`,
        onRemove: () => handleRemoveFilter("status_in"),
      });
    }

    if (currentFilters.source_in) {
      const sources = currentFilters.source_in.split(",");
      const sourceLabels = sources.map((source) =>
        source
          .replace("_", " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );
      filterItems.push({
        label: `Sources: ${sourceLabels.join(", ")}`,
        onRemove: () => handleRemoveFilter("source_in"),
      });
    }

    if (currentFilters.city_in) {
      const cities = currentFilters.city_in.split(",");
      filterItems.push({
        label: `Cities: ${cities.join(", ")}`,
        onRemove: () => handleRemoveFilter("city_in"),
      });
    }

    if (currentFilters.state_in) {
      const states = currentFilters.state_in.split(",");
      filterItems.push({
        label: `States: ${states.join(", ")}`,
        onRemove: () => handleRemoveFilter("state_in"),
      });
    }

    // String filters
    if (currentFilters.email_equals) {
      filterItems.push({
        label: `Email Equals: ${currentFilters.email_equals}`,
        onRemove: () => handleRemoveFilter("email_equals"),
      });
    }

    if (currentFilters.email_contains) {
      filterItems.push({
        label: `Email Contains: ${currentFilters.email_contains}`,
        onRemove: () => handleRemoveFilter("email_contains"),
      });
    }

    if (currentFilters.company_equals) {
      filterItems.push({
        label: `Company Equals: ${currentFilters.company_equals}`,
        onRemove: () => handleRemoveFilter("company_equals"),
      });
    }

    if (currentFilters.company_contains) {
      filterItems.push({
        label: `Company Contains: ${currentFilters.company_contains}`,
        onRemove: () => handleRemoveFilter("company_contains"),
      });
    }

    if (currentFilters.city_equals) {
      filterItems.push({
        label: `City Equals: ${currentFilters.city_equals}`,
        onRemove: () => handleRemoveFilter("city_equals"),
      });
    }

    if (currentFilters.city_contains) {
      filterItems.push({
        label: `City Contains: ${currentFilters.city_contains}`,
        onRemove: () => handleRemoveFilter("city_contains"),
      });
    }

    // Number filters
    if (currentFilters.score_equals) {
      filterItems.push({
        label: `Score Equals: ${currentFilters.score_equals}`,
        onRemove: () => handleRemoveFilter("score_equals"),
      });
    }

    if (currentFilters.score_gt) {
      filterItems.push({
        label: `Score > ${currentFilters.score_gt}`,
        onRemove: () => handleRemoveFilter("score_gt"),
      });
    }

    if (currentFilters.score_lt) {
      filterItems.push({
        label: `Score < ${currentFilters.score_lt}`,
        onRemove: () => handleRemoveFilter("score_lt"),
      });
    }

    if (currentFilters.score_between) {
      const [min, max] = currentFilters.score_between.split(",");
      filterItems.push({
        label: `Score: ${min} - ${max}`,
        onRemove: () => handleRemoveFilter("score_between"),
      });
    }

    if (currentFilters.lead_value_equals) {
      filterItems.push({
        label: `Value Equals: $${currentFilters.lead_value_equals}`,
        onRemove: () => handleRemoveFilter("lead_value_equals"),
      });
    }

    if (currentFilters.lead_value_gt) {
      filterItems.push({
        label: `Value > $${currentFilters.lead_value_gt}`,
        onRemove: () => handleRemoveFilter("lead_value_gt"),
      });
    }

    if (currentFilters.lead_value_lt) {
      filterItems.push({
        label: `Value < $${currentFilters.lead_value_lt}`,
        onRemove: () => handleRemoveFilter("lead_value_lt"),
      });
    }

    if (currentFilters.lead_value_between) {
      const [min, max] = currentFilters.lead_value_between.split(",");
      filterItems.push({
        label: `Value: $${min} - $${max}`,
        onRemove: () => handleRemoveFilter("lead_value_between"),
      });
    }

    // Date filters
    if (currentFilters.created_on) {
      filterItems.push({
        label: `Created On: ${new Date(
          currentFilters.created_on
        ).toLocaleDateString()}`,
        onRemove: () => handleRemoveFilter("created_on"),
      });
    }

    if (currentFilters.created_after) {
      filterItems.push({
        label: `Created After: ${new Date(
          currentFilters.created_after
        ).toLocaleDateString()}`,
        onRemove: () => handleRemoveFilter("created_after"),
      });
    }

    if (currentFilters.created_before) {
      filterItems.push({
        label: `Created Before: ${new Date(
          currentFilters.created_before
        ).toLocaleDateString()}`,
        onRemove: () => handleRemoveFilter("created_before"),
      });
    }

    if (currentFilters.created_between) {
      const [start, end] = currentFilters.created_between.split(",");
      filterItems.push({
        label: `Created: ${new Date(start).toLocaleDateString()} - ${new Date(
          end
        ).toLocaleDateString()}`,
        onRemove: () => handleRemoveFilter("created_between"),
      });
    }

    if (currentFilters.last_activity_on) {
      filterItems.push({
        label: `Activity On: ${new Date(
          currentFilters.last_activity_on
        ).toLocaleDateString()}`,
        onRemove: () => handleRemoveFilter("last_activity_on"),
      });
    }

    if (currentFilters.last_activity_after) {
      filterItems.push({
        label: `Activity After: ${new Date(
          currentFilters.last_activity_after
        ).toLocaleDateString()}`,
        onRemove: () => handleRemoveFilter("last_activity_after"),
      });
    }

    if (currentFilters.last_activity_before) {
      filterItems.push({
        label: `Activity Before: ${new Date(
          currentFilters.last_activity_before
        ).toLocaleDateString()}`,
        onRemove: () => handleRemoveFilter("last_activity_before"),
      });
    }

    if (currentFilters.last_activity_between) {
      const [start, end] = currentFilters.last_activity_between.split(",");
      filterItems.push({
        label: `Activity: ${new Date(start).toLocaleDateString()} - ${new Date(
          end
        ).toLocaleDateString()}`,
        onRemove: () => handleRemoveFilter("last_activity_between"),
      });
    }

    // Search term
    if (searchTerm) {
      filterItems.push({
        label: `Search: "${searchTerm}"`,
        onRemove: () => handleClearSearch(),
      });
    }

    return filterItems;
  };

  const activeFilterItems = getActiveFilterItems();

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getStatusLabel = (daysDiff) => {
    if (daysDiff === 0) return { text: "Today", color: "text-green-600" };
    if (daysDiff < 0) return { text: "Overdue", color: "text-red-600" };
    return {
      text: `${daysDiff} day${daysDiff > 1 ? "s" : ""}`,
      color: "text-gray-600",
    };
  };

  const getDaysDifference = (createdAt) => {
    const today = new Date();
    const created = new Date(createdAt);
    const diffTime = today - created;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-28 w-28 border-b-2 border-[#8e24aa]"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative bg-gray-50"
      style={{
        backgroundImage: `url('/bg.svg'), linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-[120px] opacity-15"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-20 px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/*search bar*/}
          <div className="flex-1 lg:max-w-2xl">
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="Search leads by name, email, company, phone..."
            />
          </div>

          {/*add new lead button*/}
          <div className="flex-shrink-0">
            <Link
              to="/leads/new"
              className="inline-flex items-center justify-center w-full lg:w-auto px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border bg-[#8e24aa] text-white hover:bg-[#7b1fa2]"
            >
              Add New Lead
            </Link>
          </div>
        </div>

        {/*filter*/}
        <FilterPanel
          onFilter={handleFilter}
          onClear={handleClearFilters}
          currentFilters={currentFilters}
        />

        {/*active filter boxes*/}
        {activeFilterItems.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeFilterItems.map((item, index) => {
                const color = colors[index % colors.length];
                return (
                  <div
                    key={index}
                    className="border-l-4 rounded-lg p-4 shadow-sm bg-white/80 backdrop-blur-sm"
                    style={{ borderLeftColor: color }}
                  >
                    <div className="flex justify-between items-center">
                      <h3
                        className="text-sm font-medium truncate pr-2"
                        style={{ color }}
                      >
                        {item.label}
                      </h3>
                      <button
                        onClick={item.onRemove}
                        className="flex-shrink-0 p-1 text-black hover:text-[#7b1fa2] transition-colors"
                        title="Remove this filter"
                      >
                        <svg
                          className="w-3 h-3"
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {pagination && (
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} leads
            </div>
            <div className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </div>
          </div>
        )}

        {/*leads chart*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {leads &&
            leads.map((lead, index) => {
              const daysDiff =
                index % 5 === 0
                  ? 3
                  : index % 5 === 1
                  ? 5
                  : index % 5 === 2
                  ? 1
                  : index % 5 === 3
                  ? 2
                  : 4;
              const statusInfo = getStatusLabel(daysDiff);

              return (
                <div
                  key={lead._id}
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-gray-200/50 hover:shadow-lg hover:border-purple-200/70 transition-all duration-300"
                >
                  {/*lead info*/}
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-sm font-medium text-white`}
                      style={{
                        backgroundColor: colors2[index % colors2.length],
                      }}
                    >
                      {getInitials(lead.first_name, lead.last_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {lead.first_name} {lead.last_name}
                      </h4>
                      {lead.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {lead.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      $
                      {lead.lead_value ? lead.lead_value.toLocaleString() : "0"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1 mb-4">
                    {lead.company && (
                      <div>
                        <span>Company: </span>
                        <span className="font-semibold text-gray-900">
                          {lead.company}
                        </span>
                      </div>
                    )}
                    <div>
                      <span>Status: </span>
                      <span className="font-semibold text-gray-900 capitalize">
                        {lead.status}
                      </span>
                    </div>
                    <div>
                      <span>Source: </span>
                      <span className="font-semibold text-gray-900 capitalize">
                        {lead.source?.replace("_", " ") || "Unknown"}
                      </span>
                    </div>
                    {lead.city && lead.state && (
                      <div>
                        <span>Location: </span>
                        <span className="font-semibold text-gray-900">
                          {lead.city}, {lead.state}
                        </span>
                      </div>
                    )}
                    {lead.is_qualified !== undefined && (
                      <div>
                        <span>Qualified: </span>
                        <span
                          className={`font-semibold ${
                            lead.is_qualified
                              ? "text-[#a5d6a7]"
                              : "text-[#ef9a9a]"
                          }`}
                        >
                          {lead.is_qualified ? "Yes" : "No"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span
                      className={`text-xs font-medium ${
                        daysDiff === 4 ? "text-red-600" : statusInfo.color
                      }`}
                    >
                      {daysDiff === 4 ? "Lost" : statusInfo.text}
                    </span>
                    <Link
                      to={`/leads/${lead._id}`}
                      className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>

        {/*when no match*/}
        {(!leads || leads.length === 0) && (
          <div className="text-center py-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-md border border-gray-200/50 hover:shadow-lg transition-all duration-300 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No leads found
              </h3>

              <p className="text-gray-600 mb-6">
                {Object.keys(currentFilters).length > 0 || searchTerm
                  ? "Try adjusting your search or filters"
                  : "Start building your sales pipeline"}
              </p>

              <div className="flex gap-3 justify-center">
                {(Object.keys(currentFilters).length > 0 || searchTerm) && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
                  >
                    Clear Filters
                  </button>
                )}

                <Link
                  to="/leads/new"
                  className="inline-flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border bg-[#8e24aa] text-white hover:bg-[#7b1fa2]"
                >
                  Add New Lead
                </Link>
              </div>
            </div>
          </div>
        )}

        {/*pagination*/}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default LeadList;
