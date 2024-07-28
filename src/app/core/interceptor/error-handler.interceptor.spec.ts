import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';

import { errorHandlerInterceptor } from './error-handler.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastService } from '@services/toast/toast.service';
import { catchError, throwError } from 'rxjs';
import { environment } from '@env/environment.development';

class MockToastService {
  openToast = jest.fn();
}

describe('errorHandlerInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let toastService: MockToastService;
  const urlBase = environment.urlBase;

  beforeEach(() => {
    toastService = new MockToastService();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useValue: errorHandlerInterceptor, multi: true },
        { provide: ToastService, useValue: toastService }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle client-side error', () => {
    const errorEvent = new ErrorEvent('Network error');

    httpClient.get(`${urlBase}bp/product`).pipe(
      catchError((error: HttpErrorResponse) => {
        expect(error).toBeTruthy();
        return throwError(() => error);
      })
    ).subscribe();

    const req = httpMock.expectOne(`${urlBase}bp/product`);

    expect(toastService.openToast).toHaveBeenCalledWith({
      severity: 'error',
      detail: errorEvent.message
    });
  });

});
