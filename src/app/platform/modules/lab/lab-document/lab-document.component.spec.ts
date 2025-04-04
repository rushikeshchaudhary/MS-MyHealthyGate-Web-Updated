import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabDocumentComponent } from './lab-document.component';

describe('LabDocumentComponent', () => {
  let component: LabDocumentComponent;
  let fixture: ComponentFixture<LabDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
