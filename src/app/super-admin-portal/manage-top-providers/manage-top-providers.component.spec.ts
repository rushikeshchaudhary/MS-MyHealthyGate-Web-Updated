import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTopProvidersComponent } from './manage-top-providers.component';

describe('ManageTopProvidersComponent', () => {
  let component: ManageTopProvidersComponent;
  let fixture: ComponentFixture<ManageTopProvidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTopProvidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTopProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
