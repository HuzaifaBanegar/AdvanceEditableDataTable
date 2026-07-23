import type { Employee } from '../types/table'

export function exportEmployeesCsv(rows: Employee[]) {
  const headers = ['ID', 'Name', 'Email', 'Department', 'Salary', 'Quantity', 'Status']
  const content = [headers, ...rows.map((row) => [row.id, row.name, row.email, row.department, row.salary, row.quantity, row.status])]
    .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'employees.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}

