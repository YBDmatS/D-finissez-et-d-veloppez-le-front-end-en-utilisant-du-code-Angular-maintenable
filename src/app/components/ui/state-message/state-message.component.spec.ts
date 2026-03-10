import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateMessageComponent } from './state-message.component';

describe('StateMessageComponent', () => {
  let component: StateMessageComponent;
  let fixture: ComponentFixture<StateMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StateMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateMessageComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.state = 'loading';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the loading state', () => {
    component.state = 'loading';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.state-message--loading')).toBeTruthy();
  });

  it('should render the error state with the provided message', () => {
    component.state = 'error';
    component.message = 'Country not found.';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.state-message--error')?.textContent).toContain('Country not found.');
  });

  it('should render the empty state with the default message', () => {
    component.state = 'empty';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.state-message--empty')?.textContent).toContain('No data available.');
  });
});
