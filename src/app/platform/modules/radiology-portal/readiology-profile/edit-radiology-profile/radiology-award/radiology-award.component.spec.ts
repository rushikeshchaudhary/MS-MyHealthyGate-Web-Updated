import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyAwardComponent } from './radiology-award.component';

describe('RadiologyAwardComponent', () => {
  let component: RadiologyAwardComponent;
  let fixture: ComponentFixture<RadiologyAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
