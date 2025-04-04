import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabClientsComponent } from './lab-clients.component';

describe('LabClientsComponent', () => {
  let component: LabClientsComponent;
  let fixture: ComponentFixture<LabClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
