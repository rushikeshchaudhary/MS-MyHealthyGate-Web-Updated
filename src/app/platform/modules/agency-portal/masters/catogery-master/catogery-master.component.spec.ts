import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatogeryMasterComponent } from './catogery-master.component';

describe('CatogeryMasterComponent', () => {
  let component: CatogeryMasterComponent;
  let fixture: ComponentFixture<CatogeryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatogeryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatogeryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
