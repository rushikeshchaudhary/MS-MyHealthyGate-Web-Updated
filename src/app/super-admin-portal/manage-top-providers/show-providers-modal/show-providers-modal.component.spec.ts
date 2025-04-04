import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProvidersModalComponent } from './show-providers-modal.component';

describe('ShowProvidersModalComponent', () => {
  let component: ShowProvidersModalComponent;
  let fixture: ComponentFixture<ShowProvidersModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowProvidersModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProvidersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
