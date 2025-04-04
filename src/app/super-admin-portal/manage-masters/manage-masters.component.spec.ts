import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMastersComponent } from './manage-masters.component';

describe('ManageMastersComponent', () => {
  let component: ManageMastersComponent;
  let fixture: ComponentFixture<ManageMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
