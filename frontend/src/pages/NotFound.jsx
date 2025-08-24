import { Link } from "react-router-dom";

const NotFound = () => {
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

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-lg shadow-lg rounded-lg border border-gray-200/50 p-8 sm:p-12 text-center">
            <div className="mb-8">
              <h1 className="text-6xl sm:text-8xl font-bold leading-none">
                <span className="text-[#8e24aa] drop-shadow-lg">4</span>
                <span className="text-gray-900 drop-shadow-lg">0</span>
                <span className="text-[#8e24aa] drop-shadow-lg">4</span>
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h2>
              <p className="text-gray-600 text-lg mb-3">
                Oops! The page you're looking for doesn't exist.
              </p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                It might have been moved, deleted, or you entered the wrong URL.
                Don't worry, let's get you back on track!
              </p>
            </div>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
              >
                Go to Dashboard
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;