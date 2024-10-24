import { TestBed } from '@angular/core/testing';

import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
    service.isLoading.set(false)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isLoading set to false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should be show display',()=> {
    service.show();
    expect(service.isLoading()).toBe(true)
  });

  it('should be hidden display', () => {
    service.hide();
    expect(service.isLoading()).toBe(false)
  });




});
