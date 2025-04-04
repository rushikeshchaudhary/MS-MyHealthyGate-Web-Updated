import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserAwardComponent } from './add-edit-user-award.component';

describe('AddEditUserAwardComponent', () => {
  let component: AddEditUserAwardComponent;
  let fixture: ComponentFixture<AddEditUserAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditUserAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUserAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
