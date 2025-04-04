import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminPaymentHistoryComponent } from './super-admin-payment-history.component';

describe('SuperAdminPaymentHistoryComponent', () => {
  let component: SuperAdminPaymentHistoryComponent;
  let fixture: ComponentFixture<SuperAdminPaymentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminPaymentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
