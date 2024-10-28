import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ProductService } from '@services/api/product.service';
import { Product } from '@models/products/product';
import { ToastService } from '@services/toast/toast.service';
import { ResponseApi } from '@models/general/responseApi';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

const product: Product = {
  id: '12',
  name: 'tarjeta visa',
  logo: '',
  date_release: '',
  date_revision: '',
  description: '',
};

const responseData: Product[] = [product];

class TestRouteComponent {}
describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        provideHttpClient(),
        provideRouter([
          {path: 'new', component: TestRouteComponent},
          {path: 'edit/:id', component: TestRouteComponent}
        ]),
        ProductService,
        ToastService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    productService = fixture.debugElement.injector.get(ProductService);
    component.search = new FormControl('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getProducts works correct', async () => {
    const spy = jest
      .spyOn(component.store, 'getAllProducts')
      .mockReturnValueOnce(new Promise((resolve, reject)=> {
        resolve(),
        reject()
      }));
    component.row = 1;
    await component.store.getAllProducts();
    component.store.products = signal(responseData);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.store.products()).toEqual(responseData);
  });

  it('should getProducts works with empty', async () => {
    const spy = jest
      .spyOn(component.store, 'getAllProducts')
      .mockReturnValueOnce(new Promise((resolve)=> {
        resolve()
      }));
    component.row = 0;
    await component.store.getAllProducts();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.store.products()).toEqual([]);
  });

  it('should showModal works correct', () => {
    expect(component.displayModal).toBe(false);
    component.showModal(product);
    expect(component.product).toEqual(product);
    expect(component.displayModal).toBe(true);
  });

  it('should hiddenModal works correct', () => {
    component.showModal(product);
    expect(component.displayModal).toBe(true);
    component.hiddenModal();
    expect(component.displayModal).toBe(false);
  });

  it('should deleteProduct', () => {
    const responseApi: ResponseApi<Product> = {
      message: 'Product Delete',
    };
    const spyProduct = jest
      .spyOn(productService, 'deleteProduct')
      .mockReturnValueOnce(of(responseApi));
    component.showModal(product);
    component.deleteProduct();
    expect(spyProduct).toHaveBeenCalledTimes(1);
    expect(component.product).toEqual(product);
  });

  it('should navigate to Edit', ()=>{
    const router = TestBed.inject(Router);
    const spy = jest.spyOn(router,'navigate');
    component.redirectEdit('12');
    expect(spy).toHaveBeenCalledWith(['edit','12']);
  });

  it('should navigate to New', ()=>{
    const router = TestBed.inject(Router);
    const spy = jest.spyOn(router,'navigate');
    component.redirectNew();
    expect(spy).toHaveBeenCalled();
  });

  it('change value in search', async ()=> {
    component.store.products = signal([product]);
    const searchBox =
        (fixture.debugElement.query(By.css('#search'))
          ?.nativeElement as HTMLTextAreaElement) || undefined;
      expect(searchBox).toBeTruthy();
      searchBox.value = 'tarjeta visa';
      searchBox.dispatchEvent(new Event('input'));
  
      await fixture.whenStable();
      expect(searchBox.value).toEqual('tarjeta visa');
      setTimeout(()=> {
        expect(component.productsFiltered).toEqual([product]);
      }, 300)
  });

});
