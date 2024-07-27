import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('Banco');
  });

  it('should have a top bar with background color #f8f8f8', () => {
    const compiled = fixture.nativeElement;
    const topBar = compiled.querySelector('.top-bar');
    expect(window.getComputedStyle(topBar).backgroundColor).toBe(
      'rgb(248, 248, 248)',
    );
  });

  it('should have a top bar with border bottom', () => {
    const compiled = fixture.nativeElement;
    const topBar = compiled.querySelector('.top-bar');
    expect(window.getComputedStyle(topBar).borderBottom).toContain('1px solid');
  });
});
