import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabRefundHistoryComponent } from './lab-refund-history.component';

describe('LabRefundHistoryComponent', () => {
  let component: LabRefundHistoryComponent;
  let fixture: ComponentFixture<LabRefundHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabRefundHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabRefundHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
