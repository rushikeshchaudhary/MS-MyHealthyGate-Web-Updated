import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediCertificateModalComponent } from './medi-certificate-modal.component';

describe('MediCertificateModalComponent', () => {
  let component: MediCertificateModalComponent;
  let fixture: ComponentFixture<MediCertificateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediCertificateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediCertificateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
