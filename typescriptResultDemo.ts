import { Result } from 'typescript-result'

class UnableToFetchTransactionAmountError extends Error {
  readonly type = 'unable-to-fetch-transaction-amount'

  constructor(message: string, readonly cause: unknown) {
    super(message)
  }
}

class UnableToFetchDiscountRateError extends Error {
  readonly type = 'unable-to-fetch-discount-rate'

  constructor(message: string, readonly cause: unknown) {
    super(message)
  }
}

class InvalidDiscountRateError extends Error {
  readonly type = 'invalid-discount-rate'
}

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds)
  })

function fetchTransactionAmount(transactionId: string) {
  return Result.try(
    async () => {
      await wait(100)

      if (transactionId === 'missing-transaction') {
        throw new Error('Transaction was not found')
      }

      return 120
    },
    (cause) =>
      new UnableToFetchTransactionAmountError(
        `Unable to fetch amount for "${transactionId}"`,
        cause,
      ),
  )
}

function fetchDiscountRate(transactionId: string) {
  return Result.try(
    async () => {
      await wait(100)

      if (transactionId === 'discount-service-down') {
        throw new Error('Discount service is unavailable')
      }

      return 0.2
    },
    (cause) =>
      new UnableToFetchDiscountRateError(
        `Unable to fetch discount rate for "${transactionId}"`,
        cause,
      ),
  )
}

function applyDiscount(amount: number, discountRate: number) {
  if (discountRate < 0 || discountRate > 1) {
    return Result.error(
      new InvalidDiscountRateError(`Discount rate must be between 0 and 1: ${discountRate}`),
    )
  }

  return Result.ok(amount * (1 - discountRate))
}

function* getDiscountedPrice(transactionId: string) {
  const amount = yield* fetchTransactionAmount(transactionId)

  const discountRate = yield* fetchDiscountRate(transactionId).recover(() => {
    console.log('Discount lookup failed; using the default rate of 10%.')

    return 0.1
  })

  const finalAmount = yield* applyDiscount(amount, discountRate)

  return `Final amount to charge: ${finalAmount.toFixed(2)}`
}

async function run(transactionId: string) {
  console.log(`\nTransaction: ${transactionId}`)

  const result = await Result.gen(getDiscountedPrice(transactionId))

  result.fold(
    (value) => console.log(`Success: ${value}`),
    (error) => console.error(`Error [${error.type}]: ${error.message}`),
  )
}

async function main() {
  const transactionIds = process.argv.slice(2)
  const scenarios =
    transactionIds.length > 0
      ? transactionIds
      : ['transaction-123', 'discount-service-down', 'missing-transaction']

  for (const transactionId of scenarios) {
    await run(transactionId)
  }
}

void main()
