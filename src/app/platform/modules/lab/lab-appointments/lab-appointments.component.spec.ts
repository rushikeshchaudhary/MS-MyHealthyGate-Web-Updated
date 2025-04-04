import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAppointmentsComponent } from './lab-appointments.component';

describe('LabAppointmentsComponent', () => {
  let component: LabAppointmentsComponent;
  let fixture: ComponentFixture<LabAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
