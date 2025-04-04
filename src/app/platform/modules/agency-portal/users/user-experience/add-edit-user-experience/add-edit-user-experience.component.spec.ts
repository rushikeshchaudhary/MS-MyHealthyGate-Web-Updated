import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserExperienceComponent } from './add-edit-user-experience.component';

describe('AddEditUserExperienceComponent', () => {
  let component: AddEditUserExperienceComponent;
  let fixture: ComponentFixture<AddEditUserExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditUserExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUserExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
