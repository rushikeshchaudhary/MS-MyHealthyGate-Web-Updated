import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceModalComponent } from './insurance-modal.component';

describe('InsuranceModalComponent', () => {
  let component: InsuranceModalComponent;
  let fixture: ComponentFixture<InsuranceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
