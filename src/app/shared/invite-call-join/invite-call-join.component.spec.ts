import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteCallJoinComponent } from './invite-call-join.component';

describe('InviteCallJoinComponent', () => {
  let component: InviteCallJoinComponent;
  let fixture: ComponentFixture<InviteCallJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteCallJoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteCallJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
