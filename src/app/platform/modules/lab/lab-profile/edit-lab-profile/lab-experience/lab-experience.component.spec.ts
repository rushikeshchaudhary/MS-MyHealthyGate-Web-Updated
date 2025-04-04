import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabExperienceComponent } from './lab-experience.component';

describe('LabExperienceComponent', () => {
  let component: LabExperienceComponent;
  let fixture: ComponentFixture<LabExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
