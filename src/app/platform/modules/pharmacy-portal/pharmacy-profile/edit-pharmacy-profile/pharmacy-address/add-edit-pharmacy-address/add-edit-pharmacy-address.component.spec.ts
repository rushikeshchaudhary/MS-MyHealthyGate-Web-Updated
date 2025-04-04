import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPharmacyAddressComponent } from './add-edit-pharmacy-address.component';

describe('AddEditPharmacyAddressComponent', () => {
  let component: AddEditPharmacyAddressComponent;
  let fixture: ComponentFixture<AddEditPharmacyAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPharmacyAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPharmacyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
