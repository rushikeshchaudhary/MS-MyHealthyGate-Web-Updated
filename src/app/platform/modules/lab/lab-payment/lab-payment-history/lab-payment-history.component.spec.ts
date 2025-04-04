import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPaymentHistoryComponent } from './lab-payment-history.component';

describe('LabPaymentHistoryComponent', () => {
  let component: LabPaymentHistoryComponent;
  let fixture: ComponentFixture<LabPaymentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabPaymentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
