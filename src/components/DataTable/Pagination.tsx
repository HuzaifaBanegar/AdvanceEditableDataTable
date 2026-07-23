type Props = {
  page: number;
  totalPages: number;
  pageSize: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
};

export function Pagination({
  page,
  totalPages,
  pageSize,
  onPage,
  onPageSize,
}: Props) {
  return (
    <>
      <label className="page-size">
        Rows per page
        <select
          value={pageSize}
          onChange={(event) => onPageSize(Number(event.target.value))}
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </label>
      <nav className="pagination" aria-label="Pagination">
        <span>
          Page {page} of {totalPages}
        </span>
        <div>
          <button disabled={page === 1} onClick={() => onPage(page - 1)}>
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => onPage(page + 1)}
          >
            Next
          </button>
        </div>
      </nav>
    </>
  );
}
