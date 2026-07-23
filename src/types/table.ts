export type Status = 'Active' | 'Inactive'

export type Employee = {
  id: number
  name: string
  email: string
  department: string
  salary: number
  quantity: number
  status: Status
}

export type SortKey = keyof Pick<Employee, 'name' | 'email' | 'department' | 'salary' | 'quantity' | 'status'>
export type SortDirection = 'asc' | 'desc'
export type SortState = { key: SortKey; direction: SortDirection } | null
export type TableView = 'virtual' | 'paginated'

