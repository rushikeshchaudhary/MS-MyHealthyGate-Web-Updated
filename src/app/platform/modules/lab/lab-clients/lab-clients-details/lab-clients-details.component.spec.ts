import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabClientsDetailsComponent } from './lab-clients-details.component';

describe('LabClientsDetailsComponent', () => {
  let component: LabClientsDetailsComponent;
  let fixture: ComponentFixture<LabClientsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabClientsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabClientsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
