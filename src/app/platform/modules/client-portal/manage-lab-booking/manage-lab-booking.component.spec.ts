import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLabBookingComponent } from './manage-lab-booking.component';

describe('ManageLabBookingComponent', () => {
  let component: ManageLabBookingComponent;
  let fixture: ComponentFixture<ManageLabBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLabBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLabBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
