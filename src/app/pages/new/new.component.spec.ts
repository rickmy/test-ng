import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewComponent } from './new.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from '@services/api/product.service';
import { ToastService } from '@services/toast/toast.service';
import { of } from 'rxjs';
import { GeneralResponse } from '@models/general/general-response';
import { Product } from '@models/products/product';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  let productServive: ProductService;
  const product: Product = {
    id: '123',
    name: 'tarjeta Visa',
    logo: 'es un logo para este prodcutp',
    date_release: '2024-12-12',
    date_revision: '2025-12-12',
    description: 'es una preuba',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NewComponent,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ], //va el componente en imports al ser standalone
      providers: [provideRouter([]), ProductService, ToastService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
    productServive = fixture.debugElement.injector.get(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verify id router id', () => {
    const id = '123';

    const responseData: Product[] = [product];

    const activedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    activedRoute.params = of({ id });
    const spy = jest
      .spyOn(productServive, 'getProducts')
      .mockReturnValueOnce(of(responseData));

    component.verifyRouterId();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.idProduct).toBe(id);
    expect(component.product).toEqual(product);
  });

  it('verify Id if exist', () => {
    const idExample = '123';

    const spy = jest
      .spyOn(productServive, 'verifyId')
      .mockImplementation(() => of(true));

    component.verifyId(idExample);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('verify id if not exist', () => {
    const idExample = '13';

    const spy = jest
      .spyOn(productServive, 'verifyId')
      .mockImplementation(() => of(false));

    component.verifyId(idExample);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('save  product', () => {
    const spy = jest.spyOn(component.form, 'markAllAsTouched'); // Espía el método markAllAsTouched

    component.save();

    expect(component.form.invalid).toBe(true); 
    expect(spy).toHaveBeenCalled(); 
 
  })

  it('should create a product if no product exists', () => {
    const spyCreate = jest.spyOn(component, 'createProduct');

    const form = component.form;

    form.enable();

    form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo
    });

    form.get('date_release')?.setValue(product.date_release);
    expect(form.valid).toBe(true);
    component.save();
    component.product = null;


    expect(spyCreate).toHaveBeenCalled(); // Verifica que se llame al método createProduct
  });

  it('should update a product if a product exists', () => {
    const spy = jest.spyOn(component, 'updateProduct');
    component.product = product; 
    component.form.patchValue({...product});
    expect(component.form.valid).toBe(true);
    component.save();
    expect(spy).toHaveBeenCalled(); 
  });


  afterEach(() => {
    component.unsubscribe$.next();
    component.unsubscribe$.complete();
  });
});
