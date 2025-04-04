import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPrescriptionComponent } from './shared-prescription.component';

describe('SharedPrescriptionComponent', () => {
  let component: SharedPrescriptionComponent;
  let fixture: ComponentFixture<SharedPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
