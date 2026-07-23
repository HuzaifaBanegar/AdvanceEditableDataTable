
export const DetailsStatus = {
  Idle: 'idle',
  Loading: 'loading',
  Success: 'success',
  Error: 'error',
} as const

export type DetailsStatus = typeof DetailsStatus[keyof typeof DetailsStatus]
