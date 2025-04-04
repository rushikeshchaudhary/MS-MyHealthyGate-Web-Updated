import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCodeResultScanLandingPageComponent } from './qrcode-result-scan-landing-page.component';

describe('QRCodeResultScanLandingPageComponent', () => {
  let component: QRCodeResultScanLandingPageComponent;
  let fixture: ComponentFixture<QRCodeResultScanLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QRCodeResultScanLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRCodeResultScanLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
