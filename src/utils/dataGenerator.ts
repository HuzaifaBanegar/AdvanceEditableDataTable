import type { Employee } from '../types/table'

export const departments = ['Engineering', 'Design', 'Sales', 'Operations', 'Support']

export function makeEmployees(count: number): Employee[] {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1
    return { id, name: `Employee ${id}`, email: `employee${id}@example.com`, department: departments[index % departments.length], salary: 42000 + ((id * 137) % 88000), quantity: (id * 7) % 250, status: id % 6 === 0 ? 'Inactive' : 'Active' }
  })
}

