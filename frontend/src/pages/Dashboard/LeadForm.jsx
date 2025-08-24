import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLeads } from "../../context/LeadContext";

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createLead, updateLead, fetchLead, currentLead, loading } =
    useLeads();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    is_qualified: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && id) {
      fetchLead(id);
    }
  }, [id, isEditing]);

  useEffect(() => {
    if (isEditing && currentLead) {
      setFormData({
        first_name: currentLead.first_name || "",
        last_name: currentLead.last_name || "",
        email: currentLead.email || "",
        phone: currentLead.phone || "",
        company: currentLead.company || "",
        city: currentLead.city || "",
        state: currentLead.state || "",
        source: currentLead.source || "website",
        status: currentLead.status || "new",
        score: currentLead.score || 0,
        lead_value: currentLead.lead_value || 0,
        is_qualified: currentLead.is_qualified || false,
      });
    }
  }, [currentLead, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleCancel = () => {
    if (isEditing) {
      navigate(`/leads/${id}`);
    } else {
      navigate("/leads");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isEditing) {
        await updateLead(id, formData);
        navigate(`/leads/${id}`);
      } else {
        await createLead(formData);
        navigate("/leads");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && isEditing) {
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">
            <span className="text-black">
              {isEditing ? "Edit " : "Add New "}
            </span>
            <span className="text-[#8e24aa]">Lead</span>
          </h1>
          <p className="text-black font-medium mt-2">
            {isEditing
              ? "Update lead information"
              : "Create a new lead in your pipeline"}{" "}
            ✏️
          </p>
        </div>

        {/*form*/}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-8 transition-transform hover:scale-[1.01] duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label
                  htmlFor="source"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Lead Source *
                </label>
                <select
                  id="source"
                  name="source"
                  required
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="website">Website</option>
                  <option value="facebook_ads">Facebook Ads</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="referral">Referral</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Lead Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                  <option value="won">Won</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="score"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Lead Score (0-100)
                </label>
                <input
                  type="number"
                  id="score"
                  name="score"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter lead score (0-100)"
                />
              </div>

              <div>
                <label
                  htmlFor="lead_value"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Potential Value ($)
                </label>
                <input
                  type="number"
                  id="lead_value"
                  name="lead_value"
                  min="0"
                  step="0.01"
                  value={formData.lead_value}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e24aa] focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter potential value"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_qualified"
                    name="is_qualified"
                    checked={formData.is_qualified}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#8e24aa] focus:ring-[#8e24aa] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_qualified"
                    className="ml-3 block text-sm font-semibold text-gray-700"
                  >
                    Mark as qualified lead
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#8e24aa] hover:bg-[#7b1fa2] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </div>
                ) : isEditing ? (
                  "Update Lead"
                ) : (
                  "Create Lead"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;