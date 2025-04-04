import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestDownloadModalComponent } from './lab-test-download-modal.component';

describe('LabTestDownloadModalComponent', () => {
  let component: LabTestDownloadModalComponent;
  let fixture: ComponentFixture<LabTestDownloadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabTestDownloadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTestDownloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
