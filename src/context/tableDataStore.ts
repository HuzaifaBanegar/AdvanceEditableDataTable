import { createContext } from "react";
import type { Employee } from "../types/table";

export type TableDataContextValue = {
  rows: Employee[];
  drafts: Record<number, Employee>;
  history: Record<number, Employee[]>;
  startEdit: (row: Employee) => void;
  updateDraft: (id: number, field: keyof Employee, value: string) => void;
  cancelEdit: (id: number) => void;
  saveEdit: (id: number) => void;
  undo: (id: number) => void;
};

export const TableDataContext = createContext<TableDataContextValue | null>(
  null,
);
