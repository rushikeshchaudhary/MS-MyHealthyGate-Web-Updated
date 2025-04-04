import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteProviderComponent } from './favourite-provider.component';

describe('FavouriteProviderComponent', () => {
  let component: FavouriteProviderComponent;
  let fixture: ComponentFixture<FavouriteProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
