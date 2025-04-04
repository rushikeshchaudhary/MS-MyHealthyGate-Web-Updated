import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBookAppointmentModalComponent } from './lab-book-appointment-modal.component';

describe('LabBookAppointmentModalComponent', () => {
  let component: LabBookAppointmentModalComponent;
  let fixture: ComponentFixture<LabBookAppointmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabBookAppointmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabBookAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
