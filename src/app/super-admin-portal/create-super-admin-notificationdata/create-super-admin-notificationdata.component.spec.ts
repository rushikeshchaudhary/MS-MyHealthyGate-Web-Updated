import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSuperAdminNotificationdataComponent } from './create-super-admin-notificationdata.component';

describe('CreateSuperAdminNotificationdataComponent', () => {
  let component: CreateSuperAdminNotificationdataComponent;
  let fixture: ComponentFixture<CreateSuperAdminNotificationdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSuperAdminNotificationdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSuperAdminNotificationdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
