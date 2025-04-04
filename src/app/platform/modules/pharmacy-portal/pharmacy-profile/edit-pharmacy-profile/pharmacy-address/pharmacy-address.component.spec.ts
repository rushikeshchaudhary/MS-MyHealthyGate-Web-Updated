import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyAddressComponent } from './pharmacy-address.component';

describe('PharmacyAddressComponent', () => {
  let component: PharmacyAddressComponent;
  let fixture: ComponentFixture<PharmacyAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
