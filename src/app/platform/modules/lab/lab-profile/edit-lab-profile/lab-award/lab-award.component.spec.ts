import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAwardComponent } from './lab-award.component';

describe('LabAwardComponent', () => {
  let component: LabAwardComponent;
  let fixture: ComponentFixture<LabAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
