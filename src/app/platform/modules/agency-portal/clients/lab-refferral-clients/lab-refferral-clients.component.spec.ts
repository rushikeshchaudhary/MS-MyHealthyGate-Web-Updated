import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabRefferralClientsComponent } from './lab-refferral-clients.component';

describe('LabRefferralClientsComponent', () => {
  let component: LabRefferralClientsComponent;
  let fixture: ComponentFixture<LabRefferralClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabRefferralClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabRefferralClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
