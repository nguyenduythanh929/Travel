import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Component Pagination
interface Typepagination{
    currentPage:number;
    totalPages:number;
    onPageChange: (page:number)=>void

}
export default function  Pagination({ currentPage, totalPages, onPageChange }:Typepagination) {
    //   const [currentPage, setCurrentPage] = useState(1);
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg font-medium
          transition-all duration-200 
          ${currentPage === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg'}
        `}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`
              w-10 h-10 rounded-lg font-medium
              transition-all duration-200
              ${currentPage === page
                ? 'bg-blue-500 text-white shadow-lg scale-110'
                : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg hover:scale-105'}
            `}
          >
            {page}
          </button>
        )
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg font-medium
          transition-all duration-200
          ${currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg'}
        `}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

// Demo sử dụng component
// export  function PaginationDemo() {

//   const totalPages = 10;

//   return (
//     <div className="">
//         <Pagination 
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={setCurrentPage}
//         />
 
//     </div>
//   );
// }