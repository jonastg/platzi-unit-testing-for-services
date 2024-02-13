export class FakeValueService {
  getValue() {
    return 'fake value';
  }

  setValue(value: string) {}

  getValueAsPromise() {
    return Promise.resolve('[promise] fake value');
  }
}
