import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisedTicketDetailsComponent } from './raised-ticket-details.component';

describe('RaisedTicketDetailsComponent', () => {
  let component: RaisedTicketDetailsComponent;
  let fixture: ComponentFixture<RaisedTicketDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaisedTicketDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaisedTicketDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
