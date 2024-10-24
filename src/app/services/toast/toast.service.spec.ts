import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { Toast } from '@models/toast/toast';

const toast: Toast = {
  severity: 'success',
  detail: '',
};

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with display set to false', () => {
    expect(service.display()).toBe(false);
  });

  it('should initialize with toast', () => {
    expect(service.toast()).toEqual(toast);
  });

  it('should openToast function works correctly', ()=> {
    toast.detail = 'funciona correctamente'
    service.openToast(toast);
    expect(service.toast()).toEqual(toast);
    expect(service.display()).toBe(true);
  });

  it('should closeToast function works correctly', ()=> {
    service.closeToast();
    expect(service.display()).toBe(false);
  })

});
