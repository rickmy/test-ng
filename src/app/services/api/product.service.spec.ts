import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@env/environment';
import { Product } from '@models/products/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const urlBase = environment.urlBase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all products', () => {
    const dummyProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'Logo 1', date_revision: '2021-01-01', date_release: '2021-01-01' },
    ];

    service.getProducts().subscribe(res => {
      expect(res.data.length).toBe(2);
      expect(res.data).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(`${urlBase}bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should verify product ID', () => {
    const id = '123';
    const verification = true;

    service.verifyId(id).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(`${urlBase}bp/products/verification?id=${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(verification);
  });

  it('should post a product', () => {
    const newProduct: Product = { id: '3', name: 'New Product', description: 'Description', logo: 'Logo', date_revision: '2021-01-01', date_release: '2021-01-01' };

    service.postProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(`${urlBase}bp/products`);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should update a product', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', description: 'Description', logo: 'Logo', date_revision: '2021-01-01', date_release: '2021-01-01' };

    service.putProduct(updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${urlBase}bp/products`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    const id = '1';

    service.deleteProduct(id).subscribe(result => {
      expect(result).toBeUndefined();
    });

    const req = httpMock.expectOne(`${urlBase}bp/products?id=${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
