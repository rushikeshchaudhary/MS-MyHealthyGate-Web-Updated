import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyAddressComponent } from './radiology-address.component';

describe('RadiologyAddressComponent', () => {
  let component: RadiologyAddressComponent;
  let fixture: ComponentFixture<RadiologyAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
