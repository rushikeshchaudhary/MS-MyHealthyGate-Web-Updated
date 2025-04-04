import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabReferralModalComponent } from './add-lab-referral-modal.component';

describe('AddLabReferralModalComponent', () => {
  let component: AddLabReferralModalComponent;
  let fixture: ComponentFixture<AddLabReferralModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLabReferralModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLabReferralModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
