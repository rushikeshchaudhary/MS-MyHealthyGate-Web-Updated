import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyClientComponent } from './radiology-client.component';

describe('RadiologyClientComponent', () => {
  let component: RadiologyClientComponent;
  let fixture: ComponentFixture<RadiologyClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
