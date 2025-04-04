import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAuditLogsComponent } from './manage-audit-logs.component';

describe('ManageAuditLogsComponent', () => {
  let component: ManageAuditLogsComponent;
  let fixture: ComponentFixture<ManageAuditLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAuditLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAuditLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
