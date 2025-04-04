import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabActionDialogBoxComponent } from './lab-action-dialog-box.component';

describe('LabActionDialogBoxComponent', () => {
  let component: LabActionDialogBoxComponent;
  let fixture: ComponentFixture<LabActionDialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabActionDialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabActionDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
