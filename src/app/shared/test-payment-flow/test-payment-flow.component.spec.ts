import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPaymentFlowComponent } from './test-payment-flow.component';

describe('TestPaymentFlowComponent', () => {
  let component: TestPaymentFlowComponent;
  let fixture: ComponentFixture<TestPaymentFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPaymentFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPaymentFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
