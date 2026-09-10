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

function logDivision(a: number, b: number) {
  divide(a, b)
    .onSuccess((value) => console.log(`onSuccess(${a} / ${b}): ${value}`))
    .onFailure((error) =>
      console.log(`onFailure(${a} / ${b}): [${error.type}] ${error.message}`),
    )
    .map((value) => value * 2)
    .onSuccess((value) => console.log(`after map * 2: ${value}`))
}

logDivision(10, 2)
logDivision(10, 0)
