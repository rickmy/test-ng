import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@models/products/product';
import { ToastService } from '@services/toast/toast.service';
import { ProductService } from '@services/api/product.service';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewComponent implements OnDestroy {
  unsubscribe$ = new Subject<void>();
  form!: FormGroup;
  today = new Date();
  product: Product | undefined;

  constructor(
    private _fb: FormBuilder,
    private _productService: ProductService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _toastService: ToastService,
  ) {
    this._activeRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        if (params['id']) this.getProduct(params['id']);
      });
    this.builderForm();

    this.f['id'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((value) => {
        if (!this.product) this.verifyId(value);
      });

    this.f['date_release'].valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe((value: string) => {
        if (new Date(value) >= this.today) {
          const dateReleaseToArray = value.split('-');
          dateReleaseToArray[0] = (+dateReleaseToArray[0] + 1).toString();
          this.f['date_revision'].setValue(dateReleaseToArray.join('-'));
          this.f['date_release'].setErrors(null);
        } else {
          this.f['date_revision'].setValue(null);
          this.f['date_release'].setErrors({ invalidDate: true });
        }
        this.f['date_revision'].updateValueAndValidity();
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
      date_release: [null, [Validators.required]],
      date_revision: [{ value: null, disabled: true }, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  verifyId(id: string) {
    this._productService
      .verifyId(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        return response
          ? this.f['id'].setErrors({ idExists: true })
          : this.f['id'].setErrors(null);
      });
    this.f['id'].updateValueAndValidity();
  }

  clearForm() {
    this.form.reset();
    this.form.markAsPristine();
  }

  save() {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }
    if (!this.product) this.createProduct();
    else this.updateProduct();
  }

  createProduct() {
    this._productService
      .postProduct({
        ...this.form.value,
        date_revision: this.f['date_revision'].value,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.clearForm();
        this._router.navigate(['/list']);
        this._toastService.openToast({
          severity: 'success',
          detail: 'Producto creado correctamente',
        });
      });
  }

  updateProduct() {
    this._productService
      .putProduct({
        ...this.form.value,
        id: this.product?.id,
        date_revision: this.f['date_revision'].value,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.clearForm();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getProduct(id: string) {
    this._productService
      .getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((products) => {
        this.product = products.find((product) => product.id === id)!;
        this.form.patchValue({
          ...this.product,
          date_release: this.product.date_release.split('T')[0],
          date_revision: this.product.date_revision.split('T')[0],
        });
        this.f['id'].disable();
      });
  }
}
