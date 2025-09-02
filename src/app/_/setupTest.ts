import '@testing-library/jest-dom'
import { beforeEach, beforeAll, afterAll } from 'vitest'

beforeEach(() => {
  document.body.innerHTML = ''
})

const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is deprecated')) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
