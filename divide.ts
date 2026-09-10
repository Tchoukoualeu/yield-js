import { Result } from 'typescript-result'

export class IllegalArgumentError extends Error {
  readonly type = 'illegal-argument-error'
}

export function divide(a: number, b: number) {
  if (b === 0) {
    return Result.error(new IllegalArgumentError(`Cannot divide ${a} by zero`))
  }

  return Result.ok(a / b)
}

divide(10, 2).fold(
  (value) => console.log(`Success: ${value}`),
  (error) => console.error(`Error [${error.type}]: ${error.message}`),
)
divide(10, 0).fold(
  (value) => console.log(`Success: ${value}`),
  (error) => console.error(`Error [${error.type}]: ${error.message}`),
)
