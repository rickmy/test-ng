import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '@models/products/product';
import { DatePipe } from '@angular/common';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { ProductsStore } from '@core/store/product.store';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit, OnDestroy {
  readonly store = inject(ProductsStore);
  unsubscribe$ = new Subject<void>();
  productsFiltered: Product[] = [];

  displayModal = false;
  product: Product | undefined;
  row = 5;
  pageCurrent = 1;
  search = new FormControl<string>('');

  private _router = inject(Router);

  async ngOnInit() {
    await this.store.getAllProducts();
    this.getProducts();
    this.searchChange();
  }

  searchChange() {
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(value => {
        this.productsFiltered = [];
        if (value === '') {
          this.getAllProducts(this.row);
          return;
        }
        this.store.filter = signal<string>(value!);
        this.productsFiltered = this.store.filterProduct();
        this.pageCurrent = 1;
      });
  }

  getProducts() {
    this.store.products().length > this.row
      ? this.getAllProducts(this.row)
      : (this.productsFiltered = this.store.products());
    this.changePage(this.pageCurrent);
  }

  getAllProducts(row: number) {
    this.productsFiltered = this.store.products().slice(0, row);
  }

  changePage(page: number) {
    this.pageCurrent = page;
    const start = (page - 1) * this.row;
    const end = Math.min(start + this.row, this.store.products().length);
    this.productsFiltered = this.store.products().slice(start, end);
  }

  redirectNew() {
    this._router.navigate(['new']).then();
  }

  redirectEdit(id: string) {
    this._router.navigate(['edit', id]).then();
  }

  showModal(product: Product) {
    this.product = product;
    this.displayModal = true;
  }

  hiddenModal() {
    this.displayModal = false;
  }

  async deleteProduct() {
    await this.store.removeProduct(this.product!.id);
    this.hiddenModal();
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
