import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRadiologyComponent } from './profile-radiology.component';

describe('ProfileRadiologyComponent', () => {
  let component: ProfileRadiologyComponent;
  let fixture: ComponentFixture<ProfileRadiologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileRadiologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRadiologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
