import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyQualificationnComponent } from './radiology-qualificationn.component';

describe('RadiologyQualificationnComponent', () => {
  let component: RadiologyQualificationnComponent;
  let fixture: ComponentFixture<RadiologyQualificationnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyQualificationnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyQualificationnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
