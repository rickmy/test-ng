import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '@models/products/product';
import { environment } from '@env/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const urlBase = `${environment.urlBase}bp/products`  ;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
  });

  beforeEach(()=> {
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  })


  afterEach(() => {
    httpMock.verify();
  });

  it('Should create',()=> {
    expect(service).toBeTruthy();
  });

  it('should retrieve all products', () => {
    const dummyProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'Logo 1', date_revision: '2021-01-01', date_release: '2021-01-01' },
    ];

    service.getProducts().subscribe(res => {
      expect(res.data).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(urlBase);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

    

  it('should verify product ID', () => {
    const id = '123';
    service.verifyId(id).subscribe(result => {
      expect(result).toBe(true);
    });
    const req = httpMock.expectOne(`${urlBase}/verification/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });


  it('should post a product', () => {
    const newProduct: Product = { id: '3', name: 'New Product', description: 'Description', logo: 'Logo', date_revision: '2021-01-01', date_release: '2021-01-01' };

    service.postProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(urlBase);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should update a product', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', description: 'Description', logo: 'Logo', date_revision: '2021-01-01', date_release: '2021-01-01' };

    service.putProduct(updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${urlBase}/${updatedProduct.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });
 
  it('should delete a product', () => {
    const id = '1';

    service.deleteProduct(id).subscribe(result => {
      expect(result).toBeUndefined();
    });

    const req = httpMock.expectOne(`${urlBase}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
