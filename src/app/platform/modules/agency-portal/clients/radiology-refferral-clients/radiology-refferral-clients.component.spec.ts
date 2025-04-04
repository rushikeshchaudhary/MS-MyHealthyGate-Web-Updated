import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyRefferralClientsComponent } from './radiology-refferral-clients.component';

describe('RadiologyRefferralClientsComponent', () => {
  let component: RadiologyRefferralClientsComponent;
  let fixture: ComponentFixture<RadiologyRefferralClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyRefferralClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyRefferralClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
