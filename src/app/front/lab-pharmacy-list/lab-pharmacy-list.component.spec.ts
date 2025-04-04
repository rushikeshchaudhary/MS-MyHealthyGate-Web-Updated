import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabListApprovedComponent } from './lab-pharmacy-list.component';

describe('LabListApprovedComponent', () => {
  let component: LabListApprovedComponent;
  let fixture: ComponentFixture<LabListApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabListApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabListApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
