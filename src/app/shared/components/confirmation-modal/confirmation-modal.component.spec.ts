import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title input', () => {
    component.title = 'Test Title';
    expect(component.title).toBe('Test Title');
  });

  it('should emit confirm event when confirmAction is called', () => {
    const spy = jest.spyOn(component.confirm, 'emit'); // Espía el evento confirm

    component.confirmAction();

    expect(spy).toHaveBeenCalledWith(true); // Verifica que se emita el evento
  });

  it('should emit cancel event when closeAction is called', () => {
    const spy = jest.spyOn(component.cancel, 'emit');

    component.closeAction();

    expect(spy).toHaveBeenCalledWith(true);
  });
});
