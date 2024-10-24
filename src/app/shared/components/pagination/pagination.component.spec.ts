import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

const page = 1;

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should emit changePage event when changePageCurrent is called', ()=> {
    const spy = jest.spyOn(component.changePage, 'emit');
    component.changePageCurrent(page);

    expect(spy).toHaveBeenCalledWith(page);
    expect(component.page).toEqual(page)
  })

  it('should emit changeRow event and recalculate pages when changeCountedRow is called', ()=> {
    const spy = jest.spyOn(component.changeRow, 'emit');
    component.total = 100;
    component.row = 10; 
    component.changeCountedRow();

    expect(spy).toHaveBeenCalledWith(10);
    expect(component.totalPage).toBe(10);
  })
});
