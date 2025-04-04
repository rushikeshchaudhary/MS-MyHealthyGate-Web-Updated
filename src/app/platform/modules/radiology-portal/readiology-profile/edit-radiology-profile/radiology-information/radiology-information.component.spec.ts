import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyInformationComponent } from './radiology-information.component';

describe('RadiologyInformationComponent', () => {
  let component: RadiologyInformationComponent;
  let fixture: ComponentFixture<RadiologyInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
