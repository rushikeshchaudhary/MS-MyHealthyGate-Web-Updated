import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRadiologyComponent } from './manage-radiology.component';

describe('ManageRadiologyComponent', () => {
  let component: ManageRadiologyComponent;
  let fixture: ComponentFixture<ManageRadiologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRadiologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRadiologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
