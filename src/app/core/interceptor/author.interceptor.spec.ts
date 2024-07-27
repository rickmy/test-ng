import { TestBed } from '@angular/core/testing';
import {HttpClient, HttpInterceptorFn} from '@angular/common/http';

import { authorInterceptor } from './author.interceptor';
import {HttpTestingController} from "@angular/common/http/testing";

describe('authorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: () => {},
          },
        },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  })

  afterEach(() => {
    httpMock.verify();
  });

  it('should add authorId header', () => {
    const authorId = '234';
    const url = 'https://api.com';
    httpClient.get(url).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.headers.get('authorId')).toBe(authorId);

  });

});
