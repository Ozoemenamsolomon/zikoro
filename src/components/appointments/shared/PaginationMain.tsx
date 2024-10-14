import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void; 
  };
  
  const PaginationMain: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevPage = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    };
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    };
  
    const handleFirstPage = () => onPageChange(1);
    const handleLastPage = () => onPageChange(totalPages);
  
    return (
      <div className="flex gap-2 justify-between items-center mt-4">
        <button onClick={handleFirstPage} disabled={currentPage === 1} className="p-2 border_ bg-cms-faint rounded disabled:opacity-20">
          <ChevronsLeft className="h-5 w-5" />
        </button>
  
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-2 border_ bg-cms-faint rounded disabled:opacity-20">
          <ChevronLeft className="h-5 w-5" />
        </button>
  
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
  
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 border_ bg-cms-faint rounded disabled:opacity-20">
          <ChevronRight className="h-5 w-5" />
        </button>
  
        <button onClick={handleLastPage} disabled={currentPage === totalPages} className="p-2 border_ bg-cms-faint rounded disabled:opacity-20">
          <ChevronsRight className="h-5 w-5" />
        </button>
      </div>
    );
  };
  
  export default PaginationMain;
  