import { Bench } from 'tinybench';
import * as at from './async_tests.ts';

const bench = new Bench({ time: 100 });

bench
  .add('try_catch', async function () {
    await at.tryTryCatchFib(2)
  })
  .add('ajel', async function () {
    await at.tryAsyncGoFib(2)
  })
  .add('neverthrow', async function () {
    await at.tryNeverthrowFib(2)
  })

await bench.run();
console.log("Fib(2)")
console.table(bench.table());

//------
console.log("")

bench
  .remove('try_catch')
  .remove('ajel')
  .remove('neverthrow')

bench
  .add('try_catch', async function () {
    await at.tryTryCatchFib(20)
  })
  .add('ajel', async function () {
    await at.tryAsyncGoFib(20)
  })
  .add('neverthrow', async function () {
    await at.tryNeverthrowFib(20)
  })

console.log("Fib(20)")
await bench.run();
console.table(bench.table());


//------
console.log("")

bench
  .remove('try_catch')
  .remove('ajel')
  .remove('neverthrow')

bench
  .add('try_catch', async function () {
    await at.tryTryCatchFile(2)
  })
  .add('ajel', async function () {
    await at.tryAsyncGoFile(2)
  })
  .add('neverthrow', async function () {
    await at.tryNeverthrowFile(2)
  })

console.log("Allocate 500kb Files 2 times")
await bench.run();
console.table(bench.table());
