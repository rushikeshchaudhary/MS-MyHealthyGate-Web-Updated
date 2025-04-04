import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritywecomeComponent } from './securitywecome.component';

describe('SecuritywecomeComponent', () => {
  let component: SecuritywecomeComponent;
  let fixture: ComponentFixture<SecuritywecomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecuritywecomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuritywecomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
