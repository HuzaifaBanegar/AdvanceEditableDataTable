import type { ChangeEvent } from "react";
import { departments } from "../../utils/dataGenerator";

type Props = {
  query: string;
  department: string;
  onQuery: (value: string) => void;
  onDepartment: (value: string) => void;
  onClear: () => void;
  onExport: () => void;
};

export function TableToolbar({
  query,
  department,
  onQuery,
  onDepartment,
  onClear,
  onExport,
}: Props) {
  return (
    <section className="toolbar" aria-label="Table controls">
      <label>
        Search
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Name, email, salary…"
        />
      </label>
      <label>
        Department
        <select
          value={department}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            onDepartment(event.target.value)
          }
        >
          <option>All</option>
          {departments.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <div className="toolbar-actions">
        <button onClick={onClear}>Clear filters</button>
        <button onClick={onExport}>Export CSV</button>
      </div>
    </section>
  );
}
