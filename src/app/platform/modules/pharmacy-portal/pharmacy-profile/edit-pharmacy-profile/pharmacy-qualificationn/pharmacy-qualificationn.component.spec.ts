import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyQualificationnComponent } from './pharmacy-qualificationn.component';

describe('PharmacyQualificationnComponent', () => {
  let component: PharmacyQualificationnComponent;
  let fixture: ComponentFixture<PharmacyQualificationnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyQualificationnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyQualificationnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
