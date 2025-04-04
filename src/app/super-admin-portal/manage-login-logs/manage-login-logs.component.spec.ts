import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagLoginLogsComponent } from './manage-login-logs.component';

describe('ManagLoginLogsComponent', () => {
  let component: ManagLoginLogsComponent;
  let fixture: ComponentFixture<ManagLoginLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagLoginLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagLoginLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
