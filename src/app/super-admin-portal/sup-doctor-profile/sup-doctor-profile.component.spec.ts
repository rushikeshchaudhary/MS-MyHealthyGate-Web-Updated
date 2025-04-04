import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupDoctorProfileComponent } from './sup-doctor-profile.component';

describe('SupDoctorProfileComponent', () => {
  let component: SupDoctorProfileComponent;
  let fixture: ComponentFixture<SupDoctorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupDoctorProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupDoctorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
