import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilitySlotComponent } from './availability-slot.component';

describe('ReviewRatingComponent', () => {
  let component: AvailabilitySlotComponent;
  let fixture: ComponentFixture<AvailabilitySlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilitySlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilitySlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
