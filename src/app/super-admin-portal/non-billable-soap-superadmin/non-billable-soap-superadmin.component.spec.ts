import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonBillableSoapSuperadminComponent } from './non-billable-soap-superadmin.component';

describe('NonBillableSoapSuperadminComponent', () => {
  let component: NonBillableSoapSuperadminComponent;
  let fixture: ComponentFixture<NonBillableSoapSuperadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonBillableSoapSuperadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonBillableSoapSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
