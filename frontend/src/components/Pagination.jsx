const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []
  const maxVisiblePages = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="mt-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-md border border-gray-200/50">
        <div className="flex items-center justify-between">
          {/*mobile pagination view*/}
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="flex items-center text-sm text-gray-600">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          {/*desktop pagination view*/}
          <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2] disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => onPageChange(1)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="text-gray-400">...</span>
                  )}
                </>
              )}

              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                    page === currentPage
                      ? "bg-[#8e24aa] text-white"
                      : "border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
                  }`}
                >
                  {page}
                </button>
              ))}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(totalPages)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2] disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pagination