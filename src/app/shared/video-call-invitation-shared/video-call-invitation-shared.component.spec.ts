import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallInvitationSharedComponent } from './video-call-invitation-shared.component';

describe('VideoCallInvitationSharedComponent', () => {
  let component: VideoCallInvitationSharedComponent;
  let fixture: ComponentFixture<VideoCallInvitationSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCallInvitationSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCallInvitationSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
