import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyExperienceComponent } from './radiology-experience.component';

describe('RadiologyExperienceComponent', () => {
  let component: RadiologyExperienceComponent;
  let fixture: ComponentFixture<RadiologyExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
