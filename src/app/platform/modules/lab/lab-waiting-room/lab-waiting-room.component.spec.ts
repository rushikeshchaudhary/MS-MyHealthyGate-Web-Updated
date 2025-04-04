import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabWaitingRoomComponent } from './lab-waiting-room.component';

describe('LabWaitingRoomComponent', () => {
  let component: LabWaitingRoomComponent;
  let fixture: ComponentFixture<LabWaitingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabWaitingRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabWaitingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
