import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediCertificateComponent } from './medi-certificate.component';

describe('MediCertificateComponent', () => {
  let component: MediCertificateComponent;
  let fixture: ComponentFixture<MediCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
