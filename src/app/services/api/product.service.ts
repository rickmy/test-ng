import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '@models/products/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  urlBase =
    'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/';

  constructor(private _httpClient: HttpClient) {}

  getProducts() {
    return this._httpClient.get<Product[]>(`${this.urlBase}bp/products`);
  }

  verifyId(id: string) {
    return this._httpClient.get<boolean>(
      `${this.urlBase}bp/products/verification`,
      {
        params: {
          id,
        },
      },
    );
  }

  postProduct(product: Product) {
    return this._httpClient.post<Product>(
      `${this.urlBase}bp/products`,
      product,
    );
  }

  putProduct(product: Product) {
    return this._httpClient.put<Product>(`${this.urlBase}bp/products`, product);
  }

  deleteProduct(id: string) {
    return this._httpClient.delete<void>(`${this.urlBase}bp/products`, {
      params: {
        id,
      },
    });
  }
}
