import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const Pagination = ({ pagination, handlePageChange }) => {
  return (
    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Hal <span className="font-bold">{pagination.currentPage}</span> dari{" "}
        {pagination.totalPages}
      </p>
      <div className="flex gap-2">
        <button
          disabled={pagination.currentPage === 1}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
