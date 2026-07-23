import { useEffect, useState } from "react";
import { useTableData } from "../../hooks/useTableData";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type { SortKey, SortState, TableView } from "../../types/table";
import { exportEmployeesCsv } from "../../utils/csvExport";
import { isValidEmployee } from "../../utils/validation";
import { Pagination } from "./Pagination";
import { TableHeader } from "./TableHeader";
import { TableToolbar } from "./TableToolbar";
import { VirtualTableBody } from "./VirtualTableBody";

const ROW_HEIGHT = 52;

export function DataTable() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [sort, setSort] = useState<SortState>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [virtualViewportHeight, setVirtualViewportHeight] = useState(
    () => window.innerHeight * 0.6,
  );
  const [view, setView] = useState<TableView>("virtual");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebouncedValue(query);
  const {
    filteredRows,
    drafts,
    history,
    startEdit,
    updateDraft,
    cancelEdit,
    saveEdit,
    undo,
  } = useTableData(debouncedQuery, department, sort);
  useEffect(() => {
    const updateHeight = () => setVirtualViewportHeight(window.innerHeight * 0.6);
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 5);
  const virtualRowCount = Math.ceil(virtualViewportHeight / ROW_HEIGHT) + 10;
  const virtualRows = filteredRows.slice(
    start,
    Math.min(filteredRows.length, start + virtualRowCount),
  );
  const pageRows = filteredRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const reset = () => {
    setQuery("");
    setDepartment("All");
    setSort(null);
    setScrollTop(0);
    setPage(1);
  };
  const changeSort = (key: SortKey) =>
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  const commitSave = (id: number) => {
    if (drafts[id] && isValidEmployee(drafts[id])) saveEdit(id);
  };

  return (
    <>
      <TableToolbar
        query={query}
        department={department}
        onQuery={(value) => {
          setQuery(value);
          setScrollTop(0);
          setPage(1);
        }}
        onDepartment={(value) => {
          setDepartment(value);
          setScrollTop(0);
          setPage(1);
        }}
        onClear={reset}
        onExport={() => exportEmployeesCsv(filteredRows)}
      />
      <div className="table-meta">
        <span>{filteredRows.length.toLocaleString()} results</span>
        {Object.keys(drafts).length > 0 && (
          <span className="dirty">
            {Object.keys(drafts).length} row
            {Object.keys(drafts).length === 1 ? "" : "s"} being edited
          </span>
        )}
      </div>
      <div className="view-controls" aria-label="Table view options">
        <div className="view-buttons">
          <button
            className={view === "virtual" ? "selected" : ""}
            onClick={() => setView("virtual")}
          >
            Virtual view
          </button>
          <button
            className={view === "paginated" ? "selected" : ""}
            onClick={() => {
              setView("paginated");
              setPage(1);
            }}
          >
            Paginated view
          </button>
        </div>
        {view === "paginated" && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPage={setPage}
            onPageSize={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>
      <section className="table-frame" aria-label="Employee table">
        <TableHeader sort={sort} onSort={changeSort} />
        <VirtualTableBody
          rows={view === "virtual" ? virtualRows : pageRows}
          offset={view === "virtual" ? start * ROW_HEIGHT : undefined}
          virtualHeight={
            view === "virtual" ? filteredRows.length * ROW_HEIGHT : undefined
          }
          drafts={drafts}
          history={history}
          onScroll={view === "virtual" ? setScrollTop : undefined}
          onEdit={startEdit}
          onUpdate={updateDraft}
          onSave={commitSave}
          onCancel={cancelEdit}
          onUndo={undo}
        />
      </section>
      <p className="footnote">
        {view === "virtual"
          ? "Virtualized view: only visible rows are rendered."
          : "Paginated view: choose 25, 50, or 100 rows per page."}{" "}
        Use edit to make an inline change.
      </p>
    </>
  );
}
