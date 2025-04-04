import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientModalComponent } from './add-patient-modal.component';

describe('AddPatientModalComponent', () => {
  let component: AddPatientModalComponent;
  let fixture: ComponentFixture<AddPatientModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatientModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
