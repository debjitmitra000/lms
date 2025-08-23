import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLeads } from "../../context/LeadContext";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { leads, fetchLeads, loading } = useLeads();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    won: 0,
    lost: 0,
  });

  useEffect(() => {
    fetchLeads({ limit: 1000 });
  }, []);

  useEffect(() => {
    if (leads.length > 0) {
      const newStats = leads.reduce(
        (acc, lead) => {
          acc.total++;
          acc[lead.status]++;
          return acc;
        },
        {
          total: 0,
          new: 0,
          contacted: 0,
          qualified: 0,
          won: 0,
          lost: 0,
        }
      );
      setStats(newStats);
    }
  }, [leads]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (value) => {
    if (!value) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = [
      "#8e24aa",
      "#26c6da",
      "#66bb6a",
      "#ffb74c",
      "#e57373",
      "#42a5f5",
      "#ba68c8",
      "#00bfa5",
    ];
    return colors[index % colors.length];
  };

  const getStageLabel = (status) => {
    const labels = {
      new: "New Lead",
      contacted: "Contacted",
      qualified: "Qualified",
      won: "Won",
      lost: "Lost",
    };
    return labels[status] || status;
  };

  const getStageIndicatorColor = (status) => {
    const colors = {
      new: "bg-[#b3e5fc]",
      contacted: "bg-[#e1bee7]",
      qualified: "bg-[#ffe0b2]",
      won: "bg-[#a5d6a7]",
      lost: "bg-[#ef9a9a]",
    };
    return colors[status] || "bg-gray-400";
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
      className="min-h-screen pt-24 pb-24 relative"
      style={{
        backgroundImage: `url('/bg.svg'), linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient Overlays */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-[150px] opacity-30"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-[150px] opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-[#8e24aa]">{user?.name}!</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your lead management system.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-lg overflow-hidden shadow-lg rounded-lg border border-gray-200/50">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#8e24aa] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {stats.total}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Leads
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg overflow-hidden shadow-lg rounded-lg border border-gray-200/50">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#b3e5fc] rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-sm">
                      {stats.new}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      New
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.new}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg overflow-hidden shadow-lg rounded-lg border border-gray-200/50">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#e1bee7] rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-sm">
                      {stats.contacted}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Contacted
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.contacted}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg overflow-hidden shadow-lg rounded-lg border border-gray-200/50">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#ffe0b2] rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-sm">
                      {stats.qualified}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Qualified
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.qualified}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg overflow-hidden shadow-lg rounded-lg border border-gray-200/50">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#a5d6a7] rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-sm">
                      {stats.won}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Won
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.won}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg overflow-hidden shadow-lg rounded-lg border border-gray-200/50">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#ef9a9a] rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-sm">
                      {stats.lost}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Lost
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.lost}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*new lead view all lead buttons*/}
        <div className="bg-white/90 backdrop-blur-lg shadow-lg rounded-lg p-6 mb-8 border border-gray-200/50">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/leads/new"
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
            >
              Add New Lead
            </Link>
            <Link
              to="/leads"
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
            >
              View All Leads
            </Link>
          </div>
        </div>

        {/*recent leads table*/}
        <div className="bg-white/90 backdrop-blur-lg shadow-lg rounded-lg border border-gray-200/50">
          <div className="px-6 py-4 border-b border-gray-200/50">
            <h2 className="text-lg font-medium text-gray-900">Recent Leads</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/50 backdrop-blur-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Lead Value
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    State
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Qualified
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Last Activity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {leads.slice(0, 5).map((lead, index) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-white/30 border-b border-gray-200/30 last:border-b-0"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0"
                          style={{ backgroundColor: getAvatarColor(index) }}
                        >
                          {getInitials(lead.first_name, lead.last_name)}
                        </div>
                        <Link
                          to={`/leads/${lead._id}`}
                          className="text-[#8e25aa] hover:text-[#7b1fa2] font-medium"
                        >
                          {lead.first_name} {lead.last_name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${getStageIndicatorColor(
                            lead.status
                          )}`}
                        ></div>
                        <span className="text-sm text-gray-900">
                          {getStageLabel(lead.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(lead.lead_value)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {lead.phone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {lead.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {lead.company}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {lead.city}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {lead.state}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="capitalize">
                        {lead.source.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {lead.score}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.is_qualified
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {lead.is_qualified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(lead.last_activity_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {leads.length > 5 && (
            <div className="px-6 py-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
              <div className="flex justify-center">
                <Link
                  to="/leads"
                  className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
                >
                  View all leads
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
