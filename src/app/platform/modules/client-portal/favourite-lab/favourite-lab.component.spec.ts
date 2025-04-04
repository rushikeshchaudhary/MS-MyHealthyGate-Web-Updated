import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteLabComponent } from './favourite-lab.component';

describe('FavouriteLabComponent', () => {
  let component: FavouriteLabComponent;
  let fixture: ComponentFixture<FavouriteLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
