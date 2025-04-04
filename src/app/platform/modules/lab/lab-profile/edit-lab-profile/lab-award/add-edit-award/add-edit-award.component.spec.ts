import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAwardComponent } from './add-edit-award.component';

describe('AddEditAwardComponent', () => {
  let component: AddEditAwardComponent;
  let fixture: ComponentFixture<AddEditAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
