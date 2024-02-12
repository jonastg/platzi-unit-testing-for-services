import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValueService {
  private value = 'simple value';

  getValue() {
    return this.value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getValueAsPromise() {
    return Promise.resolve('[promise] simple value');
  }

  getValueAsObservable() {
    return of('[observable] simple value');
  }
}
