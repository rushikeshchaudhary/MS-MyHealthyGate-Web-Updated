import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRefundHistoryComponent } from './total-refund-history.component';

describe('TotalRefundHistoryComponent', () => {
  let component: TotalRefundHistoryComponent;
  let fixture: ComponentFixture<TotalRefundHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalRefundHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRefundHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
