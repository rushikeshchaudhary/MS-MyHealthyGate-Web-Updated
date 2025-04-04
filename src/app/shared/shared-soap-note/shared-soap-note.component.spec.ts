import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSoapNoteComponent } from './shared-soap-note.component';

describe('SharedSoapNoteComponent', () => {
  let component: SharedSoapNoteComponent;
  let fixture: ComponentFixture<SharedSoapNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedSoapNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSoapNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
