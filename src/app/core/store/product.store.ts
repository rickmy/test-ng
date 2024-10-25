import { computed, inject } from '@angular/core';
import { Product } from '@models/products/product';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { ProductService } from '@services/api/product.service';
import { ToastService } from '@services/toast/toast.service';
import { lastValueFrom } from 'rxjs';
type ProductsState = {
  products: Product[];
  isLoading: boolean;
  filter: string;
};

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  filter: '',
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<Product>(),
  withComputed(({ products, filter }) => ({
    productCount: computed(() => products().length),
    filterProduct: computed(() => {
      return products().filter(
        product =>
          product.name.toLowerCase().indexOf(filter()!.toLowerCase()) > -1
      );
    }),
  })),
  withMethods(
    (
      store,
      productService = inject(ProductService),
      toastService = inject(ToastService)
    ) => ({
      async getAllProducts() {
        const products = await lastValueFrom(productService.getProducts());
        patchState(store, {products});
      },
      getProduct(id: string) {
        return store.products().find(product => product.id === id);
      },
      async addProduct(product: Product) {
        try {
          await lastValueFrom(productService.postProduct(product));
          patchState(store, addEntity(product));
        } catch (error) {
          console.error(error);
        }
      },
      async updateProduct(product: Product) {
        try {
          await lastValueFrom(productService.putProduct(product));
          patchState(store, updateEntity({ id: product.id, changes: product }));
        } catch (error) {
          console.error(error);
        }
      },
      async removeProduct(id: string) {
        try {
          const res = await lastValueFrom(productService.deleteProduct(id));
          patchState(store, ({ products }) => ({
            products: products.filter(prod => prod.id !== id)
          }) );
          toastService.openToast({
            severity: 'success',
            detail: res.message,
          });
        } catch (error) {
          console.error(error);
        }
      },
    })
  )
);
