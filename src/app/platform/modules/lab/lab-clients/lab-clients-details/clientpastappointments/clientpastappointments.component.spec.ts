import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientpastappointmentsComponent } from './clientpastappointments.component';

describe('ClientpastappointmentsComponent', () => {
  let component: ClientpastappointmentsComponent;
  let fixture: ComponentFixture<ClientpastappointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientpastappointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientpastappointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
