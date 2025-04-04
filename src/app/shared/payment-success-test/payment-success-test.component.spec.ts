import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSuccessTestComponent } from './payment-success-test.component';

describe('PaymentSuccessTestComponent', () => {
  let component: PaymentSuccessTestComponent;
  let fixture: ComponentFixture<PaymentSuccessTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSuccessTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSuccessTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
