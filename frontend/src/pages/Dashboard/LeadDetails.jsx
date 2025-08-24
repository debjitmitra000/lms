import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLeads } from "../../context/LeadContext";

//delete modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, leadName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all border border-gray-200/50">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Delete Lead
          </h3>
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-[#8e24aa]">{leadName}</span>? 
            This action cannot be undone and all associated data will be permanently removed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300  border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-[#8e24aa] border border-transparent rounded-full hover:bg-[#7b1fa2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8e24aa] transition-all duration-300"
            >
              Delete Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLead, fetchLead, deleteLead, loading } = useLeads();
  const [copiedField, setCopiedField] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const getAvatarColor = (leadId) => {
    if (!leadId) return colors[0];

    let hash = 0;
    for (let i = 0; i < leadId.length; i++) {
      const char = leadId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  const copyToClipboard = async (text, fieldType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldType);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/leads");
    }
  };

  useEffect(() => {
    if (id) {
      fetchLead(id);
    }
  }, [id]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    await deleteLead(id);
    navigate("/leads");
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "#b3e5fc",
      contacted: "#e1bee7",
      qualified: "#ffe0b2",
      won: "#a5d6a7",
      lost: "#ef9a9a",
    };
    return colors[status] || "#8e24aa";
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: "New Lead",
      contacted: "Contacted",
      qualified: "Qualified",
      won: "Won Deal",
      lost: "Lost Deal",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-28 w-28 border-b-2 border-[#8e24aa]"></div>
      </div>
    );
  }

  if (!currentLead) {
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
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-[150px] opacity-30"></div>
          <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-[150px] opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20">
          <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-lg p-12 text-center border border-gray-200/50">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Lead Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The requested lead could not be found.
            </p>
            <button
              onClick={handleBackNavigation}
              className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-[#8e24aa] border-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
            >
              Go Back
            </button>
          </div>
        </div>
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

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        leadName={`${currentLead.first_name} ${currentLead.last_name}`}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <button
              onClick={handleBackNavigation}
              className="px-6 py-3 border rounded-lg text-sm font-semibold text-white bg-[#8e24aa] border-[#8e24aa] hover:bg-[#7b1fa2] transition-all duration-200 shadow-lg"
            >
              Go Back
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/leads/edit/${currentLead._id}`}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
              >
                Edit Lead
              </Link>
              <button
                onClick={handleDeleteClick}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
              >
                Delete Lead
              </button>
            </div>
          </div>

          {/*name avatar and infos*/}
          <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-lg p-8 border border-gray-200/50 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                  style={{ backgroundColor: getAvatarColor(currentLead._id) }}
                >
                  {getInitials(currentLead.first_name, currentLead.last_name)}
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {currentLead.first_name} {currentLead.last_name}
                  </h1>

                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      currentLead.is_qualified
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {currentLead.is_qualified ? "Qualified" : "Not Qualified"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center text-lg text-gray-600">
                  <span className="font-medium">Status:</span>
                  <div
                    className="w-3 h-3 rounded-full mx-2"
                    style={{
                      backgroundColor: getStatusColor(currentLead.status),
                    }}
                  ></div>
                  <span className="font-semibold text-gray-900">
                    {getStatusLabel(currentLead.status)}
                  </span>
                </div>

                <div className="text-lg text-gray-600">
                  <span className="font-medium">Lead Value:</span>
                  <span className="font-semibold text-[#8e24aa] ml-1">
                    ${currentLead.lead_value?.toLocaleString() || "0"}
                  </span>
                </div>

                <div className="text-lg text-gray-600">
                  <span className="font-medium">Score:</span>
                  <span className="font-semibold text-gray-900 ml-1">
                    {currentLead.score}/100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200/50">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-[#fbfcfd]">
              <h2 className="text-lg font-medium text-gray-900">
                Contact Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    First Name
                  </label>
                  <p className="mt-1 text-lg text-gray-900 font-medium">
                    {currentLead.first_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Name
                  </label>
                  <p className="mt-1 text-lg text-gray-900 font-medium">
                    {currentLead.last_name}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Address
                </label>
                <div className="mt-1 flex items-center justify-between">
                  <a
                    href={`mailto:${currentLead.email}`}
                    className="text-lg text-[#8e24aa] hover:text-[#7b1fa2] transition-colors font-medium"
                  >
                    {currentLead.email}
                  </a>
                  <button
                    onClick={() => copyToClipboard(currentLead.email, "email")}
                    className="ml-2 p-1 rounded text-gray-400 hover:text-[#8e24aa] transition-colors"
                    title="Copy email"
                  >
                    {copiedField === "email" ? (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone Number
                </label>
                <div className="mt-1 flex items-center justify-between">
                  <a
                    href={`tel:${currentLead.phone}`}
                    className="text-lg text-[#8e24aa] hover:text-[#7b1fa2] transition-colors font-medium"
                  >
                    {currentLead.phone}
                  </a>
                  <button
                    onClick={() => copyToClipboard(currentLead.phone, "phone")}
                    className="ml-2 p-1 rounded text-gray-400 hover:text-[#8e24aa] transition-colors"
                    title="Copy phone number"
                  >
                    {copiedField === "phone" ? (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/*business info*/}
          <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200/50">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-[#fbfcfd]">
              <h2 className="text-lg font-medium text-gray-900">
                Business Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Company
                </label>
                <p className="mt-1 text-lg text-gray-900 font-medium">
                  {currentLead.company}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  City
                </label>
                <p className="mt-1 text-lg text-gray-900 font-medium">
                  {currentLead.city}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  State
                </label>
                <p className="mt-1 text-lg text-gray-900 font-medium">
                  {currentLead.state}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Lead Source
                </label>
                <p className="mt-1 text-lg text-gray-900 font-medium capitalize">
                  {currentLead.source?.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*dates*/}
        <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200/50 mb-8">
          <div className="px-6 py-4 border-b border-gray-200/50 bg-[#fbfcfd]">
            <h2 className="text-lg font-medium text-gray-900">
              Activity & Timeline
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-gray-50/50">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Last Activity
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {currentLead.last_activity_at
                    ? new Date(
                        currentLead.last_activity_at
                      ).toLocaleDateString()
                    : "No activity recorded"}
                </div>
              </div>

              <div className="text-center p-4 rounded-lg bg-gray-50/50">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Created Date
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {new Date(currentLead.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="text-center p-4 rounded-lg bg-gray-50/50">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Last Updated
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {new Date(currentLead.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;