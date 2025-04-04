import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryMasterDataComponent } from './create-category-master-data.component';

describe('CreateCategoryMasterDataComponent', () => {
  let component: CreateCategoryMasterDataComponent;
  let fixture: ComponentFixture<CreateCategoryMasterDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCategoryMasterDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoryMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
