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
    <div className="w-full flex items-center justify-center font-mono  mt-6">
      <ReactPaginate
        breakLabel="..."
        className="flex items-center gap-x-2"
        nextLabel={
          <button className="text-gray-400">
            <MdNavigateNext size={22} />
          </button>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        pageClassName="bg-white rounded-lg flex shadow items-center justify-center w-8 h-8"
        activeClassName="text-white bg-basePrimary w-8 h-8 flex items-center justify-center rounded-lg"
        previousLabel={
          <button className="text-gray-400">
            <MdNavigateBefore size={22} />
          </button>
        }
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
