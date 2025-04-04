import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPatientNotesComponent } from './doctor-patient-notes.component';

describe('DoctorPatientNotesComponent', () => {
  let component: DoctorPatientNotesComponent;
  let fixture: ComponentFixture<DoctorPatientNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorPatientNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorPatientNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
