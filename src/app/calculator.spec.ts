import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  it('3x3 should return 9', () => {
    const calculator = new Calculator();
    const rta = calculator.multiply(3, 3);

    expect(rta).toEqual(9);
  });

  it('divide by 0 should return null', () => {
    const calculator = new Calculator();
    const rta = calculator.divide(3, 0);

    expect(rta).toBeNull();
  });
});
