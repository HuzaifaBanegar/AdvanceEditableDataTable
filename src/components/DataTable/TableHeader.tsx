import type { SortKey, SortState } from "../../types/table";

type Props = { sort: SortState; onSort: (key: SortKey) => void };
const columns: { label: string; key?: SortKey }[] = [
  { label: "ID" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Department", key: "department" },
  { label: "Salary", key: "salary" },
  { label: "Quantity", key: "quantity" },
  { label: "Status", key: "status" },
  { label: "Actions" },
];

export function TableHeader({ sort, onSort }: Props) {
  return (
    <div className="data-table table-head" role="row">
      {columns.map((column) => (
        <div key={column.label}>
          {column.key ? (
            <button className="sort-button" onClick={() => onSort(column.key!)}>
              {column.label}
              <span aria-hidden="true">
                {sort?.key === column.key
                  ? sort.direction === "asc"
                    ? " ↑"
                    : " ↓"
                  : " ↕"}
              </span>
            </button>
          ) : (
            column.label
          )}
        </div>
      ))}
    </div>
  );
}
