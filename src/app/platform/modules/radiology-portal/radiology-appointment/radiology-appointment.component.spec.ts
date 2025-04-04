import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyAppointmentComponent } from './radiology-appointment.component';

describe('RadiologyAppointmentComponent', () => {
  let component: RadiologyAppointmentComponent;
  let fixture: ComponentFixture<RadiologyAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
