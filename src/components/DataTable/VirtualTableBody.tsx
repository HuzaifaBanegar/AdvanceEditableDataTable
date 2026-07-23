import type { Employee } from "../../types/table";
import { EditableCell } from "./EditableCell";
import { RowActions } from "./RowActions";

type Props = {
  rows: Employee[];
  offset?: number;
  virtualHeight?: number;
  drafts: Record<number, Employee>;
  history: Record<number, Employee[]>;
  onScroll?: (top: number) => void;
  onEdit: (row: Employee) => void;
  onUpdate: (id: number, field: keyof Employee, value: string) => void;
  onSave: (id: number) => void;
  onCancel: (id: number) => void;
  onUndo: (id: number) => void;
};

export function VirtualTableBody({
  rows,
  offset = 0,
  virtualHeight,
  drafts,
  history,
  onScroll,
  onEdit,
  onUpdate,
  onSave,
  onCancel,
  onUndo,
}: Props) {
  return (
    <div
      className={virtualHeight ? "table-scroller" : "table-pages"}
      onScroll={
        onScroll
          ? (event) => onScroll(event.currentTarget.scrollTop)
          : undefined
      }
    >
      <div
        style={
          virtualHeight
            ? { height: virtualHeight, position: "relative" }
            : undefined
        }
      >
        <div
          style={
            virtualHeight ? { transform: `translateY(${offset}px)` } : undefined
          }
        >
          {rows.map((row) => {
            const draft = drafts[row.id];
            const display = draft ?? row;
            const editing = Boolean(draft);
            return (
              <div className="data-table table-row" role="row" key={row.id}>
                <div>{row.id}</div>
                <div>
                  <EditableCell
                    row={row}
                    field="name"
                    value={display.name}
                    editing={editing}
                    onChange={(field, value) => onUpdate(row.id, field, value)}
                  />
                </div>
                <div>
                  <EditableCell
                    row={row}
                    field="email"
                    value={display.email}
                    editing={editing}
                    onChange={(field, value) => onUpdate(row.id, field, value)}
                  />
                </div>
                <div>
                  <EditableCell
                    row={row}
                    field="department"
                    value={display.department}
                    editing={editing}
                    onChange={(field, value) => onUpdate(row.id, field, value)}
                  />
                </div>
                <div>
                  <EditableCell
                    row={row}
                    field="salary"
                    type="number"
                    value={display.salary}
                    editing={editing}
                    onChange={(field, value) => onUpdate(row.id, field, value)}
                  />
                </div>
                <div>
                  <EditableCell
                    row={row}
                    field="quantity"
                    type="number"
                    value={display.quantity}
                    editing={editing}
                    onChange={(field, value) => onUpdate(row.id, field, value)}
                  />
                </div>
                <div>
                  <EditableCell
                    row={row}
                    field="status"
                    value={display.status}
                    editing={editing}
                    onChange={(field, value) => onUpdate(row.id, field, value)}
                  />
                </div>
                <div>
                  <RowActions
                    editing={editing}
                    canUndo={Boolean(history[row.id]?.length)}
                    onEdit={() => onEdit(row)}
                    onSave={() => onSave(row.id)}
                    onCancel={() => onCancel(row.id)}
                    onUndo={() => onUndo(row.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
