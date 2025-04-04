import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAddressComponent } from './lab-address.component';

describe('LabAddressComponent', () => {
  let component: LabAddressComponent;
  let fixture: ComponentFixture<LabAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
