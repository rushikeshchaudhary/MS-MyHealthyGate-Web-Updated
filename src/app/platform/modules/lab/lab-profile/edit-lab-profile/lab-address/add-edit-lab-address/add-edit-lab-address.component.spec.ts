import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLabAddressComponent } from './add-edit-lab-address.component';

describe('AddEditLabAddressComponent', () => {
  let component: AddEditLabAddressComponent;
  let fixture: ComponentFixture<AddEditLabAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditLabAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditLabAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
