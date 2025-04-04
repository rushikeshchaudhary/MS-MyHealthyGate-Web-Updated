import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAvaibilityComponent } from './lab-avaibility.component';

describe('LabAvaibilityComponent', () => {
  let component: LabAvaibilityComponent;
  let fixture: ComponentFixture<LabAvaibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabAvaibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAvaibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
