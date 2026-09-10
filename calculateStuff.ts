import { Result } from 'typescript-result'

class UnableToFetchFirstError extends Error {
  readonly type = 'unable-to-fetch-first'
}

class UnableToFetchSecondError extends Error {
  readonly type = 'unable-to-fetch-second'
}

function something(fail: boolean) {
  if (fail) {
    return Result.error(new UnableToFetchFirstError('something() failed'))
  }

  return Result.ok(10)
}

function somethingElse(fail: boolean) {
  if (fail) {
    return Result.error(new UnableToFetchSecondError('somethingElse() failed'))
  }

  return Result.ok(5)
}

function calculateStuff(failFirst: boolean, failSecond: boolean) {
  return Result.gen(function* calculateStuff() {
    const first = yield* something(failFirst)
    const second = yield* somethingElse(failSecond)

    return first + second
  })
}

function logResult(label: string, failFirst: boolean, failSecond: boolean) {
  const result = calculateStuff(failFirst, failSecond)

  result.fold(
    (value) => console.log(`${label}: Success: ${value}`),
    (error) => console.log(`${label}: Error [${error.type}]: ${error.message}`),
  )
}

logResult('both succeed', false, false)
logResult('first fails', true, false)
logResult('second fails', false, true)
