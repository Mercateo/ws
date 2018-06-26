import expect from 'expect';
import { multiply } from '../src';

describe('test my code', () => {
  it('should multipy two numbers', () => {
    expect(multiply(1, 1)).toBe(1);
  });
});
