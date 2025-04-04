import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabReferrralFileUploadComponent } from './lab-referrral-file-upload.component';

describe('LabReferrralFileUploadComponent', () => {
  let component: LabReferrralFileUploadComponent;
  let fixture: ComponentFixture<LabReferrralFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabReferrralFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabReferrralFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
