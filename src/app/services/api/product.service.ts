import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '@models/products/product';
import {environment} from "@env/environment";
import { GeneralResponse } from '@models/general/general-response';
import { ResponseApi } from '@models/general/responseApi';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private readonly _urlBaseProducts = environment.urlBase + 'bp/products';
  private readonly _httpClient = inject(HttpClient);
  
  getProducts(): Observable<Product[]> {
    return this._httpClient.get<GeneralResponse<Product>>(this._urlBaseProducts)
      .pipe(
        map(res => res.data)
      );
  }

  verifyId(id: string) {
    return this._httpClient.get<boolean>(
      `${this._urlBaseProducts}/verification/${id}`
    );
  }

  postProduct(product: Product): Observable<ResponseApi<Product>> {
    return this._httpClient.post<ResponseApi<Product>>(
      this._urlBaseProducts,
      product,
    );
  }

  putProduct(product: Product): Observable<ResponseApi<Product>> {
    return this._httpClient.put<ResponseApi<Product>>(`${this._urlBaseProducts}/${product.id}`, product);
  }

  deleteProduct(id: string): Observable<ResponseApi<Product>> {
    return this._httpClient.delete<ResponseApi<Product>>(`${this._urlBaseProducts}/${id}`);
  }
}
