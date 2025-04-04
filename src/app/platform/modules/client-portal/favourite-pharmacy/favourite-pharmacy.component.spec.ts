import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritePharmacyComponent } from './favourite-pharmacy.component';

describe('FavouritePharmacyComponent', () => {
  let component: FavouritePharmacyComponent;
  let fixture: ComponentFixture<FavouritePharmacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouritePharmacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritePharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
