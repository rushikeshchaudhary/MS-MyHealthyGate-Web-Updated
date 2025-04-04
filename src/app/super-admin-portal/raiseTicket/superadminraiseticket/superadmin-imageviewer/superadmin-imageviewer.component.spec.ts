import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminImageviewerComponent } from './superadmin-imageviewer.component';

describe('SuperadminImageviewerComponent', () => {
  let component: SuperadminImageviewerComponent;
  let fixture: ComponentFixture<SuperadminImageviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadminImageviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminImageviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
