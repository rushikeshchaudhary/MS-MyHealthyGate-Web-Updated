import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTemplateModalComponent } from './add-template-modal.component';

describe('AddTemplateModalComponent', () => {
  let component: AddTemplateModalComponent;
  let fixture: ComponentFixture<AddTemplateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTemplateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
