import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAppointmentGraphComponent } from './lab-appointment-graph.component';

describe('LabAppointmentGraphComponent', () => {
  let component: LabAppointmentGraphComponent;
  let fixture: ComponentFixture<LabAppointmentGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabAppointmentGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAppointmentGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
