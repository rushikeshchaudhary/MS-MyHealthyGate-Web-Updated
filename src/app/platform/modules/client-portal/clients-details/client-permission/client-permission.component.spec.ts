import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPermissionComponent } from './client-permission.component';

describe('ClientPermissionComponent', () => {
  let component: ClientPermissionComponent;
  let fixture: ComponentFixture<ClientPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
