import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionDrugDetailsComponent } from './prescription-drug-details.component';

describe('PrescriptionDrugDetailsComponent', () => {
  let component: PrescriptionDrugDetailsComponent;
  let fixture: ComponentFixture<PrescriptionDrugDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionDrugDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionDrugDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
