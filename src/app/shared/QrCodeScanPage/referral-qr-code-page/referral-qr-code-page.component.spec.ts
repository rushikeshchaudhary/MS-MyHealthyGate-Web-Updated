import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralQrCodePageComponent } from './referral-qr-code-page.component';

describe('ReferralQrCodePageComponent', () => {
  let component: ReferralQrCodePageComponent;
  let fixture: ComponentFixture<ReferralQrCodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralQrCodePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralQrCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
