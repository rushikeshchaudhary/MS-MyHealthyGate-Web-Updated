import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralForRadiologyComponent } from './referral-for-radiology.component';

describe('ReferralForRadiologyComponent', () => {
  let component: ReferralForRadiologyComponent;
  let fixture: ComponentFixture<ReferralForRadiologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralForRadiologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralForRadiologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
