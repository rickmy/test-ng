import { TestBed } from '@angular/core/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient, provideHttpClient,
} from '@angular/common/http';

import { authorInterceptor } from './author.interceptor';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '@env/environment.development';

describe('authorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(),
        { provide: HTTP_INTERCEPTORS, useClass: authorInterceptor, multi: true }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });


  it('should add an authorId header', () => {
    httpClient.get(environment.urlBase).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('/data');

    expect(httpRequest.request.headers.has('authorId')).toEqual(true);
    expect(httpRequest.request.headers.get('authorId')).toBe('234');
  });


});
