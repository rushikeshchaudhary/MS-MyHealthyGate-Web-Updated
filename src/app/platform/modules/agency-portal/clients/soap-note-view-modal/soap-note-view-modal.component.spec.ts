import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoapNoteViewModalComponent } from './soap-note-view-modal.component';

describe('SoapNoteViewModalComponent', () => {
  let component: SoapNoteViewModalComponent;
  let fixture: ComponentFixture<SoapNoteViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoapNoteViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoapNoteViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
