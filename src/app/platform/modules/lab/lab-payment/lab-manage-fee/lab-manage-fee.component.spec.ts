import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabManageFeeComponent } from './lab-manage-fee.component';

describe('LabManageFeeComponent', () => {
  let component: LabManageFeeComponent;
  let fixture: ComponentFixture<LabManageFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabManageFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabManageFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
