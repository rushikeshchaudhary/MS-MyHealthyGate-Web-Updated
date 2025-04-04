import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSchedulingComponent } from './lab-scheduling.component';

describe('LabSchedulingComponent', () => {
  let component: LabSchedulingComponent;
  let fixture: ComponentFixture<LabSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
