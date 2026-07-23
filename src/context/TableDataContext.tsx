import { useMemo, useReducer, type ReactNode } from "react";
import type { Employee } from "../types/table";
import { makeEmployees } from "../utils/dataGenerator";
import { TableDataContext, type TableDataContextValue } from "./tableDataStore";

type State = {
  rows: Employee[];
  drafts: Record<number, Employee>;
  history: Record<number, Employee[]>;
};
type Action =
  | { type: "startEdit"; row: Employee }
  | { type: "updateDraft"; id: number; field: keyof Employee; value: string }
  | { type: "cancelEdit"; id: number }
  | { type: "saveEdit"; id: number }
  | { type: "undo"; id: number };

function reducer(state: State, action: Action): State {
  if (action.type === "startEdit")
    return {
      ...state,
      drafts: { ...state.drafts, [action.row.id]: { ...action.row } },
    };
  if (action.type === "updateDraft") {
    const draft = state.drafts[action.id];
    if (!draft) return state;
    const numeric = action.field === "salary" || action.field === "quantity";
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [action.id]: {
          ...draft,
          [action.field]: numeric ? Number(action.value) : action.value,
        },
      },
    };
  }
  if (action.type === "cancelEdit") {
    const drafts = { ...state.drafts };
    delete drafts[action.id];
    return { ...state, drafts };
  }
  if (action.type === "saveEdit") {
    const draft = state.drafts[action.id];
    const previous = state.rows.find((row) => row.id === action.id);
    if (!draft || !previous) return state;
    const drafts = { ...state.drafts };
    delete drafts[action.id];
    return {
      rows: state.rows.map((row) => (row.id === action.id ? draft : row)),
      drafts,
      history: {
        ...state.history,
        [action.id]: [...(state.history[action.id] ?? []), previous],
      },
    };
  }
  if (action.type === "undo") {
    const previous = state.history[action.id]?.at(-1);
    if (!previous) return state;
    return {
      ...state,
      rows: state.rows.map((row) => (row.id === action.id ? previous : row)),
      history: {
        ...state.history,
        [action.id]: state.history[action.id].slice(0, -1),
      },
    };
  }
  return state;
}

export function TableDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    rows: makeEmployees(10000),
    drafts: {},
    history: {},
  }));
  const value: TableDataContextValue = useMemo(
    () => ({
      ...state,
      startEdit: (row: Employee) => dispatch({ type: "startEdit", row }),
      updateDraft: (id: number, field: keyof Employee, value: string) =>
        dispatch({ type: "updateDraft", id, field, value }),
      cancelEdit: (id: number) => dispatch({ type: "cancelEdit", id }),
      saveEdit: (id: number) => dispatch({ type: "saveEdit", id }),
      undo: (id: number) => dispatch({ type: "undo", id }),
    }),
    [state],
  );
  return (
    <TableDataContext.Provider value={value}>
      {children}
    </TableDataContext.Provider>
  );
}
