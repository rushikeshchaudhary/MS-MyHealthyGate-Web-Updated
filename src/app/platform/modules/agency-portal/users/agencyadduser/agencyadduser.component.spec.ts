import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyadduserComponent } from './agencyadduser.component';

describe('AgencyadduserComponent', () => {
  let component: AgencyadduserComponent;
  let fixture: ComponentFixture<AgencyadduserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyadduserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyadduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
