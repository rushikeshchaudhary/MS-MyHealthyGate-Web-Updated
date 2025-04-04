import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallInvitationComponent } from './video-call-invitation.component';

describe('VideoCallInvitationComponent', () => {
  let component: VideoCallInvitationComponent;
  let fixture: ComponentFixture<VideoCallInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCallInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCallInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
