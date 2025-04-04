import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupPharmacyProfileComponent } from './sup-pharmacy-profile.component';

describe('SupPharmacyProfileComponent', () => {
  let component: SupPharmacyProfileComponent;
  let fixture: ComponentFixture<SupPharmacyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupPharmacyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupPharmacyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
