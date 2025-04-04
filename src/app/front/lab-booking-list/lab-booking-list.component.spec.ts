import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBookingListComponent } from './lab-booking-list.component';

describe('LabBookingListComponent', () => {
  let component: LabBookingListComponent;
  let fixture: ComponentFixture<LabBookingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabBookingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
