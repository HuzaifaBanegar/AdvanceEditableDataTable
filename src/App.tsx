import { useContext, useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DataTable } from "./components/DataTable/DataTable";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { TableDataProvider } from "./context/TableDataContext";
import { TableDataContext } from "./context/tableDataStore";
import { useBeforeUnloadPrompt } from "./hooks/useBeforeUnloadPrompt";
import { NotFound } from "./pages/NotFound";
import "./App.css";

function TablePage() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("table-theme") === "dark",
  );
  const tableData = useContext(TableDataContext);
  if (!tableData)
    throw new Error("TablePage must be used inside TableDataProvider");
  const { rows, drafts } = tableData;
  useBeforeUnloadPrompt(Object.keys(drafts).length > 0);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("table-theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Employee data</h1>
          <p>
            Manage and update {rows.length.toLocaleString()} employee records.
          </p>
        </div>
        <button
          className="icon-button"
          onClick={() => setDark((value) => !value)}
          aria-label={dark ? "Use light mode" : "Use dark mode"}
          title={dark ? "Use light mode" : "Use dark mode"}
        >
          {dark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>
      </header>
      <DataTable />
    </main>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <TableDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TablePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TableDataProvider>
    </ErrorBoundary>
  );
}

export default App;
