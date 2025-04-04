import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymentforadminComponent } from './manage-paymentforadmin.component';

describe('ManagePaymentforadminComponent', () => {
  let component: ManagePaymentforadminComponent;
  let fixture: ComponentFixture<ManagePaymentforadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePaymentforadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaymentforadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
