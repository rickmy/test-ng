import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '@models/products/product';
import {environment} from "@env/environment";
import { GeneralResponse } from '@models/general/general-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private readonly _urlBaseProducts = environment.urlBase + 'bp/products';
  private readonly _httpClient = inject(HttpClient);
  
  getProducts() {
    return this._httpClient.get<GeneralResponse<Product>>(this._urlBaseProducts);
  }

  verifyId(id: string) {
    return this._httpClient.get<boolean>(
      `${this._urlBaseProducts}/verification/uno`,
      {
        params: {
          id,
        },
      },
    );
  }

  postProduct(product: Product) {
    return this._httpClient.post<Product>(
      this._urlBaseProducts,
      product,
    );
  }

  putProduct(product: Product) {
    return this._httpClient.put<Product>(`${this._urlBaseProducts}/uno`, product);
  }

  deleteProduct(id: string) {
    return this._httpClient.delete<void>(`${this._urlBaseProducts}/dos`, {
      params: {
        id,
      },
    });
  }
}
