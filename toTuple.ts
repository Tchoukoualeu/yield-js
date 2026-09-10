import { Result } from 'typescript-result'

export class DivisionByZeroError extends Error {
  readonly type = 'division-by-zero'
}

export class NonFiniteNumberError extends Error {
  readonly type = 'non-finite-number'
}

export function divide(a: number, b: number) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return Result.error(
      new NonFiniteNumberError('Both operands must be finite numbers'),
    )
  }

  if (b === 0) {
    return Result.error(new DivisionByZeroError(`Cannot divide ${a} by zero`))
  }

  return Result.ok(a / b)
}

function logDivision(a: number, b: number) {
  const [value, error] = divide(a, b).toTuple()

  switch (error?.type) {
    case 'division-by-zero':
      console.log(`toTuple(${a}, ${b}): [null, ${error.type}]`)
      console.log(`Error [${error.type}]: ${error.message}`)
      break
    case 'non-finite-number':
      console.log(`toTuple(${a}, ${b}): [null, ${error.type}]`)
      console.log(`Error [${error.type}]: ${error.message}`)
      break
    case undefined:
      console.log(`toTuple(${a}, ${b}): [${value}, null]`)
      console.log(`Success: ${value}`)
      break
  }
}

logDivision(10, 2)
logDivision(10, 0)
logDivision(Number.NaN, 2)
