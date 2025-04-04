import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyAppointmentGraphComponent } from './pharmacy-appointment-graph.component';

describe('PharmacyAppointmentGraphComponent', () => {
  let component: PharmacyAppointmentGraphComponent;
  let fixture: ComponentFixture<PharmacyAppointmentGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyAppointmentGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyAppointmentGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
