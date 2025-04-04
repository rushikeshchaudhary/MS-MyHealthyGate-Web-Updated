import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyInformationComponent } from './pharmacy-information.component';

describe('PharmacyInformationComponent', () => {
  let component: PharmacyInformationComponent;
  let fixture: ComponentFixture<PharmacyInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
