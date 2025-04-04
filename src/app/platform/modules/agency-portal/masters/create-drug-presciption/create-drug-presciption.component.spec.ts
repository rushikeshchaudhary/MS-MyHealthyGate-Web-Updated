import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDrugPresciptionComponent } from './create-drug-presciption.component';

describe('CreateDrugPresciptionComponent', () => {
  let component: CreateDrugPresciptionComponent;
  let fixture: ComponentFixture<CreateDrugPresciptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDrugPresciptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrugPresciptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
