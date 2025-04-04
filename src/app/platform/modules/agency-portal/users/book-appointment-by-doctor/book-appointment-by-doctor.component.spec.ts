import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAppointmentByDoctorComponent } from './book-appointment-by-doctor.component';

describe('BookAppointmentByDoctorComponent', () => {
  let component: BookAppointmentByDoctorComponent;
  let fixture: ComponentFixture<BookAppointmentByDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookAppointmentByDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAppointmentByDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
