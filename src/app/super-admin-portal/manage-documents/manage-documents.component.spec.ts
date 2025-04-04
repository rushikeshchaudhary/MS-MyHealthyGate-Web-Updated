import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDocumentsComponent } from './manage-documents.component';

describe('ManageDocumentsComponent', () => {
  let component: ManageDocumentsComponent;
  let fixture: ComponentFixture<ManageDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
