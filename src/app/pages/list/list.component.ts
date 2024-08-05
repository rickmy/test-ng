import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '@models/products/product';
import { ProductService } from '@services/api/product.service';
import { DatePipe } from '@angular/common';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';

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
  unsubscribe$ = new Subject<void>();
  products: Product[] = [];
  productsFiltered: Product[] = [];

  displayModal = false;
  product: Product | undefined;
  row = 5;
  pageCurrent = 1;
  search = new FormControl('');

  constructor(
    private _productService: ProductService,
    private _router: Router,
    private _cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((value) => {
        this.productsFiltered = [];
        if (value === '') {
          this.getAllProducts(this.row);
          return;
        }

        this.products.filter((product) => {
          if (product.name.toLowerCase().indexOf(value!.toLowerCase()) > -1) {
            this.productsFiltered.push(product);
          }
        });
        this.pageCurrent = 1;
      });
  }

  getProducts() {
    this._productService
      .getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.products = res.data;
        res.data.length > this.row
          ? this.getAllProducts(this.row)
          : (this.productsFiltered = res.data);
        this.changePage(this.pageCurrent);
        this._cd.detectChanges();
      });
  }

  getAllProducts(row: number) {
    this.productsFiltered = this.products.slice(0, row);
  }

  changePage(page: number) {
    this.pageCurrent = page;
    const start = (page - 1) * this.row;
    const end = Math.min(start + this.row, this.products.length);
    this.productsFiltered = this.products.slice(start, end);
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

  deleteProduct() {
    this._productService
      .deleteProduct(this.product!.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getProducts();
        this.hiddenModal();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
