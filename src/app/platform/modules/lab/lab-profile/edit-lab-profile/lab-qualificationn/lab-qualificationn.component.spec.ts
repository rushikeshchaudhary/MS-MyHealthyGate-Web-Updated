import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabQualificationnComponent } from './lab-qualificationn.component';

describe('LabQualificationnComponent', () => {
  let component: LabQualificationnComponent;
  let fixture: ComponentFixture<LabQualificationnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabQualificationnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabQualificationnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
