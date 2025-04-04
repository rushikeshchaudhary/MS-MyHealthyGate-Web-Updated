import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompanyDetailsComponent } from './insurance-company-details.component';

describe('InsuranceCompanyDetailsComponent', () => {
  let component: InsuranceCompanyDetailsComponent;
  let fixture: ComponentFixture<InsuranceCompanyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceCompanyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
