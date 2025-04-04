import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteRadiologyComponent } from './favourite-radiology.component';

describe('FavouriteRadiologyComponent', () => {
  let component: FavouriteRadiologyComponent;
  let fixture: ComponentFixture<FavouriteRadiologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteRadiologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteRadiologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
