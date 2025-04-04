import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePharmacyComponent } from './profile-pharmacy.component';

describe('ProfilePharmacyComponent', () => {
  let component: ProfilePharmacyComponent;
  let fixture: ComponentFixture<ProfilePharmacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePharmacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
