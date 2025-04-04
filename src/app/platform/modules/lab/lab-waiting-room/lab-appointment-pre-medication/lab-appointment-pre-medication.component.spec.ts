import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAppointmentPreMedicationComponent } from './lab-appointment-pre-medication.component';

describe('LabAppointmentPreMedicationComponent', () => {
  let component: LabAppointmentPreMedicationComponent;
  let fixture: ComponentFixture<LabAppointmentPreMedicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabAppointmentPreMedicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAppointmentPreMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
