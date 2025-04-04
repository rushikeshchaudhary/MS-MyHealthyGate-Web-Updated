import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationLabPharmacyComponent } from './registration-lab-pharmacy.component';

describe('RegistrationLabPharmacyComponent', () => {
  let component: RegistrationLabPharmacyComponent;
  let fixture: ComponentFixture<RegistrationLabPharmacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationLabPharmacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationLabPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
