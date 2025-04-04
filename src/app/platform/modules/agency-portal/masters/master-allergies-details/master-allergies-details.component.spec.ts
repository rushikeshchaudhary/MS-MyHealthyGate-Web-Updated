import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAllergiesDetailsComponent } from './master-allergies-details.component';

describe('MasterAllergiesDetailsComponent', () => {
  let component: MasterAllergiesDetailsComponent;
  let fixture: ComponentFixture<MasterAllergiesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAllergiesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAllergiesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
