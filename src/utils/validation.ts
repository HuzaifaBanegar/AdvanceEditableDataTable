import type { Employee } from '../types/table'

export function isValidEmployee(row: Employee) {
  return Boolean(row.name.trim() && row.email.trim() && !Number.isNaN(row.salary) && !Number.isNaN(row.quantity))
}

