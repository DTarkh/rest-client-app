import { clsx as cn } from 'clsx'

export function clsx(...args: Parameters<typeof cn>) {
  return cn(...args)
}
