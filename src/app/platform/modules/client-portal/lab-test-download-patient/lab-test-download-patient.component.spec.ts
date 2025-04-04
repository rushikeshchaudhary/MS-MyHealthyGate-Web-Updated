import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestDownloadPatientComponent } from './lab-test-download-patient.component';

describe('LabTestDownloadPatientComponent', () => {
  let component: LabTestDownloadPatientComponent;
  let fixture: ComponentFixture<LabTestDownloadPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabTestDownloadPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTestDownloadPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
