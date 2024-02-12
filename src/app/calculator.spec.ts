import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  describe('Tests for multiply operation', () => {
    it('3x3 should return 9', () => {
      const calculator = new Calculator();
      const rta = calculator.multiply(3, 3);

      expect(rta).toEqual(9);
    });

    it('1x4 should return 4', () => {
      const calculator = new Calculator();
      const rta = calculator.multiply(1, 4);

      expect(rta).toEqual(4);
    });
  });

  describe('Tests for divide operation', () => {
    it('should return a some numbers', () => {
      const calculator = new Calculator();

      expect(calculator.divide(6, 3)).toEqual(2);
      expect(calculator.divide(5, 2)).toEqual(2.5);
    });

    it('divide by 0 should return null', () => {
      const calculator = new Calculator();
      const rta = calculator.divide(3, 0);

      expect(rta).toBeNull();
    });
  });
});
