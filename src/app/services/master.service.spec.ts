import { TestBed } from '@angular/core/testing';
import { FakeValueService } from './fake-value.service';
import { MasterService } from './master.service';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [MasterService, { provide: ValueService, useValue: spy }],
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(
      ValueService
    ) as jasmine.SpyObj<ValueService>;
  });

  it('should be create', () => {
    expect(masterService).toBeTruthy();
  });

  // it('should return "my value" from the real service', () => {
  //   const valueService = new ValueService();
  //   const masterService = new MasterService(valueService);

  //   expect(masterService.getValue()).toBe('simple value');
  // });

  // it('should return "other value" from the fake service', () => {
  //   const fakeValueService = new FakeValueService();
  //   const masterService = new MasterService(
  //     fakeValueService as unknown as ValueService
  //   );

  //   expect(masterService.getValue()).toBe('fake value');
  // });

  // it('should return "other value" from the fake object', () => {
  //   const fake = { getValue: () => 'fake from object' };
  //   const masterService = new MasterService(fake as ValueService);

  //   expect(masterService.getValue()).toBe('fake from object');
  // });

  it('should call to getValue from ValueService', () => {
    // const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    valueServiceSpy.getValue.and.returnValue('fake value');
    // const masterService = new MasterService(valueServiceSpy);

    expect(masterService.getValue()).toBe('fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
