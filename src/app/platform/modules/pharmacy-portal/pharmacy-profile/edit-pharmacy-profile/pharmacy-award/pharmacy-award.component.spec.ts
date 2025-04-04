import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyAwardComponent } from './pharmacy-award.component';

describe('PharmacyAwardComponent', () => {
  let component: PharmacyAwardComponent;
  let fixture: ComponentFixture<PharmacyAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
