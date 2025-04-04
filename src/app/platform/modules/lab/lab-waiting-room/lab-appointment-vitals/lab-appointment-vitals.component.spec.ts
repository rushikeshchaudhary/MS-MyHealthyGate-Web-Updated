import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAppointmentVitalsComponent } from './lab-appointment-vitals.component';

describe('LabAppointmentVitalsComponent', () => {
  let component: LabAppointmentVitalsComponent;
  let fixture: ComponentFixture<LabAppointmentVitalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabAppointmentVitalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAppointmentVitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
