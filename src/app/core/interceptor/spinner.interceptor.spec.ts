import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { spinnerInterceptor } from './spinner.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpinnerService } from '@services/spinner/spinner.service';
import { environment } from '@env/environment.development';
class MockSpinnerService {
  show = jest.fn();
  hide = jest.fn();
}
describe('spinnerInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let spinnerService: MockSpinnerService;
  let urlBase = environment.urlBase;

  beforeEach(() => {
    spinnerService = new MockSpinnerService();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useValue: spinnerInterceptor, multi: true },
        { provide: SpinnerService, useValue: spinnerService }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show spinner on request and hide on response', () => {
    httpClient.get(`${urlBase}bp/products`).subscribe();

    const req = httpMock.expectOne(`${urlBase}bp/products`);

    expect(spinnerService.show).toHaveBeenCalled();

    req.flush({});

    expect(spinnerService.hide).toHaveBeenCalled();
  });

  it('should hide spinner on request error', () => {
    httpClient.get(`${urlBase}bp/product`).subscribe({
      next: () => fail('should have failed with a 500 status'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${urlBase}bp/product`);

    expect(spinnerService.show).toHaveBeenCalled();

    req.flush('error', { status: 500, statusText: 'Internal Server Error' });

    expect(spinnerService.hide).toHaveBeenCalled();
  });
});
