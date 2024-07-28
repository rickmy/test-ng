import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TopBarComponent,
        ToastComponent,
        SpinnerComponent,
        RouterOutlet
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
