import { useContext, useMemo } from 'react'
import { TableDataContext } from '../context/tableDataStore'
import type { SortState } from '../types/table'

export function useTableData(query: string, department: string, sort: SortState) {
  const tableData = useContext(TableDataContext)
  if (!tableData) throw new Error('useTableData must be used inside TableDataProvider')
  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = tableData.rows.filter((row) => (department === 'All' || row.department === department) && (!normalizedQuery || [row.name, row.email, row.department, row.status, row.salary, row.quantity].join(' ').toLowerCase().includes(normalizedQuery)))
    if (!sort) return filtered
    return [...filtered].sort((a, b) => {
      const left = a[sort.key]
      const right = b[sort.key]
      const result = typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right))
      return sort.direction === 'asc' ? result : -result
    })
  }, [tableData.rows, query, department, sort])
  return { ...tableData, filteredRows }
}
