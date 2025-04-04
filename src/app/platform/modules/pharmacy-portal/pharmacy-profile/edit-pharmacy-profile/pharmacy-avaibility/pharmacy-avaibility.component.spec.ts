import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyAvaibilityComponent } from './pharmacy-avaibility.component';

describe('PharmacyAvaibilityComponent', () => {
  let component: PharmacyAvaibilityComponent;
  let fixture: ComponentFixture<PharmacyAvaibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyAvaibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyAvaibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
