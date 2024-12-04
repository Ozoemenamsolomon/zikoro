import ReactPaginate from "react-paginate";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

export function Pagination({
  pageCount,
  totalPages,
  page,
  setPage,
}: {
  totalPages: number;
  pageCount?: number;
  page?: number;
  setPage: (n: number) => void;
}) {
  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    // const newOffset = (event.selected * 20) % dataLength;
    // console.log(newOffset, event.selected * 20, dataLength);
    setPage(event.selected + 1);
  };

  return (
    <div className="w-full flex items-center justify-center font-mono  mt-3">
      <ReactPaginate
        breakLabel="..."
        className="flex items-center gap-x-2"
        nextLabel={
          <button className="text-gray-400">
            <MdNavigateNext size={20} />
          </button>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        activeClassName="text-white bg-basePrimary w-6 h-6 flex items-center justify-center rounded-lg"
        previousLabel={
          <button className="text-gray-400">
            <MdNavigateBefore size={20} />
          </button>
        }
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
