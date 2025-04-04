import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLabComponent } from './profile-lab.component';

describe('ProfileLabComponent', () => {
  let component: ProfileLabComponent;
  let fixture: ComponentFixture<ProfileLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
