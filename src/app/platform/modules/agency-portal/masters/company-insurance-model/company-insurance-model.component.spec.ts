import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInsuranceModelComponent } from './company-insurance-model.component';

describe('CompanyInsuranceModelComponent', () => {
  let component: CompanyInsuranceModelComponent;
  let fixture: ComponentFixture<CompanyInsuranceModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyInsuranceModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInsuranceModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
