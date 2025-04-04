import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminupdateraiseticketComponent } from './superadminupdateraiseticket.component';

describe('SuperadminupdateraiseticketComponent', () => {
  let component: SuperadminupdateraiseticketComponent;
  let fixture: ComponentFixture<SuperadminupdateraiseticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadminupdateraiseticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminupdateraiseticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
