import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMasterAllergiesComponent } from './create-master-allergies.component';

describe('CreateMasterAllergiesComponent', () => {
  let component: CreateMasterAllergiesComponent;
  let fixture: ComponentFixture<CreateMasterAllergiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMasterAllergiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMasterAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
