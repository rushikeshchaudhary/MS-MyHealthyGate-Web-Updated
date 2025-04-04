import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabInformationComponent } from './lab-information.component';

describe('LabInformationComponent', () => {
  let component: LabInformationComponent;
  let fixture: ComponentFixture<LabInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
