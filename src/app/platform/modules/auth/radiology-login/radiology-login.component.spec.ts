import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyLoginComponent } from './radiology-login.component';

describe('RadiologyLoginComponent', () => {
  let component: RadiologyLoginComponent;
  let fixture: ComponentFixture<RadiologyLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
