import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSoapViewNoteModelComponent } from './shared-soap-view-note-model.component';

describe('SharedSoapViewNoteModelComponent', () => {
  let component: SharedSoapViewNoteModelComponent;
  let fixture: ComponentFixture<SharedSoapViewNoteModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedSoapViewNoteModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSoapViewNoteModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
