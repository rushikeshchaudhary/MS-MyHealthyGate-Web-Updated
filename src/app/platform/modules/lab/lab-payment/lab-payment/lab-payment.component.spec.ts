import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPaymentComponent } from './lab-payment.component';

describe('LabPaymentComponent', () => {
  let component: LabPaymentComponent;
  let fixture: ComponentFixture<LabPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
