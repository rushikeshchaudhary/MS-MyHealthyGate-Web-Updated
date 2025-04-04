import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProviderProfileComponent } from './show-provider-profile.component';

describe('ShowProviderProfileComponent', () => {
  let component: ShowProviderProfileComponent;
  let fixture: ComponentFixture<ShowProviderProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowProviderProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProviderProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
