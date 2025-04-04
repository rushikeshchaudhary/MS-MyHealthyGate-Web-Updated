import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLabAppointmentPatientComponent } from './view-lab-appointment-patient.component';

describe('ViewLabAppointmentPatientComponent', () => {
  let component: ViewLabAppointmentPatientComponent;
  let fixture: ComponentFixture<ViewLabAppointmentPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLabAppointmentPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLabAppointmentPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
