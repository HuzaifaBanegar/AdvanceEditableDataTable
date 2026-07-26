# Advanced Editable Data Table

A React and TypeScript implementation of a data-intensive employee table. It supports inline editing, undo, filtering, sorting, virtual scrolling, pagination, CSV export, theme selection, and basic unsaved-edit protection.

**Live deployment:** [advance-editable-data-table.vercel.app](https://advance-editable-data-table.vercel.app/)

## Setup

### Prerequisites

- Node.js 20+ recommended
- npm

### Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

### Quality commands

```bash
npm run build  # Type-check and produce a production bundle
npm run lint   # Run ESLint
npm run preview # Serve the production bundle locally
```

## Requirements

### Editable table

The table provides 10,000 employee records with text and numeric fields:

| Field | Type | Editable |
| --- | --- | --- |
| ID | Numeric identifier | No |
| Name | Text | Yes |
| Email | Text | Yes |
| Department | Text | Yes |
| Salary | Numeric | Yes |
| Quantity | Numeric | Yes |
| Status | Text | Yes |

Each row supports the following workflow:

1. **Edit** creates a row-local draft and displays inputs in that row.
2. **Save** validates the draft and commits it to the data set.
3. **Cancel** discards the draft without changing the saved record.
4. **Undo** restores the most recently saved version of that row.

### Large dataset handling

The application creates a deterministic dataset of 10,000 records. The default **Virtual view** renders only rows inside, or very near, the visible scroll region instead of rendering all 10,000 rows in the DOM. The virtual viewport is `60vh` and its render buffer is recalculated when the browser window is resized.

A **Paginated view** is included as the fallback display method. It supports 25, 50, and 100 rows per page, along with previous/next navigation.

### Sorting, filtering, and export

- Global text search across the displayed text and numeric values.
- Department filter.
- One-column ascending/descending sort through the column headers.
- Clear filters action.
- CSV export for the current filtered and sorted result set.

### UI and resilience

- Simple, low-decoration interface designed for data entry.
- Light and dark themes, persisted with `localStorage`.
- Moon/sun controls from `react-icons`.
- Keyboard-visible focus styles and labelled form inputs.
- `beforeunload` prompt when one or more rows have uncommitted drafts.
- Error Boundary for unexpected React rendering errors.
- A catch-all route that shows a 404 page for an invalid URL.

## Plan and implementation approach

The implementation was planned around keeping the expensive work and the editable work separate:

1. Generate realistic, repeatable client-side employee data for a 10,000-row performance scenario.
2. Keep saved data separate from row drafts. This makes Cancel safe and prevents changes becoming permanent while a user is typing.
3. Derive filtered and sorted rows from the saved data rather than mutating the original array for every UI interaction.
4. Render a small slice of those derived rows in virtual mode, using a full-height spacer and `translateY` offset to preserve the normal scrollbar size and position.
5. Use the exact same derived result set for paginated mode, so the two modes give consistent results after filtering or sorting.
6. Place data operations in a context/reducer layer and keep table controls and visual pieces as focused components.
7. Add basic application recovery (Error Boundary and 404 route), then validate with TypeScript build and ESLint.

## Architecture

```text
src/
├── components/
│   ├── DataTable/
│   │   ├── DataTable.tsx          # Table composition and view state
│   │   ├── TableToolbar.tsx       # Search, department filter, CSV actions
│   │   ├── TableHeader.tsx        # Sortable column headers
│   │   ├── VirtualTableBody.tsx   # Virtual/paginated row rendering shell
│   │   ├── EditableCell.tsx       # Display/input behavior for a cell
│   │   ├── RowActions.tsx         # Edit, save, cancel, undo controls
│   │   └── Pagination.tsx         # Page size and navigation controls
│   └── ErrorBoundary.tsx          # Runtime rendering-error fallback
├── context/
│   ├── TableDataContext.tsx       # Reducer and provider for table data
│   └── tableDataStore.ts           # Shared context contract
├── hooks/
│   ├── useTableData.ts             # Filtering and sorting derivation
│   ├── useDebouncedValue.ts        # Debounced global search input
│   └── useBeforeUnloadPrompt.ts    # Warn about unsaved drafts
├── pages/
│   └── NotFound.tsx                # Invalid-route screen
├── types/
│   └── table.ts                    # Employee, sorting, and view types
├── utils/
│   ├── dataGenerator.ts            # Deterministic 10,000-row data source
│   ├── csvExport.ts                # Browser CSV download creation
│   └── validation.ts               # Basic draft validation
└── App.tsx                         # Routing, provider, theme, page shell
```

## Component design and patterns

### Container/presentation separation

`DataTable.tsx` is the feature-level container. It owns temporary view state such as the active view, page, query, sort, and scroll position. Smaller components receive only the props needed to render a focused concern:

- `TableToolbar` does not know how rows are stored; it emits search/filter/export events.
- `TableHeader` knows which column was selected but does not sort data itself.
- `EditableCell` only decides whether a cell is text or an input.
- `RowActions` only exposes row actions.
- `VirtualTableBody` receives a prepared row slice and the required callbacks.

This keeps the display layer easy to read and avoids a single table component growing around every feature.

### Context + reducer state management

The table uses React Context plus `useReducer`, rather than Redux, because table data is the only shared domain state. The reducer manages:

```text
rows       → saved employee records
drafts     → in-progress row edits keyed by employee ID
history    → previous saved versions, keyed by employee ID
```

This is a reducer/state-machine style flow: actions such as `startEdit`, `updateDraft`, `cancelEdit`, `saveEdit`, and `undo` describe state changes explicitly. It makes the edit lifecycle predictable and avoids prop drilling through every table component.

### Derived state

`useTableData` creates the filtered and sorted list with `useMemo`. The code does not store a second mutable copy for filtered results, which helps avoid stale or inconsistent data. Pagination and virtualization both consume this one result list.

### Manual virtualization

Virtualization uses a fixed 52px row height:

```text
scroll position
      ↓
first visible row index + overscan
      ↓
slice of matching rows is rendered
      ↓
slice is translated to its visual position inside a full-height spacer
```

Only the relevant slice is rendered. The full-height spacer maintains the expected scrollbar length for all matching rows. The visible-row count is based on the current `60vh` viewport height plus an overscan buffer, preventing blank gaps while scrolling or on taller displays.

## Design decisions

- **Client-side data:** Appropriate for a frontend task and 10,000 simple local records. The UI does not require an API to demonstrate editing and performance behavior.
- **Virtual view as the default:** It is the better experience for long continuous review of a large local result set.
- **Pagination as a fallback:** Provides a familiar alternative and mirrors how a future server-driven API could supply data one page at a time.
- **Custom CSS:** Keeps the UI intentionally simple and avoids adding a full component library for a small focused app.
- **`react-icons`:** Used only for the accessible light/dark icon control.
- **Drafts before saves:** Avoids accidental mutations and enables a meaningful Cancel action.

## Limitations and out-of-scope work

The following items are intentionally not implemented or would require additional product/API decisions:

- **No new-row creation.** The PRD requests editing existing rows but does not request adding records.
- **No row deletion.** This was not part of the requested workflow.
- **No backend or permanent data persistence.** Refreshing the page recreates the generated dataset. Theme preference is the only value persisted locally.
- **No API integration, authentication, authorization, audit trail, or concurrent-edit conflict handling.** These are necessary for a real production data-management system.
- **No server-side sorting, filtering, or pagination.** Client-side operations are suitable for the supplied 10,000-row mock dataset. Very large datasets should move these operations to an API/database.
- **Single-column sorting only.** The PRD lists multi-column sorting as optional; the delivered UI supports one active sortable column at a time.
- **No dedicated numeric range filters.** Search matches numeric values as text, and department has a dedicated filter. Salary/quantity min-max controls could be added if required.
- **Basic validation only.** Required text and numeric values are checked before saving, but field-level error messages and formal email validation are not included.
- **Undo is per row and in-memory.** It restores prior saves in the current browser session only; there is no global redo or persistent history.
- **Virtualization assumes fixed row height.** This keeps the implementation simple and fast; rows that dynamically grow in height would need a measured virtualization solution.
- **No automated tests are included.** The application has been checked with `npm run build` and `npm run lint`, but unit, integration, and end-to-end tests remain future work.
- **No mobile-specific table redesign.** On narrow screens the table is horizontally scrollable rather than transformed into cards.

## Suggested future improvements

1. Connect rows to a backend with optimistic updates and error recovery.
2. Add column-specific and numeric-range filters.
3. Add multi-column sorting and column visibility controls.
4. Add create/delete workflows once product requirements define permissions and validation.
5. Add unit tests for the reducer and utilities, component tests for editing, and end-to-end tests for the complete table workflow.
6. Use server-driven pagination/filtering/sorting for substantially larger datasets.
7. Replace fixed-height virtualization with measured rows if multiline or expandable content is introduced.
