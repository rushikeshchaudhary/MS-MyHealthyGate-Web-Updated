import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateImmunizationDetailsComponent } from './create-immunization-details.component';

describe('CreateImmunizationDetailsComponent', () => {
  let component: CreateImmunizationDetailsComponent;
  let fixture: ComponentFixture<CreateImmunizationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateImmunizationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateImmunizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
