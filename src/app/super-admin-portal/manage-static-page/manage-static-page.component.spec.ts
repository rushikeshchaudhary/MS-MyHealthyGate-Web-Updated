import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStaticPageComponent } from './manage-static-page.component';

describe('ManageStaticPageComponent', () => {
  let component: ManageStaticPageComponent;
  let fixture: ComponentFixture<ManageStaticPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStaticPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStaticPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
