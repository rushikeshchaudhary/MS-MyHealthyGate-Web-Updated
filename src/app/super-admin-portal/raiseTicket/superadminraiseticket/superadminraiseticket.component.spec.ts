import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminraiseticketComponent } from './superadminraiseticket.component';

describe('SuperadminraiseticketComponent', () => {
  let component: SuperadminraiseticketComponent;
  let fixture: ComponentFixture<SuperadminraiseticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadminraiseticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminraiseticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
