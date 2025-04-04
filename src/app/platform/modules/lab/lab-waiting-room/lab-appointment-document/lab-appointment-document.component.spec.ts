import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAppointmentDocumentComponent } from './lab-appointment-document.component';

describe('LabAppointmentDocumentComponent', () => {
  let component: LabAppointmentDocumentComponent;
  let fixture: ComponentFixture<LabAppointmentDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabAppointmentDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAppointmentDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
