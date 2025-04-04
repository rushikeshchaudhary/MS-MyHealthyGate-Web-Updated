import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyadduserparentComponent } from './agencyadduserparent.component';

describe('AgencyadduserparentComponent', () => {
  let component: AgencyadduserparentComponent;
  let fixture: ComponentFixture<AgencyadduserparentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyadduserparentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyadduserparentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
