import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabDocumentModalComponent } from './lab-document-modal.component';

describe('LabDocumentModalComponent', () => {
  let component: LabDocumentModalComponent;
  let fixture: ComponentFixture<LabDocumentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabDocumentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
