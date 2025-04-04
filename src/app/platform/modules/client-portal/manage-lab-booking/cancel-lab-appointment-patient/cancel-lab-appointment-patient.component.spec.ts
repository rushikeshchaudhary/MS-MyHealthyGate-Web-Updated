import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelLabAppointmentPatientComponent } from './cancel-lab-appointment-patient.component';

describe('CancelLabAppointmentPatientComponent', () => {
  let component: CancelLabAppointmentPatientComponent;
  let fixture: ComponentFixture<CancelLabAppointmentPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelLabAppointmentPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelLabAppointmentPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
