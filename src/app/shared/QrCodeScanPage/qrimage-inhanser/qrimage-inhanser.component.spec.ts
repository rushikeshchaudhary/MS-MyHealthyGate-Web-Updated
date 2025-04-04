import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QRImageInhanserComponent } from './qrimage-inhanser.component';

describe('QRImageInhanserComponent', () => {
  let component: QRImageInhanserComponent;
  let fixture: ComponentFixture<QRImageInhanserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QRImageInhanserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRImageInhanserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
