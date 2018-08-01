import { getCwd } from 'example-node-ts';

console.log(getCwd());

if (process.env.foo !== 'bar') {
  throw `Passing build time env vars didn't work!`;
} else {
  console.log('Passed build time env var is:', process.env.foo);
}
