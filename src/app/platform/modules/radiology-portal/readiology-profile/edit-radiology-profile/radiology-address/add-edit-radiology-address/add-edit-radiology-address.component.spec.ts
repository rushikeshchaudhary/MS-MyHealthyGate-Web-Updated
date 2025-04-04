import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRadiologyAddressComponent } from './add-edit-radiology-address.component';

describe('AddEditRadiologyAddressComponent', () => {
  let component: AddEditRadiologyAddressComponent;
  let fixture: ComponentFixture<AddEditRadiologyAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditRadiologyAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRadiologyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
