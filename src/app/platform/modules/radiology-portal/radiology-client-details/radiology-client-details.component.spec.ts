import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyClientDetailsComponent } from './radiology-client-details.component';

describe('RadiologyClientDetailsComponent', () => {
  let component: RadiologyClientDetailsComponent;
  let fixture: ComponentFixture<RadiologyClientDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyClientDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
