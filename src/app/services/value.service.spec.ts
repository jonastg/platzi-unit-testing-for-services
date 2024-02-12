import { ValueService } from './value.service';

fdescribe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    service = new ValueService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for getValue method', () => {
    it('should return "simple value"', () => {
      expect(service.getValue()).toBe('simple value');
    });
  });

  describe('Tests for setValue', () => {
    it('should change the value', () => {
      expect(service.getValue()).toBe('simple value');
      service.setValue('changed');
      expect(service.getValue()).toBe('changed');
    });
  });

  describe('Tests for getValueAsPromise method', () => {
    it('should return "[promise] simple value" from promise using then', (doneFn) => {
      service.getValueAsPromise().then((result) => {
        expect(result).toBe('[promise] simple value');
        doneFn();
      });
    });

    it('should return "[promise] simple value" from promise using async', async () => {
      const result = await service.getValueAsPromise();
      expect(result).toBe('[promise] simple value');
    });
  });
});
