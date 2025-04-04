import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDocModalComponent } from './patient-doc-modal.component';

describe('PatientDocModalComponent', () => {
  let component: PatientDocModalComponent;
  let fixture: ComponentFixture<PatientDocModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDocModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDocModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
