function* allValues(): Generator<string | number, string, string> {
  yield 'start'

  yield* [1, 2, 3]

  const answer = yield 'What is your answer?'

  return `You answered: ${answer}`
}

const generator = allValues()

console.log(generator.next())
// { value: "start", done: false }

console.log(generator.next())
// { value: 1, done: false }

console.log(generator.next())
// { value: 2, done: false }

console.log(generator.next())
// { value: 3, done: false }

console.log(generator.next())
// { value: "What is your answer?", done: false }

console.log(generator.next('yes'))
// { value: "You answered: yes", done: true }

// yield value;   // yield one value
// yield* values; // yield every value from another iterable
