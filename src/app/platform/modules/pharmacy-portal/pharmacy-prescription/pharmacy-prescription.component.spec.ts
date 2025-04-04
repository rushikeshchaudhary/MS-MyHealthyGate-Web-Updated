import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyPrescriptionComponent } from './pharmacy-prescription.component';

describe('PharmacyPrescriptionComponent', () => {
  let component: PharmacyPrescriptionComponent;
  let fixture: ComponentFixture<PharmacyPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
