import { Result } from 'typescript-result'

/**
 * onSuccess/onFailure only run side effects and still return the same Result, so they won’t produce 
 * an API response. I’ll add a handler example that logs with those hooks and uses fold to return the HTTP payload.
 */

export class IllegalArgumentError extends Error {
  readonly type = 'illegal-argument-error'
}

export function divide(a: number, b: number) {
  if (b === 0) {
    return Result.error(new IllegalArgumentError(`Cannot divide ${a} by zero`))
  }

  return Result.ok(a / b)
}

type ApiResponse<T> =
  | { status: 200; body: T }
  | { status: 400; body: { type: string; error: string } }

function handleDivide(a: number, b: number): ApiResponse<{ result: number }> {
  return divide(a, b)
    .onSuccess((value) => console.log(`computed ${a} / ${b} = ${value}`))
    .onFailure((error) =>
      console.log(`failed ${a} / ${b}: [${error.type}] ${error.message}`),
    )
    .fold(
      (value) => ({ status: 200, body: { result: value } }),
      (error) => ({
        status: 400,
        body: { type: error.type, error: error.message },
      }),
    )
}

console.log('GET /divide?a=10&b=2', handleDivide(10, 2))
console.log('GET /divide?a=10&b=0', handleDivide(10, 0))
