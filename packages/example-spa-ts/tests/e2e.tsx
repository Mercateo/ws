import { By } from 'selenium-webdriver';
import expect from 'expect';
import { driver } from './e2e.setup';

describe('test my spa', function() {
  this.timeout(20000);

  it('should render my name component', async () => {
    await driver.get('localhost:8080');
    expect(await driver.findElement(By.css('.name-component')).getText()).toBe(
      'Hello _otbe_! Sum is 3.'
    );
  });
});
