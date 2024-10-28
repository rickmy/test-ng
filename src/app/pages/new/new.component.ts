import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '@models/products/product';
import { ProductService } from '@services/api/product.service';
import { dateValidator } from '@shared/validators/date.validator';
import { ProductsStore } from '@core/store/product.store';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css',
})
export class NewComponent implements OnDestroy, OnInit {
  unsubscribe$ = new Subject<void>();
  form!: FormGroup;
  today = Date.now();
  product: Product | null = null;
  idProduct: string | null = null;
  store = inject(ProductsStore);
  private _fb = inject(FormBuilder);
  private _productService = inject(ProductService);
  private _router = inject(Router);
  private _activeRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.verifyRouterId();
    this.builderForm();
    this.verifyChangeId();
    this.verifyDateChange();
  }

  verifyRouterId() {
    this._activeRoute.params
      .pipe(
        filter(({ id }) => !!id),
        tap(({ id }) => (this.idProduct = id)),
        switchMap(() => this._productService.getProducts()),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(products => {
        this.product = products.find(product => product.id === this.idProduct)!;
        this.form.patchValue({
          ...this.product,
          date_release: this.product.date_release.split('T')[0],
          date_revision: this.product.date_revision.split('T')[0],
        });
        this.f['id'].disable();
        this.f['id'].setValue(this.idProduct);
      });
  }

  verifyChangeId() {
    this.f['id'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(value => value.length > 0),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(value => {
        if (!this.product) this.verifyId(value);
      });
  }

  verifyDateChange() {
    this.f['date_release'].valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$),
        filter(value => !!value)
      )
      .subscribe((value: string) => {
        const dateReleaseToArray = value.split('-');
        dateReleaseToArray[0] = (+dateReleaseToArray[0] + 1).toString();
        this.f['date_revision'].setValue(dateReleaseToArray.join('-'));
      });
  }

  builderForm() {
    this.form = this._fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [null, Validators.required],
      date_release: [null, [Validators.required, dateValidator()]],
      date_revision: [{ value: null, disabled: true }],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  verifyId(id: string) {
    this._productService
      .verifyId(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        response
          ? this.f['id'].setErrors({ idExists: true })
          : this.f['id'].setErrors(null);
      });
    this.f['id'].updateValueAndValidity();
    this.f['id'].markAsTouched();
  }

  clearForm() {
    this.form.reset();
    this.form.markAsPristine();

    if (this.idProduct) {
      this.f['id'].setValue(this.idProduct);
    }
  }

  save() {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }
    if (!this.product) this.createProduct();
    else this.updateProduct();
  }

  createProduct() {
    this.store.addProduct({
      ...this.form.getRawValue(),
    });
    this.clearForm();
    this._router.navigate(['/list']).then();
  }

  updateProduct() {
    this.store.updateProduct({...this.form.getRawValue()});
    this.clearForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
