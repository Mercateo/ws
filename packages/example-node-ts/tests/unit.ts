import expect from 'expect';
import { getCwd } from '../src/index';

describe('test my code', () => {
  it('should return cwd', () => {
    expect(getCwd()).toBe(process.cwd());
  });
});
