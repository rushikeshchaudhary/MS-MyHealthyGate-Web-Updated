import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentActionComponent } from './appointment-action.component';

describe('AppointmentActionComponent', () => {
  let component: AppointmentActionComponent;
  let fixture: ComponentFixture<AppointmentActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
