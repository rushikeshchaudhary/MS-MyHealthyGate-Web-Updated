import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRadiologyProfileComponent } from './edit-radiology-profile.component';

describe('EditRadiologyProfileComponent', () => {
  let component: EditRadiologyProfileComponent;
  let fixture: ComponentFixture<EditRadiologyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRadiologyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRadiologyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
