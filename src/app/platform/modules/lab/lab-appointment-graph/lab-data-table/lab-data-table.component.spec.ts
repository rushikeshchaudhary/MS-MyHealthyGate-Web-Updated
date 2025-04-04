import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabDataTableComponent } from './lab-data-table.component';

describe('LabDataTableComponent', () => {
  let component: LabDataTableComponent;
  let fixture: ComponentFixture<LabDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
